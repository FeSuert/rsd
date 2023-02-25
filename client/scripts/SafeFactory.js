import provider from './provider'
import { ethers } from 'ethers'
import { abi } from '../../chain/out/SafeFactory.sol/SafeFactory.json'

const contract_address = "0x00aacC64aaCF9a2A1fC51C31EB3989CFb0415cEf"

const SafeFactory = new ethers.Contract(contract_address, abi, provider)

export default SafeFactory;