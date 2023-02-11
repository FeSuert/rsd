import provider from './provider'
import { ethers } from 'ethers'
import { abi } from '../../chain/out/Safe.sol/Safe.json' 

const contract_address = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

const Safe = (addr) =>  new ethers.Contract(addr, abi, provider)

export default Safe;