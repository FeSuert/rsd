import { useState } from "react";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import Button from "./Button";

const Connect = ({ children }) => {
  const [connected, setConnect] = useState(false);
  const [currentAddress, setCurrentAddress] = useState();

  const handleConnectButton = async () => {
    const { ethereum } = window;
    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });
    setCurrentAddress(accounts);
    setConnect(true);
  };

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
