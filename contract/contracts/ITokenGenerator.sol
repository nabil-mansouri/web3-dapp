// SPDX-License-Identifier: Private Use
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "./TokenManager.sol";

interface ITokenGenerator {
    function seeManagerCount() external view returns (uint256);

    function seeManagerIds() external view returns (uint256[] memory);

    function seeManagerIdsFor(address owner) external view returns (uint256[] memory);

    function seeManagersFor(address owner) external view returns (Manager[] memory) ;

    function mintERC721(address _nftaddr, uint256 _nftid, uint256 _supply) external returns (uint256) ;
    
    function mintERC1155(address _nftaddr, uint256 _nftid, uint256 _supply, uint256 _quantity) external returns (uint256) ;
    
    struct Manager{
        uint256 _id;
        address _address;
        address _owner;
        uint256 _supply;
        address _nftaddr;
        uint256 _nftid;
        uint256 _quantity;
    }
}