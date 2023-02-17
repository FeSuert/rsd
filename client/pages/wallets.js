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
      <div class="create-new-safe">
        <div class="grid-container">
          <div class="MuiGrid-item grid-item">
            <h2 class="title">My Wallets</h2>
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
              {/* Delete this (here is metamask connection) */}

              <div>
                {wallets.map((wallet) => <p key={wallet.toString()}>
                <span style={{ fontSize: 12 }}>{wallet}</span><button onClick={() => handleConnect(wallet)}>Connect</button>
                </p>)}
              </div>
              <div className="content">
                <div style={{ marginTop: 15, marginBottom: 15 }}><h3>Info</h3></div>
                <div>Current wallet: {currentWallet}</div>
                <div>Wallet balance: {walletBalance}</div>
                <div>Wallet threshold: {walletThreshold}</div>
                <div>Owners: {currentWalletOwners.map((owner) => <div key={owner.id}>{owner}</div>)}</div>
                <div style={{ marginTop: 15, marginBottom: 15 }}><h3>Send tokens</h3></div>
                <form onSubmit={handleSendTokens}>
                  <div>
                    <label>Recipient</label>
                    <input type="text" value={sendRecipient} onChange={(e) => setSendRecepient(e.target.value)} placeholder='Recipient' />
                  </div>
                  <div>
                    <label>Amount</label>
                    <input type="text" value={sendAmount} onChange={(e) => setSendAmount(e.target.value)} placeholder='Amount' />
                  </div>
                  <button type='submit'>Create tx</button>
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
