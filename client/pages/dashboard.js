import React, { useState, useEffect, useRef, createRef, useContext } from "react";
import { ethers } from "ethers";
import provider from "../scripts/provider";
import safe from "../scripts/Safe.js";
import safeFactory from "../scripts/SafeFactory.js";
import Layout from "../components/layout";
import { useAppContext } from "../hooks/useAppContext";
import { Context } from "../context/Context";


const Dashboard = () => {
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
    const amount1 = ethers.utils.parseEther(sendAmount2).toString()
    const currentSafe = safe(currentWallet);
    const executeHash = await currentSafe.EXECUTE_HASH();
    const payload = []

    const messageHash = await currentSafe.getMessageHash(executeHash, sendRecipient2, amount1, payload);

    const signer = await provider.getSigner()
    const safeSinger = currentSafe.connect(signer)

    const flatSig = await signer.signMessage(ethers.utils.arrayify(messageHash))
    const sig = ethers.utils.splitSignature(flatSig);

    const response = await postRecord(currentWallet, sendRecipient2, amount1, [address], [sig]);

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
    setWaitList(responseRecords)
  }

  const postUpdateApprover = async (id, approvers, _sigs, receiver, amount) => {
    const currentSafe = safe(currentWallet);
    const executeHash = await currentSafe.EXECUTE_HASH();
    const payload = []

    const messageHash = await currentSafe.getMessageHash(executeHash, receiver, amount, payload);

    const signer = await provider.getSigner()

    const flatSig = await signer.signMessage(ethers.utils.arrayify(messageHash))
    const sig = ethers.utils.splitSignature(flatSig);
    const sigsToSend = [..._sigs, sig]
    console.log("sigs to send", sigsToSend)

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

    const bnQuorum = await currentSafe.quorum()
    const quorum = ethers.utils.formatUnits(bnQuorum, 0)
    const item = await getApproves(id)

    const approves = item[0].approvers.length
    const sigs = item[0].sigs

    if (quorum <= approves) {
      const safeSinger = currentSafe.connect(signer)
      // execute logic

      const tx = await safeSinger.execute(
        receiver,
        amount,
        payload,
        sigs,
        { value: amount }
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
            <h2 className="title">Dashboard</h2>
          </div>
          <div className="MuiGrid-item grid-item">
          <div className="card">
          <div className="progress-bar">
                <span className="linear-progress-bar">
                  <span className="progress-bar-fill"></span>
                </span>
          </div>
          {address ? 
              (
              <div>
                <span className="card-title">
                  Newest Created Wallets
                </span>
                <div className="wallets">
                  <ul class="my-list">
                    {wallets.map((wallet) =>
                      <li className="my-list">
                        <span className="wallets-name">{wallet.name}: </span>
                        <div className="" key={wallet.toString()}>
                          <div className="wallet-address"> {wallet.addr}</div>
                        </div>
                      </li>
                    )}
                  </ul>
                </div>
              </div>)
                :
              (<span className="card-title">
                Connect to your Wallet!
              </span>)
              } 
              </div>
          </div>
        </div>
      </div>

    </Layout>
  );
};

export default Dashboard;
