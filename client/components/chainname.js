import { useState, useEffect } from "react";
import provider from "../scripts/provider";

const ChainName = () => {
  const [currentChainName, setcurrentChainname] = useState();

  useEffect(() => {
    (async () => {
      let chainName = await provider.getNetwork();
      console.log("chainName_00_", chainName.name);
      setcurrentChainname(chainName.name);
    })();
  }, []);

  return <button className="network-button">Сеть: {currentChainName} </button>;
};

export default ChainName;
