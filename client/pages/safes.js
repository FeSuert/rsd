import React, { useState, useEffect, useRef, createRef, useContext } from "react";
import { ethers } from "ethers";
import provider from "../scripts/provider";
import Safe from "../scripts/Safe.js";
import safeFactory from "../scripts/SafeFactory.js";
import Layout from "../components/layout";
import { useAppContext } from "../hooks/useAppContext";
import { Context } from "../context/Context";

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
  const [creatingSafe, setCreatingSafe] = useState(false);

  const { currentChainnameContext, currentAddressContext } = useContext(Context);

  useEffect(() => {
    if(currentAddressContext){setAddress(currentAddressContext[0])}
  }, [currentAddressContext])

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
    <option key={i} value={i + 1}>
      {i + 1}
    </option>
  ));

  const inputRef = createRef();

  const bnbChainId = "0x38";
  const maxShots = 15;
  const EXECUTE_HASH = ethers.utils.id(
    "Execute(address target,uint256 value,bytes payload,uint256 nonce)"
  );

  const handleCreateSafe = async (event) => {
    event.preventDefault()
    const signer = await provider.getSigner()
    const signerConnected = safeFactory.connect(signer)

    setCreatingSafe(true); 

    try {
      const response = await signerConnected.createSafe(walletName, inputs, threshold);
      await response.wait();
  
      const walletAddresses = await signerConnected.getSafes(address);
      setWallets([...wallets, walletAddresses[walletAddresses.length - 1]]);
      setInputs([]);
      setCreatingSafe(false);
    } catch (error) {
      console.log('Error creating safe:', error);
      setCreatingSafe(false);
    }
  };

  const handleSendTokens = async () => {
    const safe = Safe(currentWallet);
    const messageHash = "";
    await safe.nonce().then((n) => {
      setNonce(parseInt(n));
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

  async function handleConnect(wallet) {
    setCurrentWallet(wallet);
    const safe = Safe(wallet);
    await safe.getOwners().then(async (data) => {
      setCurrentWalletOwners(data);
    });

    await provider.getBalance(safe.address).then(async (data) => {
      setWalletBalance(ethers.utils.formatUnits(data));
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
        setAddrFromSig(d);
      });
  };

  return (
    <Layout>
      <div className="create-new-safe">
        <div className="grid-container">
          <div className="MuiGrid-item grid-item">
            <h2 className="title">Create new Safe</h2>
          </div>
          <div className="MuiGrid-item grid-item">
            <div className="card">
              <div className="progress-bar">
                <span className="linear-progress-bar">
                  <span className="progress-bar-fill"></span>
                </span>
              </div>
              <div className="wallet-view">
                <span className="card-title">
                  Select network and create your Safe
                </span>
                <div className="card-content">
                  <form onSubmit={handleCreateSafe}>
                    <div className="input-field">
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
                      <div className="input-field" key={index}>
                        <label for="input-field">Owner address:</label>
                        <input 
                          required id="input-field" 
                          type="text" 
                          placeholder="0x..."
                          value={value}
                          onChange={(e) => handleInputChange(index, e.target.value)}
                        />
                        <button className="add-owner" onClick={() => handleRemoveInput(index)}>Remove</button>
                      </div>
                    ))}
                    <div className="add-owners-card">
                    <button onClick={handleAddInput} className="add-owner" type="button">
                      + Add new owner
                    </button>
                    {/* Select threshold */}
                    <select  className="custom-select" required value={threshold} onChange={handleThresholdChange}>
                      <option value="" selected disabled>Select Threshold</option>
                      {options}
                    </select>
                    </div>
                    <hr className="divider" />
                    <div className="input-row">
                      <div className="button-container">
                        <button className="submit-button" type="submit">
                        {creatingSafe ? (
                            <span class="loader"></span>
                          ) : (
                            <p>Create</p>
                          )}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Safes;
