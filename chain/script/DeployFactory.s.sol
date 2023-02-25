// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "forge-std/Script.sol";
import "../src/SafeFactory.sol";

contract DeployFactory is Script {
    SafeFactory factory;

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        factory = new SafeFactory();

        console.log("Deployed to address:", address(factory));

        vm.stopBroadcast();
    }
}

// last deployed 0x414A5B98C9dCdBA0317685E663C2278458382787