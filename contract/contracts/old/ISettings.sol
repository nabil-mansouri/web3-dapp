// SPDX-License-Identifier: Private Use
pragma solidity ^0.8.0;

interface ISettings {
    function feeReceiver() external view returns(address);
}