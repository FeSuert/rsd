import React, { createContext, useEffect, useState } from "react";
import provider from "../scripts/provider";

export const Context = createContext();

export const Provider = (children) => {
  const [currentAddressContext, setCurrentAddressContext] = useState();
  const [currentChainnameContext, setCurrentChainnameContext] = useState();

  useEffect(() => {
    (async () => {
      //   try {
      let chainName = await provider.getNetwork();
      console.log("chainName_001100_", chainName.name);
      setCurrentChainnameContext(chainName.name);

      const { ethereum } = window;
      const currentAccount = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setCurrentAddressContext(currentAccount);
      // setCurrentAddressContext(accounts);
      // console.log("xxxx", currentAddressContext);
      //   const chainId = await ethereum.request({
      //     method: "eth_chainId",
      //   });
      //   if (chainId != process.env.targetChainId) {
      //     await ethereum.request({
      //       method: "wallet_switchEthereumChain",
      //       params: [{ chainId: process.env.targetChainId }],
      //     });
      //   }
      //   updateFunc({ currentAccount: accounts[0] });
      //   sessionStorage.setItem("currentAccount", accounts[0]);
      //   } catch (error) {
      //     console.error(error);
      //   }
    })();
  }, []);

  return (
    <Context.Provider
      value={{ currentChainnameContext, currentAddressContext }}
      {...children}
    ></Context.Provider>
  );
};
