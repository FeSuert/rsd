// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "./Safe.sol";

contract SafeFactory {
    mapping(address => address[]) public safes;
    mapping(address => bool) public isSafe;

    event SafeCreation(address creator, address safe);

    function createSafe(
        string memory _name,
        address[] memory _signers,
        uint256 _quorum
    ) public returns (address) {
        Safe safe = new Safe(_name, _signers, _quorum);

        address safeAddress = address(safe);
        safes[msg.sender].push(safeAddress);
        isSafe[safeAddress] = true;

        emit SafeCreation(msg.sender, safeAddress);

        return safeAddress;
    }

    function getSafesCount(address creator) public view returns (uint256) {
        return safes[creator].length;
    }
}