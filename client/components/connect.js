import { useContext } from "react";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import Button from "./Button";
import { Context } from "../context/Context";

const Connect = ({ children }) => {
  const { currentAddressContext } = useContext(Context);

  const handleConnectButton = async () => {
    const { ethereum } = window;
    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });

    sessionStorage.setItem("currentAccount", accounts[0]);
  };
  console.log("currentAddressContext", currentAddressContext);
  return (
    <>
      {!currentAddressContext ? (
        <div className="flex justify-center">
          <Button onClick={handleConnectButton}>Connect Metamask</Button>
        </div>
      ) : (
        <div className="my-1">
          <li className="address-item">
            <Jazzicon
              diameter={25}
              seed={jsNumberForAddress(currentAddressContext.toString())}
            />

            <div className="address-icon"></div>
            <div className="address-details">
              <div>
                <div>
                  <h6 className="address-title">
                    {currentAddressContext.toString().slice(0, 5) +
                      "..." +
                      currentAddressContext.toString().slice(38)}
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
