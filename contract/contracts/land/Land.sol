// SPDX-License-Identifier: Private Use
pragma solidity ^0.8.0;

import "./LandBaseToken.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract Land is LandBaseToken {
    constructor(
        address metaTransactionContract,
        address admin
    ) LandBaseToken(
        metaTransactionContract,
        admin
    ) {
    }

    /**
     * @notice Return the name of the token contract
     * @return The name of the token contract
     */
    function name() external pure returns (string memory) {
        return "Sandbox's LANDs";
    }

    /**
     * @notice Return the symbol of the token contract
     * @return The symbol of the token contract
     */
    function symbol() external pure returns (string memory) {
        return "LAND";
    }

    // solium-disable-next-line security/no-assign-params
    function uint2str(uint _i) internal pure returns (string memory) {
        if (_i == 0) {
            return "0";
        }
        uint j = _i;
        uint len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint k = len - 1;
        while (_i != 0) {
            bstr[k--] = bytes1(uint8(48 + _i % 10));
            _i /= 10;
        }
        return string(bstr);
    }

    /**
     * @notice Return the URI of a specific token
     * @param id The id of the token
     * @return The URI of the token
     */
    function tokenURI(uint256 id) public pure returns (string memory) {
        //require(_ownerOf(id) != address(0), "Id does not exist");
        return
            string(
                abi.encodePacked(
                    "https://api.sandbox.game/lands/",
                    Strings.toString(id),
                    "/metadata.json"
                )
            );
    }

    /**
     * @notice Check if the contract supports an interface
     * 0x01ffc9a7 is ERC-165
     * 0x80ac58cd is ERC-721
     * 0x5b5e139f is ERC-721 metadata
     * @param id The id of the interface
     * @return True if the interface is supported
     */
    function supportsInterface(bytes4 id) external override pure returns (bool) {
        return id == 0x01ffc9a7 || id == 0x80ac58cd || id == 0x5b5e139f;
    }
}