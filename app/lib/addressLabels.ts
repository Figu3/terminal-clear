export type AddressType = 'aggregator' | 'mev' | 'protocol' | 'solver' | 'pool' | 'user'

export interface AddressLabel {
  name: string
  type: AddressType
}

// Known addresses from Clear Protocol registry and common aggregators
export const ADDRESS_LABELS: Record<string, AddressLabel> = {
  // ===== DEX Aggregators =====
  '0x9008d19f58aabd9ed0d60971565aa8510560ab41': { name: 'CoW Protocol', type: 'aggregator' },
  '0x111111125421ca6dc452d289314280a0f8842a65': { name: '1inch v6', type: 'aggregator' },
  '0x1111111254eeb25477b68fb85ed929f73a960582': { name: '1inch v5', type: 'aggregator' },
  '0x11111112542d85b3ef69ae05771c2dccff4faa26': { name: '1inch v4', type: 'aggregator' },
  '0x6a000f20005980200259b80c5102003040001068': { name: 'Paraswap v6', type: 'aggregator' },
  '0xdef171fe48cf0115b1d80b88dc8eab59176fee57': { name: 'Paraswap v5', type: 'aggregator' },
  '0xdef1c0ded9bec7f1a1670819833240f027b25eff': { name: '0x Exchange', type: 'aggregator' },
  '0x00c600b30fb0400701010f4b080409018b9006e0': { name: 'OKX DEX', type: 'aggregator' },
  '0x365084b05fa7d5028346bd21d842ed0601bab5b8': { name: 'Odos v2', type: 'aggregator' },
  '0xcf5540fffcdc3d510b18bfca6d2b9987b0772559': { name: 'Odos v1', type: 'aggregator' },
  '0x80eba3855878739f4710233a8a19d89bdd2ffb8e': { name: 'Bebop', type: 'aggregator' },
  '0xcec212eeaa691850ef307782915d336120b01faf': { name: 'LI.FI', type: 'aggregator' },
  '0x1231deb6f5749ef6ce6943a275a1d3e7486f4eae': { name: 'LI.FI v2', type: 'aggregator' },
  '0x6131b5fae19ea4f9d964eac0408e4408b66337b5': { name: 'KyberSwap', type: 'aggregator' },
  '0x6352a56caadc4f1e25cd6c75970fa768a3304e64': { name: 'OpenOcean', type: 'aggregator' },
  '0x881d40237659c251811cec9c364ef91dc08d300c': { name: 'Metamask Swap', type: 'aggregator' },
  '0x74de5d4fcbf63e00296fd95d33236b9794016631': { name: 'Metamask Router', type: 'aggregator' },

  // ===== Uniswap Routers =====
  '0x3fc91a3afd70395cd496c647d5a6cc9d4b2b7fad': { name: 'Uniswap Universal', type: 'aggregator' },
  '0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45': { name: 'Uniswap SwapRouter02', type: 'aggregator' },
  '0xe592427a0aece92de3edee1f18e0157c05861564': { name: 'Uniswap SwapRouter', type: 'aggregator' },
  '0xef1c6e67703c7bd7107eed8303fbe6ec2554bf6b': { name: 'Uniswap Universal (old)', type: 'aggregator' },

  // ===== Other DEX Routers =====
  '0x7251febeabb01ec9de53ece7a96f1c951f886dd2': { name: 'Maverick V2', type: 'aggregator' },
  '0xd9e1ce17f2641f24ae83637ab66a2cca9c378b9f': { name: 'SushiSwap', type: 'aggregator' },
  '0x1b02da8cb0d097eb8d57a175b88c7d8b47997506': { name: 'SushiSwap v2', type: 'aggregator' },

  // ===== Clear Protocol =====
  '0x5cc8b3282dcc692532b857a68bc0fb07f45fbade': { name: 'ClearVault', type: 'protocol' },
  '0xeb5ad3d93e59efcbc6934cad2b48eb33baf29745': { name: 'ClearSwap', type: 'protocol' },
  '0x8bf266ed803e474ae7bf09adb5ba2566c489223d': { name: 'ClearFactory', type: 'protocol' },
  '0x049ad7ff0c6bdbab86baf4b1a5a5ca975e234fca': { name: 'ClearOracle', type: 'protocol' },
  '0xc37bb2d1694e97e4ef6519e76d423e3baf5f7f62': { name: 'Clear Treasury', type: 'protocol' },
  '0x2879df6a88b63893ee62ad3cb7f7231e776d6bd1': { name: 'IOU Collector', type: 'protocol' },
  '0x139c15f07260b0f7fce30d64f9fc6f31c00e3814': { name: 'iouUSDC', type: 'protocol' },
  '0x50ca266a50c6531dce25ee7da0dfb57a06bd864e': { name: 'iouGHO', type: 'protocol' },

  // ===== DEX Pools/Vaults =====
  '0xba1333333333a1ba1108e8412f11850a5c319ba9': { name: 'Balancer V3', type: 'pool' },
  '0xba12222222228d8ba445958a75a0704d566bf2c8': { name: 'Balancer V2', type: 'pool' },
  '0x52aa899454998be5b000ad077a46bbe360f4e497': { name: 'Fluid Liquidity', type: 'pool' },
  '0x000000000004444c5dc75cb358380d2e3de08a90': { name: 'Uniswap V4', type: 'pool' },
  '0x635ef0056a597d13863b73825cca297236578595': { name: 'Curve GHO/USDe', type: 'pool' },
  '0x0f9bb6db3c03cc9f57d1d7b11ec63ae8ffb8cb60': { name: 'Fluid GHO/USDC', type: 'pool' },

  // ===== CoW Protocol Solvers =====
  '0xe8a1b722b78d18c20e4c2e5f0db7ad9ae6c8c7a6': { name: 'CoW: Barter', type: 'solver' },
  '0x008300082c3000009e63680088f8c7f4d3ff2e87': { name: 'CoW: Gnosis', type: 'solver' },
  '0x97c5da6c69f8ddde9e51bc7dc1e3b23d97b78e7d': { name: 'CoW: Seasolver', type: 'solver' },
  '0x3cee8c7d9b5c8f366dd7096df307cd326416a7bf': { name: 'CoW: Quasimodo', type: 'solver' },
  '0xc9ec550bea1c64d779124b23a26292cc223327b6': { name: 'CoW: 1inch', type: 'solver' },
  '0xa21740833858985e4d801533a808786d3647fb83': { name: 'CoW: Baseline', type: 'solver' },
  '0x4339889fd9dfca20a423fba65726d85d40d2c702': { name: 'CoW: Naive', type: 'solver' },
  '0xc74b656bd2ebe313d26d1ac02bcf95b137d1e857': { name: 'CoW: Paraswap', type: 'solver' },
  '0x857a3d2d4d1e4ed9b7d9c25f7ea2b2fecfd41d7e': { name: 'CoW: PropellerHeads', type: 'solver' },

  // ===== Known MEV Bots =====
  '0xae2fc483527b8ef99eb5d9b44875f005ba1fae13': { name: 'jaredfromsubway.eth', type: 'mev' },
  '0x56178a0d5f301baf6cf3e1cd53d9863437345bf9': { name: 'MEV Bot', type: 'mev' },
  '0x00000000003b3cc22af3ae1eac0440bcee416b40': { name: 'MEV: Flashbots', type: 'mev' },
  '0x98c3d3183c4b8a650614ad179a1a98be0a8d6b8e': { name: 'MEV: Sandwich', type: 'mev' },
  '0x6b75d8af000000e20b7a7ddf000ba900b4009a80': { name: 'MEV: Searcher', type: 'mev' },
  '0x000000000000000000000000000000000000dead': { name: 'Burn Address', type: 'mev' },
  '0x280027dd00ee0050d3f9d168efd6b40090009246': { name: 'MEV Bot', type: 'mev' },
  '0x3b17056cc4439c61cea41fe002a5f5cf7b6f5cce': { name: 'MEV: Arbitrage', type: 'mev' },
  '0xd050e0a4838d74769228b49dff97241b4ef3805d': { name: 'MEV: Flashloan', type: 'mev' },

  // ===== Protocols / Other =====
  '0x0000000000000000000000000000000000000000': { name: 'Null Address', type: 'protocol' },
  '0x83f20f44975d03b1b09e64809b757c47f942beea': { name: 'sDAI (Spark)', type: 'protocol' },
  '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0': { name: 'wstETH (Lido)', type: 'protocol' },
  '0xae78736cd615f374d3085123a210448e74fc6393': { name: 'rETH (Rocket Pool)', type: 'protocol' },
  '0xbe9895146f7af43049ca1c1ae358b0541ea49704': { name: 'cbETH (Coinbase)', type: 'protocol' },
  '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9': { name: 'AAVE', type: 'protocol' },
  '0x87870bca3f3fd6335c3f4ce8392d69350b4fa4e2': { name: 'Aave V3 Pool', type: 'protocol' },
}

export function getAddressLabel(address: string): AddressLabel | null {
  return ADDRESS_LABELS[address.toLowerCase()] || null
}

export function formatAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

// Check if address looks like a bot (simple heuristic based on known patterns)
export function looksLikeBot(address: string): boolean {
  const lower = address.toLowerCase()
  // Common MEV bot patterns: lots of zeros, repeating patterns
  if (lower.startsWith('0x00000000')) return true
  if (lower.includes('000000')) return true
  // Check for vanity addresses with repeating patterns
  const vanityPatterns = ['1111', '2222', '3333', '4444', '5555', '6666', '7777', '8888', '9999', 'aaaa', 'bbbb', 'cccc', 'dddd', 'eeee', 'ffff']
  for (const pattern of vanityPatterns) {
    if (lower.includes(pattern + pattern)) return true
  }
  return false
}
