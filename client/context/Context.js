import React, { createContext, useEffect, useState } from "react";
import provider from "../scripts/provider";

export const Context = createContext();

export const Provider = (children) => {
  const [currentAddressContext, setCurrentAddressContext] = useState();
  const [currentChainnameContext, setCurrentChainnameContext] = useState();
  const [currentChainID, setCurrentChainID] = useState();

  useEffect(() => {
    (() => {
      //   try {
      const getCurrentAddress = async () => {
        const { ethereum } = window;
        const currentAccount = await ethereum.request({
          method: "eth_requestAccounts",
        });

        setCurrentAddressContext(currentAccount);
      };
      getCurrentAddress();
      window.ethereum.on("accountsChanged", (accounts) => {
        getCurrentAddress();
        // ethereum.removeListener('accountsChanged', handleAccountsChanged);
      });
    })();
  }, []);

  useEffect(() => {
    (async () => {
      //   try {
      const getCurrentChainName = async () => {
        let chainName = await provider.getNetwork();
        setCurrentChainnameContext(chainName.name);
      };
      getCurrentChainName();

      const getCurrentChainID = (async () => {
        await ethereum.request({
          method: "eth_chainId",
        });
        setCurrentChainID(getCurrentChainID);
      })();

      window.ethereum.on("chainChanged", () => {
        getCurrentChainName();
        window.location.reload();
      });
    })();
  }, []);

  console.log("currentChainnameContext", currentChainnameContext);

  return (
    <Context.Provider
      value={{ currentChainnameContext, currentAddressContext }}
      {...children}
    ></Context.Provider>
  );
};
