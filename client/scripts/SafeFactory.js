import provider from './provider'
import { ethers } from 'ethers'
import { abi } from '../../chain/out/SafeFactory.sol/SafeFactory.json'

const contract_address = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

const SafeFactory = new ethers.Contract(contract_address, abi, provider)

export default SafeFactory;