// SPDX-License-Identifier: Private Use
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./TokenGenerator.sol";
import "./TokenManager.sol";

contract Views is Ownable, Pausable, ReentrancyGuard{
    

    constructor() {}

    function seeManagers(address _contract) external view returns (TokenGenerator.Manager[] memory) {
        TokenGenerator generator = TokenGenerator(_contract);
        uint len = generator.seeManagerCounter();
        uint index = 0;        
        TokenGenerator.Manager[] memory result = new TokenGenerator.Manager[](len);
        for (uint j = 0; j < len; j++) {
            TokenGenerator.Manager memory tmp = generator.getManagerById(j+1);
            result[index++] = tmp;
        }
        return result;
    }

    function seeManagersForIds(address _contract, uint256[] memory ids) public view returns (TokenGenerator.Manager[] memory) {
        uint len = ids.length;
        uint index = 0;        
        TokenGenerator generator = TokenGenerator(_contract);
        TokenGenerator.Manager[] memory result = new TokenGenerator.Manager[](len);
        for (uint j = 0; j < len; j++) {
            TokenGenerator.Manager memory tmp = generator.getManagerById(ids[j]);
            result[index++] = tmp;
        }
        return result;
    }



    function seeManagersFor(address _contract,address owner) external view returns (TokenGenerator.Manager[] memory) {
        TokenGenerator generator = TokenGenerator(_contract);
        uint256[] memory ids = generator.seeManagerIdsFor(owner);
        uint len = ids.length;
        uint index = 0;
        TokenGenerator.Manager[] memory result = new TokenGenerator.Manager[](len);
        for (uint j = 0; j < len; j++) {
            uint256 id = ids[j];
            TokenGenerator.Manager memory tmp = generator.getManagerById(id);
            result[index++] = tmp;
        }
        return result;
    }

    function seeBuyOrders(address _contract) external view returns (TokenManager.Order[] memory) {
        TokenManager generator = TokenManager(_contract);
        uint len = generator.seeBuyOrderCounter();
        uint index = 0;        
        TokenManager.Order[] memory result = new TokenManager.Order[](len);
        for (uint j = 0; j < len; j++) {
            TokenManager.Order memory tmp = generator.getBuyOrderById(j+1);
            result[index++] = tmp;
        }
        return result;
    }

    function seeBuyOrderForIds(address _contract, uint256[] memory ids) public view returns (TokenManager.Order[] memory) {
        uint len = ids.length;
        uint index = 0;        
        TokenManager generator = TokenManager(_contract);
        TokenManager.Order[] memory result = new TokenManager.Order[](len);
        for (uint j = 0; j < len; j++) {
            TokenManager.Order memory tmp = generator.getBuyOrderById(ids[j]);
            result[index++] = tmp;
        }
        return result;
    }

    function seeBuyOrderFor(address _contract,address owner) external view returns (TokenManager.Order[] memory) {
        TokenManager generator = TokenManager(_contract);
        uint256[] memory ids = generator.seeBuyOrderIdsFor(owner);
        uint len = ids.length;
        uint index = 0;
        TokenManager.Order[] memory result = new TokenManager.Order[](len);
        for (uint j = 0; j < len; j++) {
            uint256 id = ids[j];
            TokenManager.Order memory tmp = generator.getBuyOrderById(id);
            result[index++] = tmp;
        }
        return result;
    }
    

    function seeSellOrders(address _contract) external view returns (TokenManager.Order[] memory) {
        TokenManager generator = TokenManager(_contract);
        uint len = generator.seeSellOrderCounter();
        uint index = 0;        
        TokenManager.Order[] memory result = new TokenManager.Order[](len);
        for (uint j = 0; j < len; j++) {
            TokenManager.Order memory tmp = generator.getSellOrderById(j+1);
            result[index++] = tmp;
        }
        return result;
    }

    function seeSellOrderForIds(address _contract, uint256[] memory ids) public view returns (TokenManager.Order[] memory) {
        uint len = ids.length;
        uint index = 0;        
        TokenManager generator = TokenManager(_contract);
        TokenManager.Order[] memory result = new TokenManager.Order[](len);
        for (uint j = 0; j < len; j++) {
            TokenManager.Order memory tmp = generator.getSellOrderById(ids[j]);
            result[index++] = tmp;
        }
        return result;
    }

    function seeSellOrderFor(address _contract,address owner) external view returns (TokenManager.Order[] memory) {
        TokenManager generator = TokenManager(_contract);
        uint256[] memory ids = generator.seeSellOrderIdsFor(owner);
        uint len = ids.length;
        uint index = 0;
        TokenManager.Order[] memory result = new TokenManager.Order[](len);
        for (uint j = 0; j < len; j++) {
            uint256 id = ids[j];
            TokenManager.Order memory tmp = generator.getSellOrderById(id);
            result[index++] = tmp;
        }
        return result;
    }

    function seeTrades(address _contract) external view returns (TokenManager.Trade[] memory) {
        TokenManager generator = TokenManager(_contract);
        uint len = generator.seeTradeCounter();
        uint index = 0;        
        TokenManager.Trade[] memory result = new TokenManager.Trade[](len);
        for (uint j = 0; j < len; j++) {
            TokenManager.Trade memory tmp = generator.getTradeById(j+1);
            result[index++] = tmp;
        }
        return result;
    }

    function seeTradesForIds(address _contract, uint256[] memory ids) public view returns (TokenManager.Trade[] memory) {
        uint len = ids.length;
        uint index = 0;        
        TokenManager generator = TokenManager(_contract);
        TokenManager.Trade[] memory result = new TokenManager.Trade[](len);
        for (uint j = 0; j < len; j++) {
            TokenManager.Trade memory tmp = generator.getTradeById(ids[j]);
            result[index++] = tmp;
        }
        return result;
    }

    function seeTradesFor(address _contract,address owner) external view returns (TokenManager.Trade[] memory) {
        TokenManager generator = TokenManager(_contract);
        uint256[] memory ids = generator.seeTradesIdsFor(owner);
        uint len = ids.length;
        uint index = 0;
        TokenManager.Trade[] memory result = new TokenManager.Trade[](len);
        for (uint j = 0; j < len; j++) {
            uint256 id = ids[j];
            TokenManager.Trade memory tmp = generator.getTradeById(id);
            result[index++] = tmp;
        }
        return result;
    }
}