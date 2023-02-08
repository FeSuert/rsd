import { ethers } from "ethers";
import { useEffect, useState } from "react";
import Button from "./Button";

const Connect = () => {
  const [connected, setConnect] = useState(false);

  const handleConnectButton = async () => {
    const { ethereum } = window;
    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });

    setConnect(true);
    console.log("connect", setConnect);
  };

  return (
    <>
      {!connected === false ? (
        <Button onClick={handleConnectButton}> Connect Metamask </Button>
      ) : (
        <div class="address-container">
          <li class="address-item">
            <div class="address-icon-container">
              <div class="address-icon">
                <canvas width="36" height="36"></canvas>
              </div>
            </div>
            <div class="address-details">
              <h6 class="address-title">0xbcD2...29a1</h6>
              <p class="address-status">Connected</p>
            </div>
          </li>
        </div>
      )}
    </>
  );
};
export default Connect;
