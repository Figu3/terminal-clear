import { Address } from 'viem'

// Clear Protocol contract addresses (Ethereum Mainnet)
export const CONTRACTS = {
  vault: '0x5cc8b3282dcc692532b857a68bc0fb07f45fbade' as Address,
  swap: '0xeb5ad3d93e59efcbc6934cad2b48eb33baf29745' as Address,
  oracle: '0x049ad7ff0c6bdbab86baf4b1a5a5ca975e234fca' as Address,
  factory: '0x8bf266ed803e474ae7bf09adb5ba2566c489223d' as Address,
  iouCollector: '0x2879df6a88b63893ee62ad3cb7f7231e776d6bd1' as Address,
}

// Token addresses
export const TOKENS: Record<string, { address: Address; symbol: string; decimals: number }> = {
  '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48': { address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', symbol: 'USDC', decimals: 6 },
  '0x40d16fc0246ad3160ccc09b8d0d3a2cd28ae6c2f': { address: '0x40d16fc0246ad3160ccc09b8d0d3a2cd28ae6c2f', symbol: 'GHO', decimals: 18 },
  '0xdac17f958d2ee523a2206206994597c13d831ec7': { address: '0xdac17f958d2ee523a2206206994597c13d831ec7', symbol: 'USDT', decimals: 6 },
  '0x6b175474e89094c44da98b954eedeac495271d0f': { address: '0x6b175474e89094c44da98b954eedeac495271d0f', symbol: 'DAI', decimals: 18 },
  '0xdc035d45d973e3ec169d2276ddab16f1e407384f': { address: '0xdc035d45d973e3ec169d2276ddab16f1e407384f', symbol: 'USDS', decimals: 18 },
  '0x4c9edd5852cd905f086c759e8383e09bff1e68b3': { address: '0x4c9edd5852cd905f086c759e8383e09bff1e68b3', symbol: 'USDe', decimals: 18 },
  // IOU tokens
  '0x139c15f07260b0f7fce30d64f9fc6f31c00e3814': { address: '0x139c15f07260b0f7fce30d64f9fc6f31c00e3814', symbol: 'iouUSDC', decimals: 6 },
  '0x50ca266a50c6531dce25ee7da0dfb57a06bd864e': { address: '0x50ca266a50c6531dce25ee7da0dfb57a06bd864e', symbol: 'iouGHO', decimals: 18 },
}

export function getTokenInfo(address: string): { symbol: string; decimals: number } {
  const token = TOKENS[address.toLowerCase()]
  return token || { symbol: address.slice(0, 6) + '...' + address.slice(-4), decimals: 18 }
}
