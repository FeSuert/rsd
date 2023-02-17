import React, { useState, useEffect, useRef, createRef } from "react";
import { ethers } from "ethers";
import provider from "../scripts/provider";
import Safe from "../scripts/Safe.js";
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
    console.log("here")
    setCurrentWallet(wallet)
    const safe = Safe(wallet)
    await safe.getOwners()
      .then(async (data) => {
        setCurrentWalletOwners(data)
      })

    await provider.getBalance(safe.address)
      .then(async (data) => {
        setWalletBalance(ethers.utils.formatUnits(data))
      })

    await safe.quorum()
      .then(async (data) => {
        setWalletThreshold(parseInt(data))
      })
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
                    positive={!!address}
                    primary
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
              Wallet Info:
              </span>
              <div className="wallets">
                <div className="wallets-name">Current wallet: <div className="wallet-address">{currentWallet}</div></div>
                <div className="wallets-name">Wallet balance: <div className="wallet-address">{walletBalance}</div></div>
                <div className="wallets-name">Wallet threshold: <div className="wallet-address">{walletThreshold}</div></div>
                <div className="wallets-name">Owners: {currentWalletOwners.map((owner) => <div key={owner.id} className="wallet-address">{owner}</div>)}</div>
                <div className="wallets-name"><h3>Send tokens</h3></div>
              </div>
              <hr className="divider" />
              <span className="card-title">
               Create Transaction: 
              </span>
              <div className="wallets">
                <form onSubmit={handleSendTokens}>
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
                        Create tx
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
