import React, { useState, useEffect, useRef, createRef } from "react";
import { ethers } from 'ethers'
import provider from "../scripts/provider"
import Safe from '../scripts/Safe.js'
import safeFactory from '../scripts/SafeFactory.js'
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
        <div class="mui-style-1qsxih2">
            <div class="mui-style-1m2k0cd">
            <div class="MuiGrid-item mui-style-15j76c0">
                <h2 class="mui-style-1dp9jmp">
                Create new Safe
                </h2>
            </div>
            <div class="MuiGrid-item mui-style-jpj6gz">
                <div class="styles_card__KZyC4 mui-style-1dedxvp">
                <div class="styles_progress__n7o3O mui-style-1iilbmq">
                    <span class="MuiLinearProgress-root mui-style-1k0tgmg">
                    <span class="mui-style-1yphw4u">
                    </span>
                    </span>
                </div>
                    <span class="MuiCardHeader-title mui-style-gxiyii">
                        Select network and create your Safe
                    </span>
                <div class="MuiCardContent-root styles_content__1EARB mui-style-1qw96cp">
                    <form>
                    <div class="styles_row__72Qh_">
                        <div class="mui-style-tuxzvu">
                        <div class="MuiGrid-item mui-style-efwuvd">
                            <div class="mui-style-feqhe6">
                            <label class="mui-style-6fso6q">
                                Name
                            </label>
                            <div class="mui-style-ncsr8s">
                                <input name="name" placeholder="example-ethereum-safe" type="text" class="mui-style-xtosi7" value=""/>
                                <fieldset class="mui-style-pz9cy9">
                                <legend class="mui-style-14lo706">
                                    <span>
                                    Name
                                    </span>
                                </legend>
                                </fieldset>
                            </div>
                            </div>
                        </div>
                        <div class="MuiGrid-item mui-style-1wxaqej">
                            <div class="styles_select__qyA35">
                            <div class="styles_select__Yu2wY mui-style-66vfy">
                                <div class="MuiSelect-select mui-style-1myoznb">
                                <span class="styles_inlineIndicator__Ec8RB">
                                    Network: Ethereum
                                </span>
                                </div>
                            </div>
                            </div>
                        </div>
                        </div>
                    </div>
                    <hr class="mui-style-9bvjn4"/>
                    <div class="styles_row__72Qh_">
                        <div class="mui-style-1ukoe8t">
                        <button class="mui-style-c6irak" type="submit">
                            Confirm
                            <span class="mui-style-w0pj6f">
                            </span>
                        </button>
                        </div>
                    </div>
                    </form>
                </div>
                </div>
            </div>
            <div class="MuiGrid-item mui-style-mwsm8z">
                <div class="mui-style-1h77wgb">
                <div class="MuiGrid-item mui-style-15j76c0">
                    <div class="styles_card__qfX73 mui-style-1dedxvp">
                    <div class="styles_header__n_n1M">
                        <h4 class="mui-style-3nk0zo">
                        Your Safe preview
                        </h4>
                    </div>
                    <div class="styles_row__bTL9Q">
                        <p class="mui-style-10r5yqu">
                        Wallet
                        </p>
                        <div class="styles_container__mHx1M">
                        <div>
                            <div class="mui-style-1p0zcpf">
                            Network: Ethereum
                            </div>
                            <div class="mui-style-syhnk2">
                            <div class="styles_container__rxAZ3">
                                <div class="styles_avatar__5rCuj">
                                </div>
                                </div>
                                <div class="styles_nameRow___G28i">
                                <div class="styles_addressRow__52BEb">
                                    <p class="mui-style-15vi4o">
                                    <b>
                                        eth:
                                    </b>
                                    <span class="styles_mobileAddress__fIwBR">
                                        0xbcD2...29a1
                                    </span>
                                    <span>
                                        0xbcD2...29a1
                                    </span>
                                    </p>
                                </div>
                                </div>
                            </div>
                            </div>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            </div>
        </div>
    </Layout>
  )
}

export default Safes;
