import BN from 'bn.js'
import Web3 from 'web3'

const contract = ref()
const stage = ref('')
const maxPerNum = ref(0)
const preSalePerToken = ref('0')
const publicSalePerToken = ref('0')
const loading = ref(false)
const preLoading = ref(false)
const maxSupply = ref(0)
const totalSupply = ref(0)
const signatureUsed = ref<'used'|'unused'|null>(null)

const setContract = async(abi:any, contractAddress?:string, web3?:any) => {
  if (!web3) {
    const provider = new Web3.providers.HttpProvider(import.meta.env.VITE_APP_RPC_URL)
    web3 = new Web3(provider)
  }
  contract.value = new web3.eth.Contract(abi, contractAddress)

  return contract.value
}

const getSupply = async() => {
  try {
    maxSupply.value = await contract.value?.methods.MAX_SUPPLY().call()
    totalSupply.value = await contract.value?.methods.totalSupply().call()
  } catch (error) {
    console.log(error)
    maxSupply.value = 0
    maxSupply.value = 0
  }
}

const getStage = async() => {
  try {
    stage.value = await contract.value?.methods._stage().call()
    return Promise.resolve(stage.value)
  } catch (error) {
    console.log(error)
    return null
  }
}

const getMaxNumber = async() => {
  try {
    const num = await contract.value?.methods.MAX_PER_MINT_NUM().call()
    maxPerNum.value = parseInt(num)
    return Promise.resolve(maxPerNum.value)
  } catch (error) {
    console.log(error)
    return null
  }
}

const getPreSalePerToken = async() => {
  try {
    preSalePerToken.value = await contract.value.methods.PRESALE_PRICE_PER_TOKEN().call()
    return Promise.resolve(preSalePerToken.value)
  } catch (error) {
    console.log(error)
    return null
  }
}

const getPublicSalePerToken = async() => {
  try {
    publicSalePerToken.value = await contract.value.methods.PUBLICSALE_PRICE_PER_TOKEN().call()
    return Promise.resolve(publicSalePerToken.value)
  } catch (error) {
    console.log(error)
    return null
  }
}

const mint = async(num: number, address: string) => {
  try {
    if (!num) throw new Error('No mint num!')
    const value = new BN(publicSalePerToken.value).mul(new BN(num))
    const gas = await contract.value.methods.mint(new BN(num)).estimateGas({
      from: address,
      value: value
    })
    loading.value = true
    const tx = await contract.value.methods.mint(new BN(num)).send({
      from: address,
      value: value,
      gas: gas
    })
    loading.value = false
    return Promise.resolve(tx)
  } catch (error:any) {
    loading.value = false
    throw new Error(error.message)
  }
}

const allowListMint = async(num: number, address: string, signature: string) => {
  try {
    if (!num) throw new Error('No mint num!')
    const value = new BN(preSalePerToken.value).mul(new BN(num))
    preLoading.value = true
    const gas = await contract.value.methods.mintAllowList(num, signature).estimateGas({
      from: address,
      value: value
    })
    const tx = await contract.value.methods.mintAllowList(num, signature).send({
      from: address,
      value: value,
      gas: gas
    })
    preLoading.value = false
    return Promise.resolve(tx)
  } catch (error:any) {
    preLoading.value = false
    throw new Error(error.message)
  }
}

const getSignatureState = async(signature:string, contractContext?:any) => {
  try {
    if (!contractContext) contractContext = contract.value
    const used = await contractContext.methods.signatureUsed(signature).call()
    signatureUsed.value = used ? 'used' : 'unused'
    return Promise.resolve(used)
  } catch (error) {
    signatureUsed.value = null
  }
}

export default function() {
  return {
    contract,
    stage,
    maxPerNum,
    preSalePerToken,
    publicSalePerToken,
    loading,
    preLoading,
    maxSupply,
    totalSupply,
    signatureUsed,
    setContract,
    getStage,
    getMaxNumber,
    getPreSalePerToken,
    getPublicSalePerToken,
    mint,
    allowListMint,
    getSupply,
    getSignatureState
  }
}
