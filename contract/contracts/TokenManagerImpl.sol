// SPDX-License-Identifier: Private Use
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC777/ERC777.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "./TokenManagerAbstract.sol";

contract TokenManagerImpl is TokenManagerAbstract {
    using Counters for Counters.Counter;
    using SafeMath for uint256;
    constructor() TokenManagerAbstract(new address[](0)) {}

    function withdraw() external returns (bool){
        uint balance = balanceOf(msg.sender);
        require(balance == totalSupply(), "TokenManager: you don't own all tokens to withdraw");
        if(countERC721 > 0){
            IERC721(nftAddress).safeTransferFrom(address(this),msg.sender,nftId,"");
        }
        if(countERC1155 > 0){
            IERC1155(nftAddress).safeTransferFrom(address(this),msg.sender,nftId,countERC1155,"");
        }
        countERC721 = 0;
        countERC1155 = 0;
        _approve(msg.sender, msg.sender, balance);
        transfer(address(this), balance);
        drop();
        return true;
    }

    function makeBuyOrderCoin(uint256 amount, bool fillOrKill) external payable returns (bool){
        require(msg.value > 0, "TokenManager: offer should be greater than 0");
        buyCounter.increment();
        uint id = buyCounter.current();
        buyOrders[id] = Order({
            id: id,
            amount: amount,
            amountExecuted: 0,
            currency: address(0),
            fillOrKill: fillOrKill,
            at: block.timestamp,
            owner: msg.sender,
            cost: msg.value,
            costExecuted: 0,
            buy: true
        });
        buyOrdersByOwner[msg.sender].push(id);
        track(msg.sender, myId);
        return true;
    }

    function makeBuyOrderToken(uint256 amount, uint256 cost, address currency, bool fillOrKill) external returns (bool){
        require(cost > 0, "TokenManager: offer should be greater than 0");
        require(amount > 0, "TokenManager: asked token should be greater than 0");
        require(currency != address(0), "TokenManager: should set currency");
        bool res = IERC20(currency).transferFrom(msg.sender, address(this), cost);
        require(res == true, "TokenManager: transfer failed");
        buyCounter.increment();
        uint id = buyCounter.current();
        buyOrders[id] = Order({
            id: id,
            amount: amount,
            amountExecuted: 0,
            currency: currency,
            fillOrKill: fillOrKill,
            at: block.timestamp,
            owner: msg.sender,
            cost: cost,
            costExecuted: 0,
            buy: true
        });
        buyOrdersByOwner[msg.sender].push(id);
        track(msg.sender, myId);
        return true;
    }


    function makeSellOrder(uint256 amount, uint256 cost, address currency, bool fillOrKill) external returns (bool){
        require(cost > 0, "TokenManager: offer should be greater than 0");
        require(amount > 0, "TokenManager: asked token should be greater than 0");
        bool res = transfer(address(this), amount);
        require(res == true, "TokenManager: transfer failed");
        sellCounter.increment();
        uint id = sellCounter.current();
        sellOrders[id] = Order({
            id: id,
            amount: amount,
            amountExecuted: 0,
            cost: cost,
            costExecuted: 0,
            currency: currency,
            fillOrKill: fillOrKill,
            at: block.timestamp,
            owner: msg.sender,
            buy: false
        });
        sellOrdersByOwner[msg.sender].push(id);
        track(msg.sender, myId);
        return true;
    }

    function deleteBuyOrder(uint256 id) external returns (bool){
        Order storage old = buyOrders[id];
        require(old.id > 0, "TokenManager: buy offer does not exists");
        require(old.owner == msg.sender, "TokenManager: you are not the owner of the offer");
        uint remain = old.cost.sub(old.costExecuted);
        if(old.currency == address(0)){
            bool res = payable(msg.sender).send(remain);
            require(res==true, "TokenManager: transfer failed");
        }else{
            bool res = IERC20(old.currency).transfer(old.owner, remain);
            require(res==true, "TokenManager: transfer failed");
        }
        removeByValue(buyOrdersByOwner[msg.sender], id);
        delete buyOrders[id];
        untrack(msg.sender, myId);
        return true;
    }

    function deleteSellOrder(uint256 id) external returns (bool){
        Order storage old = sellOrders[id];
        require(old.id > 0, "TokenManager: sell offer does not exists");
        require(old.owner == msg.sender, "TokenManager: you are not the owner of the offer");
        uint remain = old.amount.sub(old.amountExecuted);
        _approve(address(this), msg.sender, remain);
        bool res = transferFrom(address(this), msg.sender, remain);
        require(res == true, "TokenManager: transfer failed");
        removeByValue(sellOrdersByOwner[msg.sender], id);
        delete sellOrders[id];
        untrack(msg.sender, myId);
        return true;
    }

    function acceptBuyOrder(uint256 id) external returns (bool){
        Order storage old = buyOrders[id];
        require(old.id > 0, "TokenManager: buy offer does not exists");
        uint balance = balanceOf(msg.sender);
        uint amount = old.amount.sub(old.amountExecuted);
        require(balance > 0, "TokenManager: you dont have enough parts");
        require(amount > 0, "TokenManager: buy offer already filled");
        if(old.fillOrKill){
            require(balance >= amount, "TokenManager: you dont have enough balance to fill");
        }
        //transfer token to buyer
        bool res = transfer(old.owner, amount);
        require(res == true, "TokenManager: transfer failed");
        //amount => cost  (10 => 20)
        //amount => X   (5 => X)
        //X = cost * amount / amount  => X=10
        //transfer money to seller 
        uint topay = old.cost.mul(amount).div(old.amount);
        if(old.currency == address(0)){
            res = payable(msg.sender).send(topay);
            require(res==true, "TokenManager: transfer failed");
        }else{
            res = IERC20(old.currency).transfer(msg.sender, topay);
            require(res==true, "TokenManager: transfer failed");
        }
        old.amountExecuted = old.amountExecuted.add(amount);
        old.costExecuted = old.costExecuted.add(topay);
        require(old.amount >= old.amountExecuted, "TokenManager: should not get more than wished");
        require(old.cost >= old.costExecuted, "TokenManager: should not consume more than deposit");
        addTrade(old, old.owner, msg.sender, amount, topay);
        track(msg.sender, myId);
        return true;
    }

    function acceptSellOrder(uint256 id, uint256 tokenPay) external payable returns (bool){
        Order storage old = sellOrders[id];
        require(old.id > 0, "TokenManager: sell offer does not exists");
        uint remainAmount = old.amount.sub(old.amountExecuted);
        uint remainPayment = old.cost.sub(old.costExecuted);
        require(remainAmount > 0, "TokenManager: buy offer already filled");
        //transfer money to seller 
        uint256 costToPay = 0;
        if(old.currency == address(0)){
            require(msg.value > 0, "TokenManager: should not send 0");
            if(old.fillOrKill){
                require(msg.value >= remainPayment, "TokenManager: you dont have paid enough to fill");
            }
            costToPay = msg.value;
            bool res1 = payable(old.owner).send(costToPay);
            require(res1==true, "TokenManager: transfer failed");
        }else{
            require(tokenPay > 0, "TokenManager: should not send 0");
            if(old.fillOrKill){
                require(tokenPay >= remainPayment, "TokenManager: you dont have paid enough to fill");
            }
            bool _res = IERC20(old.currency).transferFrom(msg.sender, old.owner, tokenPay);
            require(_res==true, "TokenManager: transfer failed");
            costToPay = tokenPay;
        }
        //cost => amount  (10 => 20)
        //costToPay => X (5 => X)
        //X = amount * costToPay / cost  => X=10
        uint amountToGet = old.amount.mul(costToPay).div(old.cost);
        //transfer token to buyer
        _approve(address(this), msg.sender, amountToGet);
        bool res = transferFrom(address(this),msg.sender, amountToGet);
        require(res== true, "TokenManager: transfer failed");
        old.amountExecuted = old.amountExecuted.add(amountToGet);
        old.costExecuted = old.costExecuted.add(costToPay);
        require(old.amount >= old.amountExecuted, "TokenManager: should not sell more than have");
        require(old.cost >= old.costExecuted, "TokenManager: should not receive more than wish");
        addTrade(old, msg.sender, old.owner, amountToGet, costToPay);
        track(msg.sender, myId);
        return true;
    }

    //INTERNAL

    function addTrade(Order storage order, address buyer, address seller, uint256 amount, uint256 cost) internal {
        tradeCounter.increment();
        uint id = tradeCounter.current();
        trades[id] = Trade({
            id: id,
            orderId:order.id,
            amount: amount,
            cost: cost,
            currency: order.currency,
            at: block.timestamp,
            buyer: buyer,
            seller: seller
        });
        tradesByAddress[buyer].push(id);
        tradesByAddress[seller].push(id);
    }
    
    function removeByValue(uint256[] storage values, uint256 value) internal returns(uint) {
        if(values.length == 0){
            return 0;
        }
        uint i = 0;
        while (values[i] != value && i < values.length) {
            i++;
        }
        values[i] = values[values.length - 1];
        values.pop();
        return i;
    }

    function track(address _addr, uint256 id) internal {
        (bool success,bytes memory data) = tokenGeneratorAddress.call(
            abi.encodeWithSignature("track(address,uint256)",_addr,id)
        );
        require(success, string(data));
    }

    function untrack(address _addr, uint256 id) internal {
        (bool success,bytes memory data) = tokenGeneratorAddress.call(
            abi.encodeWithSignature("untrack(address,uint256)",_addr,id)
        );
        require(success, string(data));
    }

    function drop() internal {
        (bool success,bytes memory data) = tokenGeneratorAddress.call(
            abi.encodeWithSignature("drop()")
        );
        require(success, string(data));
    }
}