// SPDX-License-Identifier: Private Use
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC777/ERC777.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "./TokenManagerAbstract.sol";

contract TokenManager is TokenManagerAbstract {
    using Counters for Counters.Counter;
    using SafeMath for uint256;
    address private libAddress;
    constructor(address _nftaddr, uint256 _nftid, uint256 _supply, address _nftowner, address _superowner, address _libraryAddr, address _tokenGeneratorAddress, uint256 _myId) TokenManagerAbstract(new address[](0)) {
        _mint(_nftowner, _supply  * 10 ** 18, "", "");
        nftAddress = _nftaddr;
        nftOwner = _nftowner;
        nftId = _nftid;
        libAddress = _libraryAddr;
        tokenGeneratorAddress = _tokenGeneratorAddress;
        myId = _myId;
        _transferOwnership(_superowner);
    }

    function getBuyOrderById(uint id) external view returns (Order memory) {
        return buyOrders[id];
    }

    function getSellOrderById(uint id) external view returns (Order memory) {
        return sellOrders[id];
    }

    function getTradeById(uint id) external view returns (Trade memory) {
        return trades[id];
    }

    function seeTradeCounter() external view returns (uint256) {
        return tradeCounter.current();
    }

    function seeBuyOrderCounter() external view returns (uint256) {
        return buyCounter.current();
    }

    function seeSellOrderCounter() external view returns (uint256) {
        return sellCounter.current();
    }

    function seeBuyOrderIdsFor(address owner) public view returns (uint256[] memory) {
        return buyOrdersByOwner[owner];
    }

    function seeSellOrderIdsFor(address owner) public view returns (uint256[] memory) {
        return sellOrdersByOwner[owner];
    }

    function seeTradesIdsFor(address owner) public view returns (uint256[] memory) {
        return tradesByAddress[owner];
    }

    function onERC1155Received(
        address,
        address,
        uint256,
        uint256 quantity,
        bytes memory
    ) public override returns (bytes4) {
        countERC1155 = quantity.add(countERC1155);
        return this.onERC1155Received.selector;
    }

    function onERC721Received(
        address,
        address,
        uint256,
        bytes memory
    ) public override returns (bytes4) {
        countERC721 = countERC721.add(1);
        return this.onERC721Received.selector;
    }

    function withdraw() external nonReentrant whenNotPaused {
        (bool success,bytes memory data) = libAddress.delegatecall(
            abi.encodeWithSignature("withdraw()")
        );
        require(success, string(data));
    }

    function makeBuyOrderCoin(uint256 amount, bool fillOrKill) external payable nonReentrant whenNotPaused {
        (bool success,bytes memory data) = libAddress.delegatecall(
            abi.encodeWithSignature("makeBuyOrderCoin(uint256,bool)",amount,fillOrKill)
        );
        require(success, string(data));
    }

    function makeBuyOrderToken(uint256 amount, uint256 cost, address currency, bool fillOrKill) external nonReentrant whenNotPaused{
        (bool success,bytes memory data) = libAddress.delegatecall(
            abi.encodeWithSignature("makeBuyOrderToken(uint256,uint256,address,bool)",amount,cost,currency,fillOrKill)
        );
        require(success, string(data));
    }


    function makeSellOrder(uint256 amount, uint256 cost, address currency, bool fillOrKill) external nonReentrant whenNotPaused{
        (bool success,bytes memory data) = libAddress.delegatecall(
            abi.encodeWithSignature("makeSellOrder(uint256,uint256,address,bool)",amount,cost,currency,fillOrKill)
        );
        require(success, string(data));
    }

    function deleteBuyOrder(uint256 id) external nonReentrant whenNotPaused{
        (bool success,bytes memory data) = libAddress.delegatecall(
            abi.encodeWithSignature("deleteBuyOrder(uint256)",id)
        );
        require(success, string(data));
    }

    function deleteSellOrder(uint256 id) external nonReentrant whenNotPaused{
        (bool success,bytes memory data) = libAddress.delegatecall(
            abi.encodeWithSignature("deleteSellOrder(uint256)",id)
        );
        require(success, string(data));
    }

    function acceptBuyOrder(uint256 id) external nonReentrant whenNotPaused{
        (bool success,bytes memory data) = libAddress.delegatecall(
            abi.encodeWithSignature("acceptBuyOrder(uint256)",id)
        );
        require(success, string(data));
    }

    function acceptSellOrder(uint256 id, uint256 tokenPay) external payable nonReentrant whenNotPaused{
        (bool success,bytes memory data) = libAddress.delegatecall(
            abi.encodeWithSignature("acceptSellOrder(uint256,uint256)",id,tokenPay)
        );
        require(success, string(data));
    }
}