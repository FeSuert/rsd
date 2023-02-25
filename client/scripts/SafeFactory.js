import provider from './provider'
import { ethers } from 'ethers'
import { abi } from '../../chain/out/SafeFactory.sol/SafeFactory.json'

const contract_address = "0x1908D4c618ACEC1Ee5D510d876244eCa7b4D740c"

const SafeFactory = new ethers.Contract(contract_address, abi, provider)

export default SafeFactory;