import { useContext, useState } from "react";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import Button from "./Button";
import { Context } from "../context/Context";

const Connect = ({ children }) => {
  const { isConnected, currentAddressContext } = useContext(Context);

  const [currentAddress, setCurrentAddress] = useState();

  const handleConnectButton = async () => {
    const { ethereum } = window;
    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });
    setCurrentAddress(accounts[0]);

    sessionStorage.setItem("currentAccount", accounts[0]);
  };

  return (
    <>
      {!isConnected ? (
        <div className="flex justify-center">
          <Button onClick={handleConnectButton}>Connect Metamask</Button>
        </div>
      ) : (
        <div className="my-1">
          <li className="address-item">
            <Jazzicon
              diameter={25}
              seed={jsNumberForAddress(currentAddressContext)}
            />
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
