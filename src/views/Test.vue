<script lang="ts" setup>
import { useConnect } from '../hooks'

const balance = ref(0)
const { connect, disconnect, address, chainId, isConnected, web3 } = useConnect()
const walletConnect = async() => {
  connect()
}

const getBalance = async() => {
  const b = await web3.value.eth.getBalance(address.value)
  balance.value = web3.value.utils.fromWei(b)
}

</script>
<template>
  <div id="connect-test">
    <a-space>
      <a-button type="primary" @click="walletConnect">
        Connect Wallet
      </a-button>
      <a-button type="primary" @click="getBalance">
        Balance
      </a-button>
      <a-button :disabled="!isConnected" @click="disconnect">
        Disconnect
      </a-button>
    </a-space>

    <div class="table-wrapper">
      <a-descriptions title="Info" bordered>
        <a-descriptions-item label="Address">
          {{ address }}
        </a-descriptions-item>
        <a-descriptions-item label="ChainId">
          {{ chainId }}
        </a-descriptions-item>
        <a-descriptions-item label="IsConnected">
          {{ isConnected }}
        </a-descriptions-item>
        <a-descriptions-item label="Balance">
          {{ balance }}
        </a-descriptions-item>
      </a-descriptions>
    </div>
  </div>
</template>

<style>
#connect-test{
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column wrap;
  gap: 20px;
  justify-content: center;
  align-items: center;
}
.table-wrapper{
  width: 80%;
}
</style>

