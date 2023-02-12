import { useState } from "react";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import Button from "./Button";
import { ethers } from "ethers";

const Connect = () => {
  const [connected, setConnect] = useState(false);
  const [currentAddress, setCurrentAddress] = useState();

  let provider;

  if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
    provider = new ethers.providers.Web3Provider(window.ethereum);
  } else {
    provider = new ethers.providers.JsonRpcProvider(
      "https://bsc-dataseed.binance.org/"
    );
  }

  const handleConnectButton = async () => {
    const { ethereum } = window;
    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });
    // const chainId = await ethereum.request({
    //   method: "eth_chainId",
    // });

    const chainId = async () => {
      await provider.getNetwork().name;
    };

    setCurrentAddress(accounts);
    setConnect(true);
    console.log("chainId", chainId());
  };

  console.log("currentAddress", currentAddress);

  // const provider = new ethers.BrowserProvider(window.ethereum);

  return (
    <>
      {!connected ? (
        <div className="flex justify-center">
          <Button onClick={handleConnectButton}>Connect Metamask</Button>
        </div>
      ) : (
        <div className="my-1">
          <li className="address-item">
            <Jazzicon diameter={25} seed={jsNumberForAddress(currentAddress)} />
            {/* <div className="address-icon-container"> */}
            <div className="address-icon">
              {/* <canvas width="36" height="36"></canvas> */}
            </div>
            {/* </div> */}
            <div className="address-details">
              <div>
                <div>
                  <h6 className="address-title">
                    {currentAddress.toString().slice(0, 5) +
                      "..." +
                      currentAddress.toString().slice(38)}
                  </h6>
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
