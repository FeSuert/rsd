import provider from './provider'
import { ethers } from 'ethers'
import { abi } from '../../chain/out/SafeFactory.sol/SafeFactory.json'

const contract_address = "0xECFA41E83a8BEeE6A648dD41c01ac29D9d61eF96"

const SafeFactory = new ethers.Contract(contract_address, abi, provider)

export default SafeFactory;