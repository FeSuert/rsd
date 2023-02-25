import React, { useState, useEffect, useRef, createRef, useContext } from "react";
import { ethers } from "ethers";
import provider from "../scripts/provider";
import safe from "../scripts/Safe.js";
import safeFactory from "../scripts/SafeFactory.js";
import Layout from "../components/layout";
import { useAppContext } from "../hooks/useAppContext";
import { Context } from "../context/Context";

const Wallets = (props) => {
  const [address, setAddress] = useState();
  const [wallets, setWallets] = useState([]);
  const [currentWallet, setCurrentWallet] = useState("");
  const [currentWalletOwners, setCurrentWalletOwners] = useState([]);
  const [walletBalance, setWalletBalance] = useState();
  const [walletThreshold, setWalletThreshold] = useState();
  const [sendRecipient2, setSendRecepient2] = useState();
  const [sendAmount2, setSendAmount2] = useState();
  const [walletName, setWalletName] = useState();
  const [inputs, setInputs] = useState([]);
  const [waitList, setWaitList] = useState([]);
  const [currentThreshold, setCurrentTrhreshold] = useState()
  

  const { currentChainnameContext, currentAddressContext } = useContext(Context);

  useEffect(() => {
    if(currentAddressContext){setAddress(currentAddressContext[0])}
  }, [currentAddressContext])

  useEffect(() => {
    if (address) {
        handleConnectWallet()
        setWaitList([])
        setWallets([])
        setCurrentWallet()
        setWalletBalance()
        setWalletThreshold()
        setWalletName()
        setCurrentWalletOwners([])
    }

  }, [address])

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

  const handleConnectWallet = async () => {
    safeFactory.getSafes(address).then(async (d) => {
      console.log(d)
      setWallets(d);
    });
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

    const response = await postRecord(currentWallet, sendRecipient2, sendAmount2, [address], [sig]);

    const threshold = await safe(currentWallet).quorum()
    setCurrentTrhreshold(ethers.utils.formatUnits(threshold, 0))
    const responseRecords = await getRecordByWallet(currentWallet);
    setWaitList(responseRecords)
  };

  const postRecord = async (wallet, receiver, amount, approvers, sigs) => {
    const requestOptions = {
      method: "POST",
      body: JSON.stringify({ wallet, receiver, amount, approvers, sigs }),
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await fetch(`http://localhost:3003/`, requestOptions);
    const data = await response.json();
    if (response.status !== 200) {
      throw new Error(data.error);
    }
    console.log("Response from server: ", data);
  };

  const getRecordByWallet = async (wallet) => {
    const response = await fetch(
      `http://localhost:3003/get_records_by_wallet/${wallet}`
    );
    const data = await response.json();
    if (response.status !== 200) {
      throw new Error(data.error);

    }
    console.log("Response from server: : ", data);
    return data.record;
  };

  async function handleConnect(wallet) {
    setCurrentWallet(wallet.addr)
    const currentSafe = safe(wallet.addr)
    await currentSafe.getOwners()
      .then(async (data) => {
        setCurrentWalletOwners(data)
      })

    await provider.getBalance(currentSafe.address)
      .then(async (data) => {
        setWalletBalance(ethers.utils.formatUnits(data))
      })

    await currentSafe.name()
    .then(async (data) => {
      setWalletName(data)
    })

    await currentSafe.quorum()
      .then(async (data) => {
        setWalletThreshold(parseInt(data))
      })

    const threshold = await currentSafe.quorum()

    setCurrentTrhreshold(ethers.utils.formatUnits(threshold, 0))
    const response = await getRecordByWallet(currentWallet);
    setWaitList(response)
  }

  const handleRefreshWaitlist = async () => {
    const responseRecords = await getRecordByWallet(currentWallet);
    console.log(responseRecords)
    setWaitList(responseRecords)
  }

  const postUpdateApprover = async (id, approvers, _sigs) => {
    const currentSafe = safe(currentWallet);
    const executeHash = await currentSafe.EXECUTE_HASH();
    const payload = []

    const messageHash = await currentSafe.getMessageHash(executeHash, sendRecipient2, sendAmount2, payload);

    const signer = await provider.getSigner()

    const flatSig = await signer.signMessage(ethers.utils.arrayify(messageHash))
    const sig = ethers.utils.splitSignature(flatSig);
    const sigsToSend = [..._sigs, sig]

    const requestOptions = {
      method: "POST",
      body: JSON.stringify({ id, approvers, sigsToSend }),
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await fetch(`http://localhost:3003/update_approvers`, requestOptions);
    const data = await response.json();
    if (response.status !== 200) {
      throw new Error(data.error);
    }
    console.log("Response from server: ", data);

    const bnQuorum = await currentSafe.quorum()
    const quorum = ethers.utils.formatUnits(bnQuorum, 0)
    console.log("quorum is:", quorum)
    const item = await getApproves(id)

    const approves = item[0].approvers.length
    const sigs = item[0].sigs
    console.log("approves is:", approves)

    if (quorum <= approves) {
      const safeSinger = currentSafe.connect(signer)
      // execute logic
      console.log("sigs is", sigs)
      const tx = await safeSinger.executeTest(
        sendRecipient2,
        sendAmount2,
        payload,
        sigs,
        { value: sendAmount2 }
      )
      await tx.wait()
    }
  };

  const getApproves = async (id) => {
    const response = await fetch(
      `http://localhost:3003/get_approves_by_id/${id}`
    );
    const data = await response.json();
    if (response.status !== 200) {
      throw new Error(data.error);
    }
    console.log("Response from server: : ", data);
    return data.record;
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
              {address ? 
              (<span className="card-title">
                Your Gnosis Wallets:
              </span>)
                :
              (<span className="card-title">
                Connect to your Wallet!
              </span>)
              } 
              <div className="wallets">
                {wallets.map((wallet) =>
                  <div className="">
                    <span className="wallets-name">{wallet.name}</span>
                    <div style={{ height: 50 }} className="wallets-item" key={wallet.toString()}>
                      <div className="wallet-address">{wallet.addr}</div>
                      {currentWallet != wallet && <button className="add-owner" onClick={() => handleConnect(wallet)}>Connect</button>}
                    </div>
                  </div>
                )}
              </div>
              {currentWallet ? (
              <div>
              <hr className="divider" />
              <span className="card-title">
                Waitlist:
              </span>
              <div><button className="submit-button" style={{ marginLeft: 10, marginBottom: 10, width: 100, height: 30 }} onClick={() => handleRefreshWaitlist()}>Refresh</button></div>
              {waitList.length == 0 && <p style={{ marginLeft: 15 }}>There is no any txs...</p>}
              <div style={{ marginLeft: 15, marginRight: 15 }}>{waitList.map((obj, idx) =>
                <div>
                  <hr style={{ marginBottom: 5 }}></hr>
                  <span>👉 id: {idx} / </span>
                  <span>receiver: {obj.receiver} / </span>
                  <span>amount: {obj.amount}</span>
                  <p>approved: {obj.approvers.length} times out of {currentThreshold} </p>
                  {!obj.approvers.includes(address) &&
                    <div>This transaction needs your signature:
                      <button onClick={() => postUpdateApprover(obj._id, [...obj.approvers, address], obj.sigs)} className="add-owner" style={{ width: 80, height: 30, backgroundColor: "#C2E5D3" }}>Sign
                      </button>
                    </div>}
                </div>
              )}</div>
              <hr className="divider" />
              <span className="card-title">
                Wallet Info:
              </span>
              <div className="wallets">
                <div className="wallets-name">Wallet Name: <div className="wallet-address">{walletName}</div></div>
                <div className="wallets-name">Current wallet: <div className="wallet-address">{currentWallet}</div></div>
                <div className="wallets-name">Wallet balance: <div className="wallet-address">{walletBalance}</div></div>
                <div className="wallets-name">Wallet threshold: <div className="wallet-address">{walletThreshold}</div></div>
                <div className="wallets-name">Owners: {currentWalletOwners.map((owner) => <div key={owner.id} className="wallet-address">{owner}</div>)}</div>
              </div>
              <hr className="divider" />
              <span className="card-title">
                Create transaction:
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
              </div>) : <div></div>}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Wallets;
