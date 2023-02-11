import { useState } from "react";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import Button from "./Button";

const Connect = () => {
  const [connected, setConnect] = useState(false);
  const [currentAddress, setCurrentAddress] = useState();

  const handleConnectButton = async () => {
    const { ethereum } = window;
    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });
    const chainId = await ethereum.request({
      method: "eth_chainId",
    });
    setCurrentAddress(accounts);
    setConnect(true);
    console.log("chainId", chainId);
  };

  console.log("currentAddress", currentAddress);

  // const provider = new ethers.BrowserProvider(window.ethereum);

  return (
    <>
      {!connected ? (
        <Button onClick={handleConnectButton}> Connect Metamask </Button>
      ) : (
        <div className="address-container">
          <li className="address-item">
            <div className="address-icon-container">
              <div className="address-icon">
                <canvas width="36" height="36"></canvas>
              </div>
            </div>
            <div className="address-details">
              <div>
                <Jazzicon
                  diameter={25}
                  seed={jsNumberForAddress(currentAddress)}
                />
                <div>
                  <h6 className="address-title">{currentAddress}</h6>
                  <p className="address-status">Connected</p>
                </div>
              </div>
            </div>
          </li>
        </div>
      )}
    </>
  );
};
export default Connect;
