import provider from './provider'
import { ethers } from 'ethers'
import { abi } from '../../chain/out/SafeFactory.sol/SafeFactory.json'

const contract_address = "0xf174a20453059b07b3fc36b42a4a43b4bcca2a70"

const SafeFactory = new ethers.Contract(contract_address, abi, provider)

export default SafeFactory;