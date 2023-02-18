// import { ethers, InfuraProvider } from "ethers";

// const defaultProvider = new ethers.providers.InfuraProvider();

// export default defaultProvider;

import { ethers } from "ethers";

let provider;

if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
    defaultProvider = new ethers.providers.Web3Provider(window.ethereum);
} else {
    defaultProvider = new ethers.providers.JsonRpcProvider(
    "https://bsc-dataseed.binance.org/"
  );
  // provider = new ethers.providers.JsonRpcProvider("https://bsc-dataseed.binance.org/");
}

export default defaultProvider;