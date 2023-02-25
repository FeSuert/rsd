import provider from './provider'
import { ethers } from 'ethers'
import { abi } from '../../chain/out/SafeFactory.sol/SafeFactory.json'

const contract_address = "0xb81cc80F765dDa6813942EeB421A38A1f84871cb"

const SafeFactory = new ethers.Contract(contract_address, abi, provider)

export default SafeFactory;