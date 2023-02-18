import provider from './provider'
import { ethers } from 'ethers'
import { abi } from '../../chain/out/SafeFactory.sol/SafeFactory.json'

const contract_address = "0x33412cc34a97d4ad1ff1e8b57d8eef4008757239"

const SafeFactory = new ethers.Contract(contract_address, abi, provider)

export default SafeFactory;