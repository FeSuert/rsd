import { useEffect, useState } from "react";

import Button from "./Button";
const [currentChain, setCurrentChain] = useState(undefined);
const ChainName = async () => {
  useEffect(() => {
    async () => {
      const { ethereum } = window;
      const chainId = await ethereum.request({
        method: "eth_chainId",
      });
      setCurrentChain({ chainId });
    },
      [currentChain];
  });

  return (
    <>
      <Button> {currentChain}</Button>
    </>
  );
};

export default ChainName;
