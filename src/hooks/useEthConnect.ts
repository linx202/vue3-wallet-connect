import Web3 from 'web3'
import detectEthereumProvider from '@metamask/detect-provider'
import { message } from 'ant-design-vue'

interface WalletInfo {
  address: string,
  isConnected: boolean,
  ready?: boolean,
  chainId: string | number,
  web3: any
}

const wallet: WalletInfo = reactive({
  isConnected: false,
  address: '',
  chainId: '',
  web3: null
})

const startApp = async(provider:any) => {
  if (window.ethereum.providerMap?.get('MetaMask')) {
    window.ethereum = provider.providerMap.get('MetaMask')
    provider = provider.providerMap.get('MetaMask')
  }
  wallet.web3 = new Web3(provider)
  try {
    const address = await provider.request({ method: 'eth_requestAccounts' })
    if (address[0]) {
      removeListeners()
      addListeners()
    }

    wallet.address = address[0]
    wallet.isConnected = await provider.isConnected()
    wallet.chainId = Number(provider.chainId)
    return Promise.resolve(wallet.address)
  } catch (error:any) {
    if (error.code === -32002) {
      message.error('Please open metamask to confirm!')
    }
  }
}

const metaMaskConnect = async() => {
  const provider = await detectEthereumProvider()
  if (!window.ethereum) {
    alert('Please install metamask')
    window.open('https://metamask.io/', 'blank')
  }
  if (provider) {
    return startApp(provider) // initialize app
  } else {
    console.log('Please install MetaMask!')
  }
}

const disconnect = async() => {
  wallet.address = ''
  wallet.isConnected = false
  wallet.chainId = ''
  wallet.web3.currentProvider = null
  removeListeners()
  return Promise.resolve(false)
}

const addListeners = () => {
  window.ethereum.on('chainChanged', async(_chainId:string) => {
    wallet.chainId = Number(_chainId)
    console.log('chainChanged', _chainId)
    alert('Network changed!')
    disconnect()
  })
  window.ethereum.on('accountsChanged', async(accounts: Array<string>) => {
    if (accounts.length === 0) {
      disconnect()
    } else {
      wallet.address = accounts[0]
      console.log('Account changed!')
    }
  })
}

const removeListeners = () => {
  if (window.ethereum.removeAllListeners) {
    window.ethereum.removeAllListeners()
  }
}

const signMsg = async() => {
  if (!wallet.isConnected) {
    await metaMaskConnect()
  }
  try {
    const from = wallet.address
    const message = import.meta.env.VITE_APP_SIGN_MESSAGE
    const hexMsg = `0x${Buffer.from(message, 'utf8').toString('hex')}`
    return window.ethereum.request({
      method: 'personal_sign',
      params: [hexMsg, from]
    })
  } catch (err) {
    console.error(err)
  }
}

const switchChain = async(chainId:string) => {
  await window.ethereum.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: chainId }]
  })
  return Promise.resolve(chainId)
}

export default function() {
  return {
    ...toRefs(wallet),
    metaMaskConnect,
    disconnect,
    signMsg,
    switchChain
  }
}
