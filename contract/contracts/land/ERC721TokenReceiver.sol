// SPDX-License-Identifier: Private Use
pragma solidity ^0.8.0;

interface ERC721TokenReceiver {
    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external returns (bytes4);
}