import useEthConnect from './useEthConnect'
import useAppConnect from './useAppConnect'

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

const { connect: appConnect, disconnect: appDisconnect, address: appAddress, web3: appWeb3, chainId: appChainId, switchChain: appSwitchChain } = useAppConnect()

const { metaMaskConnect: pcConnect, disconnect: pcDisconnect, address: pcAddress, web3: pcWeb3, chainId: pcChainId, switchChain: pcSwitchChain } = useEthConnect()

watch([pcAddress, appAddress], v => {
  if (!v[0] && !v[1]) disconnect()
  if (v[0]) {
    wallet.address = v[0]
  }
  if (v[1]) {
    wallet.address = v[1]
  }
})

watch([pcChainId, appChainId], v => {
  if (v[0]) {
    wallet.chainId = v[0]
  }
  if (v[1]) {
    wallet.chainId = v[1]
  }
})

const isMobile = () => {
  const userAgentInfo = navigator.userAgent
  const Agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod']
  const getArr = Agents.filter(i => userAgentInfo.includes(i))
  return !!getArr.length
}

const setWallet = (walletInfo:WalletInfo) => {
  wallet.address = walletInfo.address
  wallet.chainId = walletInfo.chainId
  wallet.isConnected = walletInfo.isConnected
  wallet.web3 = walletInfo.web3
}

const connect = async() => {
  let res = null
  const mobile = isMobile()
  if (mobile) {
    res = await appConnect()
  } else {
    res = await pcConnect() || ''
  }
  if (res) {
    wallet.web3 = mobile ? appWeb3.value : pcWeb3.value
    wallet.address = res
    wallet.isConnected = true
    wallet.chainId = mobile ? appChainId.value : pcChainId.value
  }
  return Promise.resolve(res)
}

const disconnect = async() => {
  let res = null
  if (isMobile()) {
    res = await appDisconnect()
  } else {
    res = await pcDisconnect()
  }
  if (res === false) {
    wallet.address = ''
    wallet.isConnected = false
    wallet.chainId = ''
    wallet.web3.currentProvider = null
  }
}

const switchChain = async(chainId:string) => {
  try {
    if (isMobile()) {
      await appSwitchChain(chainId)
    } else {
      await pcSwitchChain(chainId)
    }
    wallet.chainId = Number(chainId)
    return Promise.resolve(chainId)
  } catch (error) {
    throw new Error('Changed network failed')
  }
}

export default function() {
  return {
    ...toRefs(wallet),
    connect,
    disconnect,
    switchChain
  }
}
