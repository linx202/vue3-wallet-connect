import WalletConnectProvider from '@walletconnect/web3-provider'
import Web3 from 'web3'

interface WalletInfo {
  address: string,
  isConnected: boolean,
  ready?: boolean,
  chainId: string | number,
  web3: any
}

const initialState = reactive<WalletInfo>({
  isConnected: false,
  address: '',
  chainId: '',
  web3: null
})
const provider = ref()

const connect = async() => {
  try {
    provider.value = new WalletConnectProvider({
      infuraId: import.meta.env.VITE_APP_INFURA_ID,
      chainId: import.meta.env.PROD ? 1 : 5,
      qrcodeModalOptions: {
        mobileLinks: [
          'metamask',
          'rainbow',
          'argent',
          'trust',
          'imtoken',
          'pillar',
          'onto',
          'spot'
        ]
      }
    })
    const address = await provider.value.enable()
    if (address[0]) {
      removeListeners()
      addListeners()
    }
    initialState.address = address[0]
    initialState.isConnected = true
    initialState.web3 = new Web3(provider.value)
    initialState.chainId = provider.value.chainId

    return Promise.resolve(address[0])
  } catch (error:any) {
    console.log(error)
    throw new Error(error.message || 'Wallet connect failed')
  }
}

const addListeners = () => {
  provider.value.on('chainChanged', async(_chainId:string) => {
    initialState.chainId = Number(_chainId)
    console.log('chainChanged', _chainId)
    alert('Network changed!')
    disconnect()
  })
  provider.value.on('accountsChanged', async(accounts: Array<string>) => {
    if (accounts.length === 0) {
      disconnect()
    } else {
      console.log('Account changed!', initialState.address)
      initialState.address = accounts[0]
    }
  })
}

const removeListeners = () => {
  if (provider.value.removeAllListeners) {
    provider.value.removeAllListeners()
  }
}

const disconnect = async() => {
  try {
    await provider.value.disconnect()
    initialState.isConnected = false
    initialState.address = ''
    initialState.web3.currentProvider = null
    removeListeners()
    return Promise.resolve(false)
  } catch (error) {
    throw new Error('Wallet disconnect failed')
  }
}

const switchChain = async(chainId:string) => {
  if (!initialState.isConnected) {
    await connect()
  }
  await provider.value.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: chainId }]
  })
  return Promise.resolve(chainId)
}

export default function() {
  return {
    ...toRefs(initialState),
    connect,
    disconnect,
    switchChain
  }
}

