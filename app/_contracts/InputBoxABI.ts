/**
 * This ABI is trimmed down to just the addInput function and related types
 * for the InputBox contract.
 */
const abi = [
  {
    type: 'function',
    name: 'addInput',
    inputs: [
      { name: '_dapp', type: 'address', internalType: 'address' },
      { name: '_input', type: 'bytes', internalType: 'bytes' }
    ],
    outputs: [
      { name: '', type: 'bytes32', internalType: 'bytes32' }
    ],
    stateMutability: 'nonpayable'
  },
  {
    type: 'event',
    name: 'InputAdded',
    inputs: [
      { name: 'dapp', type: 'address', indexed: true, internalType: 'address' },
      { name: 'inputIndex', type: 'uint256', indexed: true, internalType: 'uint256' },
      { name: 'sender', type: 'address', indexed: false, internalType: 'address' },
      { name: 'input', type: 'bytes', indexed: false, internalType: 'bytes' }
    ],
    anonymous: false
  },
  {
    type: 'error',
    name: 'InputSizeExceedsLimit',
    inputs: []
  }
] as const;

export default abi;
