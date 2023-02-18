import React, { useState, useEffect, useRef, createRef } from "react";
import { ethers } from "ethers";
import provider from "../scripts/provider";
import safe from "../scripts/Safe.js";
import safeFactory from "../scripts/SafeFactory.js";
import Layout from "../components/layout";

const Wallets = (props) => {
  const [address, setAddress] = useState("");
  const [wallets, setWallets] = useState([]);
  const [currentWallet, setCurrentWallet] = useState("");
  const [currentWalletOwners, setCurrentWalletOwners] = useState([]);
  const [selectedgnosis, setSelectGnosis] = useState();
  const [walletName, setWalletName] = useState();
  const [addedSigners, setAddedSigners] = useState([]);
  const [addedSigner, setAddedSigner] = useState();
  const [walletBalance, setWalletBalance] = useState();
  const [walletThreshold, setWalletThreshold] = useState();
  const [signers, setSigners] = useState([]);
  const [sendRecipient, setSendRecepient] = useState();
  const [sendAmount, setSendAmount] = useState();
  const [sendRecipient2, setSendRecepient2] = useState();
  const [sendAmount2, setSendAmount2] = useState();
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

  function handleGnosisChange(event) {
    const index = event.target.value;
    setSelectGnosis(index);
  }

  const inputRef = createRef();

  const bnbChainId = "0x38";

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

  const handleCreateTx = async (event) => {
    event.preventDefault();

    const currentSafe = safe(currentWallet);
    const executeHash = await currentSafe.EXECUTE_HASH();
    const payload = []

    const messageHash = await currentSafe.getMessageHash(executeHash, sendRecipient2, sendAmount2, payload);

    const signer = await provider.getSigner()
    const safeSinger = currentSafe.connect(signer)

    const flatSig = await signer.signMessage(ethers.utils.arrayify(messageHash))
    const sig = ethers.utils.splitSignature(flatSig);

    const response = await postRecord(sendRecipient2, sendAmount2);
  };

  const handleTxWithSignleSig = async (event) => {
    event.preventDefault();

    const currentSafe = safe(currentWallet);
    const executeHash = await currentSafe.EXECUTE_HASH();
    const payload = []

    const messageHash = await currentSafe.getMessageHash(executeHash, sendRecipient, sendAmount, payload);

    const signer = await provider.getSigner()
    const safeSinger = currentSafe.connect(signer)

    const flatSig = await signer.signMessage(ethers.utils.arrayify(messageHash))
    const sig = ethers.utils.splitSignature(flatSig);

    const tx = await safeSinger.executeTest(
      sendRecipient,
      sendAmount,
      payload,
      [sig],
      { value: sendAmount }
    )
    await tx.wait()
  }

  const postRecord = async (receiver, amount) => {
    const requestOptions = {
      method: "POST",
      body: JSON.stringify({ receiver, amount }),
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await fetch(`http://localhost:3003/`, requestOptions);
    const data = await response.json();
    if (response.status !== 200) {
      throw new Error(data.error);
    }
    console.log("Response from server: : ", data);
  };

  async function handleConnect(wallet) {
    console.log("here")
    setCurrentWallet(wallet)
    const currentSafe = safe(wallet)
    await currentSafe.getOwners()
      .then(async (data) => {
        setCurrentWalletOwners(data)
      })

    await provider.getBalance(currentSafe.address)
      .then(async (data) => {
        setWalletBalance(ethers.utils.formatUnits(data))
      })

    await currentSafe.quorum()
      .then(async (data) => {
        setWalletThreshold(parseInt(data))
      })
  }

  return (
    <Layout>
      <div className="create-new-safe">
        <div className="grid-container">
          <div className="MuiGrid-item grid-item">
            <h2 className="title">Wallets</h2>
          </div>
          <div className="MuiGrid-item grid-item">
            <div className="card">
              <div className="progress-bar">
                <span className="linear-progress-bar">
                  <span className="progress-bar-fill"></span>
                </span>
              </div>
              {/* Delete this (here is metamask connection) */}
              <div className="content">
                <button
                  /* positive={!!address} 
                  primary */
                  onClick={handleConnectWalletClick}
                  style={{ width: "370px" }}>
                  {!address ? "Connect to Wallet" : address}
                </button>
              </div>
              {/* Delete this (here is metamask connection) */}
              <span className="card-title">
                Your Gnosis Wallets:
              </span>
              <div className="wallets">
                {wallets.map((wallet) =>
                  <div className="">
                    <span className="wallets-name">WalletName</span>
                    <p className="wallets-item" key={wallet.toString()}>
                      <div className="wallet-address">{wallet}</div><button className="add-owner" onClick={() => handleConnect(wallet)}>Connect</button>
                    </p>
                  </div>
                )}
              </div>
              <hr className="divider" />
              <span className="card-title">
                Wait list:
              </span>
              <p style={{ marginLeft: 15 }}>There is no any tx...</p>
              <hr className="divider" />
              <span className="card-title">
                Wallet Info:
              </span>
              <div className="wallets">
                <div className="wallets-name">Current wallet: <div className="wallet-address">{currentWallet}</div></div>
                <div className="wallets-name">Wallet balance: <div className="wallet-address">{walletBalance}</div></div>
                <div className="wallets-name">Wallet threshold: <div className="wallet-address">{walletThreshold}</div></div>
                <div className="wallets-name">Owners: {currentWalletOwners.map((owner) => <div key={owner.id} className="wallet-address">{owner}</div>)}</div>
              </div>
              <hr className="divider" />
              <span className="card-title">
                Send tx with a single sig:
              </span>
              <div className="wallets">
                <form onSubmit={handleTxWithSignleSig}>
                  <div className="wallets-name">
                    <label>Recipient</label>
                    <input type="text" value={sendRecipient} onChange={(e) => setSendRecepient(e.target.value)} placeholder='Recipient' />
                  </div>
                  <div className="wallets-name">
                    <label>Amount</label>
                    <input type="text" value={sendAmount} onChange={(e) => setSendAmount(e.target.value)} placeholder='Amount' />
                  </div>
                  <hr className="divider" />
                  <div className="input-row">
                    <div className="button-container">
                      <button className="submit-button" type="submit">
                        Send
                      </button>
                    </div>
                  </div>
                </form>
              </div>
              <hr className="divider" />
              <span className="card-title">
                Create tx and send to server:
              </span>
              <div className="wallets">
                <form onSubmit={handleCreateTx}>
                  <div className="wallets-name">
                    <label>Recipient</label>
                    <input type="text" value={sendRecipient2} onChange={(e) => setSendRecepient2(e.target.value)} placeholder='Recipient' />
                  </div>
                  <div className="wallets-name">
                    <label>Amount</label>
                    <input type="text" value={sendAmount2} onChange={(e) => setSendAmount2(e.target.value)} placeholder='Amount' />
                  </div>
                  <hr className="divider" />
                  <div className="input-row">
                    <div className="button-container">
                      <button className="submit-button" type="submit">
                        Send
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

export default Wallets;
