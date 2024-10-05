// SPDX-License-Identifier: Private Use
pragma solidity ^0.8.0;
import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC777/ERC777.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract TokenManagerAbstract is Ownable, Pausable, ReentrancyGuard, ERC1155Holder, ERC721Holder, ERC777{
    uint256 public nftId;
    address public nftAddress;
    address public nftOwner;
    uint256 public countERC1155;
    uint256 public countERC721;
    address public tokenGeneratorAddress;
    uint256 public myId;
    Counters.Counter public sellCounter;
    Counters.Counter public buyCounter;
    Counters.Counter public tradeCounter;
    mapping(uint256 => Order) public sellOrders;
    mapping(address => uint256[]) public sellOrdersByOwner;
    mapping(uint256 => Order) public buyOrders;
    mapping(address => uint256[]) public buyOrdersByOwner;
    mapping(uint256 => Trade) public trades;
    mapping(address => uint256[]) public tradesByAddress;

    constructor(address[] memory defaultOperators_) ERC777("TOKNFT", "TOKNFT", defaultOperators_) {}
 
    struct Order {
        uint256 id;
        uint256 amount;
        uint256 amountExecuted;
        uint256 cost;
        uint256 costExecuted;
        address currency;
        bool fillOrKill;
        uint256 at;
        address owner;
        bool buy;
    }
 
    struct Trade {
        uint256 id;
        uint256 orderId;
        uint256 amount;
        uint256 cost;
        address currency;
        uint256 at;
        address buyer;
        address seller;
    }
}