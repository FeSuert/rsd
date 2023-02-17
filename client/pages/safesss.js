import React, { useState, useEffect, useRef, createRef } from "react";
import { ethers } from 'ethers'
import provider from "../scripts/provider"
import Safe from '../scripts/Safe.js'
import safeFactory from '../scripts/SafeFactory.js'
import 'semantic-ui-css/semantic.min.css'
import { Checkbox, Select, Card, Button, Divider, Form, Input, Loader, Icon, Header, Modal } from 'semantic-ui-react'
import Layout from "../components/layout";

const Safes = (props) => {
  const [address, setAddress] = useState("");
  const [wallets, setWallets] = useState([])
  const [currentWallet, setCurrentWallet] = useState("")
  const [currentWalletOwners, setCurrentWalletOwners] = useState([])
  const [threshold, setThreshold] = useState()
  const [walletName, setWalletName] = useState()
  const [addedSigners, setAddedSigners] = useState([])
  const [addedSigner, setAddedSigner] = useState()
  const [walletBalance, setWalletBalance] = useState()
  const [walletThreshold, setWalletThreshold] = useState()
  const [signers, setSigners] = useState([])
  const [sendRecipient, setSendRecepient] = useState()
  const [sendAmount, setSendAmount] = useState()
  const [sigs, setSigs] = useState([])
  const [nonce, setNonce] = useState()
  const [testMsg, setTestMsg] = useState()
  const [addrFromSig, setAddrFromSig] = useState()

  const inputRef = createRef()

  const bnbChainId = "0x38";
  const maxShots = 15;
  const EXECUTE_HASH = ethers.utils.id("Execute(address target,uint256 value,bytes payload,uint256 nonce)")

  useEffect(() => {
    if (provider.connection.url === 'metamask') {

      // provider.send("eth_requestAccounts", []) // задаем текущий адрес
      // .then((accounts) => {
      //   setAddress(accounts[0])
      // })
      // .catch((error) => console.log(error))

      const { provider: ethereum } = provider;
      ethereum.on('accountsChanged', (accounts) => {
        setAddress("")
      })
    }

  }, [])

  const handleConnectWalletClick = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Metamask not detected");
        return;
      }
      let chainId = await ethereum.request({ method: "eth_chainId" });

      await ethereum.request({
        method: "eth_requestAccounts",
      }).then(async (data) => {
        setAddress(data[0]);
        try {
          await safeFactory.getSafes(data[0])
            .then(async (d) => {
              setWallets(d)
            })
        } catch (error) {
          console.log(error)
        }
      })


    } catch (error) {
      console.log("Error connecting to metamask", error);
    }
  };

  const handleCreateSafe = async (event) => {
    event.preventDefault()
    const signer = await provider.getSigner()
    const signerConnected = safeFactory.connect(signer)

    console.log(signers)

    const response = await signerConnected.createSafe(walletName, addedSigners, threshold)
    await response.wait()
      .then(async (data) => {
        console.log(data)
        await safeFactory.getSafes(address)
          .then(async (d) => {
            setWallets([...wallets, d])
          })
      })
    setAddedSigners([])
  }

  const handleSendTokens = async () => {
    const safe = Safe(currentWallet);
    const messageHash = ""
    await safe.nonce()
      .then((n) => {
        setNonce(parseInt(n))
        console.log(parseInt(n))
        messageHash = ethers.utils.id(
          EXECUTE_HASH + sendRecipient + sendAmount + (parseInt(n)).toString()
        );
      })

    const domainSeparator = await safe.domainSeparator();

    const signer = await provider.getSigner()
    const flatSig = await signer.signMessage(ethers.utils.arrayify(messageHash))
    const sig = ethers.utils.splitSignature(flatSig);
    setSigs([...sigs, sig.toString()])
    console.log(sendAmount)
    console.log(parseInt(sendAmount))
    // const recovered = await Safe(currentWallet).verify({"v": sig.v, "r": sig.r, "s": sig.s});
    const safeSinger = safe.connect(signer)

    const tx = await safeSinger.r(
      sendRecipient,
      sendAmount,
      [],
      sigs,
      { value: "100" }
    )
    await tx.wait()

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
  }

  const handleAddClick = () => {
    setAddedSigners([...addedSigners, addedSigner])
  }

  async function handleConnect(wallet) {
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
    const msgHash = ethers.utils.id(testMsg)
    const signer = await provider.getSigner()
    const flatSig = await signer.signMessage(ethers.utils.arrayify(msgHash))
    const sig = ethers.utils.splitSignature(flatSig);

    await Safe(currentWallet).test(testMsg, sig)
      .then(async (d) => {
        console.log("res:", d)
        setAddrFromSig(d)
      })
  }

  return (
    <Layout>
      <div style={{ marginTop: 15 }} className="ui centered cards">
        <div className="ui card" style={{ width: "400px" }}>
          <div className="content">
            <Button
              positive={!!address}
              primary
              onClick={handleConnectWalletClick}
              style={{ width: "370px" }}>
              {!address ? "Connect to Wallet" : address}
            </Button>
          </div>
          <div className="wallets-list">
            {wallets.map((wallet) => <p key={wallet.toString()}>
            <span style={{ fontSize: 12 }}>{wallet}</span><button onClick={() => handleConnect(wallet)}>Connect</button>
            </p>)}
          </div>
          <div className="content">
            <Form style={{ marginLeft: "10px" }} onSubmit={handleCreateSafe}>
              <div className="ui input">
                <input min="-999999999" max="9999999999" step="0.0000001"
                  placeholder="Enter name"
                  type="text"
                  value={walletName}
                  onChange={(e) => setWalletName(e.target.value)}
                />
              </div>
              <div className="ui input">
                <input min="-999999999" max="9999999999" step="0.0000001"
                  placeholder="Enter threshold"
                  type="number"
                  value={threshold}
                  onChange={(e) => setThreshold(e.target.value)}
                />
              </div>
              <Button primary style={{ marginLeft: 15, width: 164 }} type="submit">
                Create Safe
              </Button>
            </Form>
            <Form style={{ marginLeft: "10px" }} onSubmit={handleAddClick}>
              <Button primary style={{ marginLeft: 15, width: 164 }} type="submit">
                Add owner
              </Button>
              <div className="ui input">
                <input min="-999999999" max="9999999999" step="0.0000001"
                  placeholder="Enter name"
                  type="text"
                  value={addedSigner}
                  onChange={(e) => setAddedSigner(e.target.value)}
                />
              </div>
            </Form>
            <div>{addedSigners.map((signer) => <div key={signer.id}>{signer}</div>)}</div>
          </div>
          <div className="content">
            <div style={{ marginTop: 15, marginBottom: 15 }}><h3>Info</h3></div>
            <div>Current wallet: {currentWallet}</div>
            <div>Wallet balance: {walletBalance}</div>
            <div>Wallet threshold: {walletThreshold}</div>
            <div>Owners: {currentWalletOwners.map((owner) => <div key={owner.id}>{owner}</div>)}</div>
            <div style={{ marginTop: 15, marginBottom: 15 }}><h3>Send tokens</h3></div>
            <Form onSubmit={handleSendTokens}>
              <Form.Field>
                <label>Recipient</label>
                <input type="text" value={sendRecipient} onChange={(e) => setSendRecepient(e.target.value)} placeholder='Recipient' />
              </Form.Field>
              <Form.Field>
                <label>Amount</label>
                <input type="text" value={sendAmount} onChange={(e) => setSendAmount(e.target.value)} placeholder='Amount' />
              </Form.Field>
              <Button type='submit'>Create tx</Button>
            </Form>
          </div>
          <div className="content">
            <p>My wallets:</p>
            <p>0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266</p>
            <p>0x70997970C51812dc3A010C7d01b50e0d17dc79C8</p>
            <p>0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC</p>
          </div>
          <div className="content">
            <div style={{ marginTop: 15, marginBottom: 15 }}><h3>Signature decode tests</h3></div>
            <Form onSubmit={handleTests}>
              <Form.Field>
                <label>Message</label>
                <input type="text" value={testMsg} onChange={(e) => setTestMsg(e.target.value)} placeholder='Message' />
              </Form.Field>
              <Button type='submit'>Send signature</Button>
              <Form.Field style={{marginTop: 15}}>
                <label>Calculated addr: {addrFromSig}</label>
              </Form.Field>
            </Form>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Safes;
