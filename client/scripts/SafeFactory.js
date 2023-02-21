import provider from './provider'
import { ethers } from 'ethers'
import { abi } from '../../chain/out/SafeFactory.sol/SafeFactory.json'

const contract_address = "0xC43aB04c26C0Eb33F99963DFe7Ab627eE4646020"

const SafeFactory = new ethers.Contract(contract_address, abi, provider)

export default SafeFactory;