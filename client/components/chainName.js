import { useEffect, useState } from "react";
import { ethers } from "ethers";
import Button from "./Button";

const ChainName = () => {
  const [currentChain, setCurrentChain] = useState();
  let provider;

  if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
    provider = new ethers.providers.Web3Provider(window.ethereum);
  } else {
    provider = new ethers.providers.JsonRpcProvider(
      "https://bsc-dataseed.binance.org/"
    );
  }

  useEffect(() => {
    const chainName = async () => {
      await provider.getNetwork().name;

      // const chainId = await ethereum.request({
      //   method: "eth_chainId",

      setCurrentChain(chainName);
    };
    [currentChain];
  });
  console.log("chain_id", currentChain);
  // console.log("provider", provider);

  // console.log("chain_id", chainName);

  return (
    <>
      <Button>Сеть: {currentChain}</Button>
    </>
  );
};

export default ChainName;
