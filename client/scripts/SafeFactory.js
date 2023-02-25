import provider from './provider'
import { ethers } from 'ethers'
import { abi } from '../../chain/out/SafeFactory.sol/SafeFactory.json'

const contract_address = "0xE0b9F30D281e3339B20299aB1761c7C8f1e11D54"

const SafeFactory = new ethers.Contract(contract_address, abi, provider)

export default SafeFactory;