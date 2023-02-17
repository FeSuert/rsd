import React, { useState, useEffect, useRef, createRef } from "react";
import { ethers } from "ethers";
import provider from "../scripts/provider";
import Safe from "../scripts/Safe.js";
import safeFactory from "../scripts/SafeFactory.js";
import Layout from "../components/layout";

const Safes = (props) => {
  const [address, setAddress] = useState("");
  const [wallets, setWallets] = useState([]);
  const [currentWallet, setCurrentWallet] = useState("");
  const [currentWalletOwners, setCurrentWalletOwners] = useState([]);
  const [threshold, setThreshold] = useState();
  const [walletName, setWalletName] = useState();
  const [addedSigners, setAddedSigners] = useState([]);
  const [addedSigner, setAddedSigner] = useState();
  const [walletBalance, setWalletBalance] = useState();
  const [walletThreshold, setWalletThreshold] = useState();
  const [signers, setSigners] = useState([]);
  const [sendRecipient, setSendRecepient] = useState();
  const [sendAmount, setSendAmount] = useState();
  const [sigs, setSigs] = useState([]);
  const [nonce, setNonce] = useState();
  const [testMsg, setTestMsg] = useState();
  const [addrFromSig, setAddrFromSig] = useState();
  const [inputs, setInputs] = useState([]);

  const handleAddInput = () => {
    setInputs([...inputs, ""]);
  };

  const handleInputChange = (index, value) => {
    const newInputs = [...inputs];
    newInputs[index] = value;
    setInputs(newInputs);
  };

  const handleRemoveInput = (index) => {
    setInputs(inputs.filter((_, i) => i !== index));
  };

  function handleThresholdChange(event) {
    const index = event.target.value;
    setThreshold(index);
  }

  const options = inputs.map((_, i) => (
    <option key={i} value={i}>
      {i + 1}
    </option>
  ));

  const inputRef = createRef();

  const bnbChainId = "0x38";
  const maxShots = 15;
  const EXECUTE_HASH = ethers.utils.id(
    "Execute(address target,uint256 value,bytes payload,uint256 nonce)"
  );

  useEffect(() => {
    if (provider.connection.url === "metamask") {
      // provider.send("eth_requestAccounts", []) // задаем текущий адрес
      // .then((accounts) => {
      //   setAddress(accounts[0])
      // })
      // .catch((error) => console.log(error))

      const { provider: ethereum } = provider;
      ethereum.on("accountsChanged", (accounts) => {
        setAddress("");
      });
    }
  }, []);

  const handleConnectWalletClick = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Metamask not detected");
        return;
      }
      let chainId = await ethereum.request({ method: "eth_chainId" });

      await ethereum
        .request({
          method: "eth_requestAccounts",
        })
        .then(async (data) => {
          setAddress(data[0]);
          try {
            await safeFactory.getSafes(data[0]).then(async (d) => {
              setWallets(d);
            });
          } catch (error) {
            console.log(error);
          }
        });
    } catch (error) {
      console.log("Error connecting to metamask", error);
    }
  };

  const handleCreateSafe = async (event) => {
    event.preventDefault();
    const signer = await provider.getSigner();
    const signerConnected = safeFactory.connect(signer);

    console.log(signers);

    const response = await signerConnected.createSafe(
      walletName,
      addedSigners,
      threshold
    );
    await response.wait().then(async (data) => {
      console.log(data);
      await safeFactory.getSafes(address).then(async (d) => {
        setWallets([...wallets, d]);
      });
    });
    setAddedSigners([]);
  };

  const handleSendTokens = async () => {
    const safe = Safe(currentWallet);
    const messageHash = "";
    await safe.nonce().then((n) => {
      setNonce(parseInt(n));
      console.log(parseInt(n));
      messageHash = ethers.utils.id(
        EXECUTE_HASH + sendRecipient + sendAmount + parseInt(n).toString()
      );
    });

    const domainSeparator = await safe.domainSeparator();

    const signer = await provider.getSigner();
    const flatSig = await signer.signMessage(
      ethers.utils.arrayify(messageHash)
    );
    const sig = ethers.utils.splitSignature(flatSig);
    setSigs([...sigs, sig.toString()]);
    console.log(sendAmount);
    console.log(parseInt(sendAmount));
    // const recovered = await Safe(currentWallet).verify({"v": sig.v, "r": sig.r, "s": sig.s});
    const safeSinger = safe.connect(signer);

    const tx = await safeSinger.r(sendRecipient, sendAmount, [], sigs, {
      value: "100",
    });
    await tx.wait();

    // const tx = await safeSinger.executeTest(
    //   sendRecipient,
    //   sendAmount,
    //   [],
    //   sigs,
    //   { value: sendAmount }
    // )
    // await tx.wait()
    //   .then(() => console.log("success"))
    //   .error(() => console.log("error"))
  };

  const handleAddClick = () => {
    setAddedSigners([...addedSigners, addedSigner]);
  };

  async function handleConnect(wallet) {
    setCurrentWallet(wallet);
    const safe = Safe(wallet);
    await safe.getOwners().then(async (data) => {
      setCurrentWalletOwners(data);
    });

    await provider.getBalance(safe.address).then(async (data) => {
      setWalletBalance(ethers.utils.formatUnits(data));
    });

    await safe.quorum().then(async (data) => {
      setWalletThreshold(parseInt(data));
    });
  }

  const handleTests = async () => {
    const msgHash = ethers.utils.id(testMsg);
    const signer = await provider.getSigner();
    const flatSig = await signer.signMessage(ethers.utils.arrayify(msgHash));
    const sig = ethers.utils.splitSignature(flatSig);

    await Safe(currentWallet)
      .test(testMsg, sig)
      .then(async (d) => {
        console.log("res:", d);
        setAddrFromSig(d);
      });
  };

  return (
    <Layout>
      <div class="create-new-safe">
        <div class="grid-container">
          <div class="MuiGrid-item grid-item">
            <h2 class="title">Create new Safe</h2>
          </div>
          <div class="MuiGrid-item grid-item">
            <div class="card">
              <div class="progress-bar">
                <span class="linear-progress-bar">
                  <span class="progress-bar-fill"></span>
                </span>
              </div>
              {/* Delete this (here is metamask connection) */}
              <div className="content">
                  <button
                    positive={!!address}
                    primary
                    onClick={handleConnectWalletClick}
                    style={{ width: "370px" }}>
                    {!address ? "Connect to Wallet" : address}
                  </button>
                </div>
                <div>
                  {wallets.map((wallet) => <p key={wallet.toString()}>
                  <span style={{ fontSize: 12 }}>{wallet}</span><button onClick={() => handleConnect(wallet)}>Connect</button>
                  </p>)}
              </div>
              {/* Delete this (here is metamask connection) */}
              <span class="card-title">
                Select network and create your Safe
              </span>
              <div class="card-content">
                <form onSubmit={handleCreateSafe}>
                  <div class="input-field">
                    <label for="input-field">Safe Name:</label>
                    <input 
                      required 
                      id="input-field" 
                      type="text" 
                      placeholder="example-safe-name"
                      value={walletName}
                      onChange={(e) => setWalletName(e.target.value)}/>
                  </div>
                  {inputs.map((value, index) => (
                    <div class="input-field" key={index}>
                      <label for="input-field">Owner address:</label>
                      <input 
                        required id="input-field" 
                        type="text" 
                        placeholder="0x..."
                        value={value}
                        onChange={(e) => handleInputChange(index, e.target.value)}
                      />
                      <button class="add-owner" onClick={() => handleRemoveInput(index)}>Remove</button>
                    </div>
                  ))}
                  <div class="add-owners-card">
                  <button onClick={handleAddInput} class="add-owner" type="button">
                    + Add new owner
                  </button>
                  {/* Select threshold */}
                  <select  class="custom-select" required value={threshold} onChange={handleThresholdChange}>
                    <option value="" selected disabled>Select Threshold</option>
                    {options}
                  </select>
                  </div>
                  <hr class="divider" />
                  <div class="input-row">
                    <div class="button-container">
                      <button class="submit-button" type="submit">
                        Confirm
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Safes;
