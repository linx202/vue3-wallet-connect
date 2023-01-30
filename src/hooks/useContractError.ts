import { serializeError } from 'eth-rpc-errors'

const contractMessages = [
  'PreSale is not started',
  'Exceeded max token purchase',
  'Purchase would exceed max tokens',
  'Ether value sent is not correct',
  'Address is not in allowlist',
  'Signature has already been used',
  'insufficient funds',
  'denied transaction'
]

const handleError = (err:any) => {
  if (err?.message) {
    const { message } = err
    console.log(err)
    if (message.includes('Transaction has been reverted by the EVM')) {
      return new Error('Purchase would exceed max tokens')
    }
    for (const m of contractMessages) {
      if (message.includes(m)) return new Error(m.replace(/^\S/, s => s.toUpperCase()))
    }
  }
  // return new Error(err?.message || err)
  const e = serializeError(err)
  if (e.message.includes('\n')) {
    e.message = e.message.split('\n')[0]
  }
  console.log(e.message)
  return new Error(e.message)
}

export default function() {
  return {
    handleError
  }
}
