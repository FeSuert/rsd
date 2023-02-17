import { useState, useEffect } from "react";
import defaultProvider from "../scripts/defaultProvider";
import provider from "../scripts/provider";

const ChainName = () => {
  const [currentChainName, setcurrentChainname] = useState();

  // const handleGetChain = () => {
  useEffect(() => {
    (async () => {
      // const { ethereum } = window;
      // let chainId = await ethereum.request({ method: "eth_chainId" });

      let chainName = await provider.getNetwork();

      console.log("chainName_00_", chainName.name);
      setcurrentChainname(chainName.name);
    })();
  }, []);

  return <button className="network-button">Сеть: {currentChainName} </button>;
};

export default ChainName;
