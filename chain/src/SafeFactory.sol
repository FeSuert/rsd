// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "./Safe.sol";

contract SafeFactory {
    mapping(address => SafeSample[]) public safes;
    mapping(address => bool) public isSafe;
    mapping(address => mapping(address => bool)) public hasSafe;

    struct SafeSample {
        string name;
        address addr;
    }

    event SafeCreation(address creator, address safe);

    function createSafe(
        string memory _name,
        address[] memory _signers,
        uint256 _quorum
    ) public returns (address) {
        Safe safe = new Safe(_name, _signers, _quorum);

        address safeAddress = address(safe);
        safes[msg.sender].push(SafeSample(_name, safeAddress));
        hasSafe[msg.sender][safeAddress] = true;

        for (uint256 idx; idx < _signers.length; idx++) {
            if (!hasSafe[_signers[idx]][safeAddress]) {
                safes[_signers[idx]].push(SafeSample(_name, safeAddress));
                hasSafe[_signers[idx]][safeAddress] = true;
            }
        }

        isSafe[safeAddress] = true;
        
        emit SafeCreation(msg.sender, safeAddress);

        return safeAddress;
    }

    function getSafesCount(address creator) public view returns (uint256) {
        return safes[creator].length;
    }

    function getSafes(address addr) public view returns (SafeSample[] memory) {
        return safes[addr];
    }
}