// SPDX-License-Identifier: Private Use
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./TokenManager.sol";
import "hardhat/console.sol";

contract TokenGenerator is Ownable, Pausable, ReentrancyGuard{
    using Counters for Counters.Counter;
    
    mapping(uint256 => Manager) public managersById;
    mapping(address => uint256[]) public managersByOwner;
    mapping(address => uint256[]) public managersByUser;
    mapping(address => uint256) public managersByAddr;
    Counters.Counter public managerCounter;
    address public libAddress;
    event Mint(address indexed owner, Manager manager);

    constructor(address _libAddress) {
        libAddress = _libAddress;
    }

    function setConfig(address _libAddress) external onlyOwner {
        libAddress = _libAddress;
    }

    function getManagerById(uint id) external view returns (Manager memory) {
        return managersById[id];
    }

    function seeManagerCounter() external view returns (uint256) {
        return managerCounter.current();
    }

    function seeManagerIdsFor(address owner) external view returns (uint256[] memory) {
        return managersByOwner[owner];
    }

    function mint(address _nftaddr, uint256 _nftid, uint256 _supply, uint256 _quantity, bool _erc721, Meta calldata meta) external returns (uint256) {
        managerCounter.increment();
        uint id = managerCounter.current();
        address manager = address(new TokenManager(_nftaddr, _nftid, _supply, msg.sender, owner(),libAddress, address(this),id));
        if(_erc721){
            IERC721(_nftaddr).safeTransferFrom(msg.sender, manager, _nftid);
        }else{
            IERC1155(_nftaddr).safeTransferFrom(msg.sender, manager, _nftid, _quantity, "");
        }
        managersById[id] = Manager({
            _id: id,
            _address: manager,
            _owner: msg.sender,
            _supply: _supply,
            _nftaddr: _nftaddr,
            _nftid: _nftid,
            _quantity: 1,
            _erc721: _erc721,
            _meta:meta
        });
        managersByAddr[manager] = id;
        managersByOwner[msg.sender].push(id);
        managersByUser[msg.sender].push(id);
        return id;
    }

    function drop() external returns (bool){
        require(managersByAddr[msg.sender] > 0, "Drop: Token not found");
        uint256 id = managersByAddr[msg.sender];
        Manager storage manager = managersById[id];
        removeByValue(managersByOwner[manager._owner], id);
        removeByValue(managersByUser[manager._owner], id);
        delete managersByAddr[msg.sender];  
        delete managersById[id];  
        return true;
    }

    function track(address _addr, uint256 id) external returns (bool){
        require(managersByAddr[msg.sender] > 0, "Track: Token not found");
        removeByValue(managersByUser[_addr], id);
        managersByUser[_addr].push(id);
        return true;
    }

    function untrack(address _addr, uint256 id) external returns (bool){
        require(managersByAddr[msg.sender] > 0, "UnTrack: Token not found");
        removeByValue(managersByUser[_addr], id);
        return true;
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

    struct Manager{
        uint256 _id;
        address _address;
        address _owner;
        uint256 _supply;
        address _nftaddr;
        uint256 _nftid;
        uint256 _quantity;
        bool _erc721;
        Meta _meta;
    }
    struct Meta{
        bytes name;
        bytes description;
        bytes image;
        bytes json;
    }
}