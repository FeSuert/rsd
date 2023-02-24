import { useState, useEffect } from "react";
import provider from "../scripts/provider";

const ChainName = () => {
  const [currentChainName, setcurrentChainname] = useState();

  useEffect(() => {
    (async () => {
      let chainName = await provider.getNetwork();
      setcurrentChainname(chainName.name);
    })();
  }, []);

  return (
    <button className="network-button">Network: {currentChainName} </button>
  );
};

export default ChainName;
