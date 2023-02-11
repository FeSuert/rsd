import provider from './provider'
import { ethers } from 'ethers'
import { abi } from '../../chain/out/SafeFactory.sol/SafeFactory.json'

const contract_address = "0xf3da627aa64da49Ac0Bb95858eF745538A88588E"

const SafeFactory = new ethers.Contract(contract_address, abi, provider)

export default SafeFactory;