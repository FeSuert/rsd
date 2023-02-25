import React, { createContext, useEffect, useState } from "react";
import provider from "../scripts/provider";

export const Context = createContext();

export const Provider = (children) => {
  const [currentAddressContext, setCurrentAddressContext] = useState();
  const [currentChainnameContext, setCurrentChainnameContext] = useState();
  const [isConnected, setIsConnected] = useState(false);
  console.log("isConnected", isConnected);

  useEffect(() => {
    (() => {
      if (!isConnected) {
        try {
          const getCurrentAddress = async () => {
            const { ethereum } = window;
            const currentAccount = await ethereum.request({
              method: "eth_requestAccounts",
            });
            setIsConnected(true);
            setCurrentAddressContext(currentAccount);
          };
          getCurrentAddress();

          window.ethereum.on("accountsChanged", (accounts) => {
            getCurrentAddress();
          });
        } catch (error) {
          console.error(error);
        }
      }
    })();
    // ethereum.removeListener('accountsChanged', handleAccountsChanged);
  }, []);

  useEffect(() => {
    if (!isConnected) {
      (async () => {
        try {
          const getCurrentChainName = async () => {
            let chainName = await provider.getNetwork();
            setCurrentChainnameContext(chainName.name);
          };
          getCurrentChainName();

          window.ethereum.on("chainChanged", () => {
            getCurrentChainName();
            window.location.reload();
          });
        } catch (error) {
          console.error(error);
        }
      })();
    }
  }, []);

  console.log("currentChainnameContext", currentChainnameContext);

  return (
    <Context.Provider
      value={{ currentChainnameContext, currentAddressContext, isConnected }}
      {...children}
    ></Context.Provider>
  );
};
