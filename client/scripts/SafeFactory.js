import provider from './provider'
import { ethers } from 'ethers'
import { abi } from '../../chain/out/SafeFactory.sol/SafeFactory.json'

const contract_address = "0x5a4Ac78EC8CC3A9773ba3C2479005796f9AdF19A"

const SafeFactory = new ethers.Contract(contract_address, abi, provider)

export default SafeFactory;