export type AddressType = 'aggregator' | 'mev' | 'protocol' | 'user'

export interface AddressLabel {
  name: string
  type: AddressType
}

// Known addresses from Clear Protocol registry and common aggregators
export const ADDRESS_LABELS: Record<string, AddressLabel> = {
  // DEX Aggregators
  '0x9008d19f58aabd9ed0d60971565aa8510560ab41': { name: 'CoW Protocol', type: 'aggregator' },
  '0x111111125421ca6dc452d289314280a0f8842a65': { name: '1inch v6', type: 'aggregator' },
  '0x1111111254eeb25477b68fb85ed929f73a960582': { name: '1inch v5', type: 'aggregator' },
  '0x6a000f20005980200259b80c5102003040001068': { name: 'Paraswap v6', type: 'aggregator' },
  '0xdef1c0ded9bec7f1a1670819833240f027b25eff': { name: '0x Exchange', type: 'aggregator' },
  '0x00c600b30fb0400701010f4b080409018b9006e0': { name: 'OKX DEX', type: 'aggregator' },
  '0x365084b05fa7d5028346bd21d842ed0601bab5b8': { name: 'Odos', type: 'aggregator' },
  '0x80eba3855878739f4710233a8a19d89bdd2ffb8e': { name: 'Bebop', type: 'aggregator' },
  '0xcec212eeaa691850ef307782915d336120b01faf': { name: 'LI.FI Diamond', type: 'aggregator' },
  '0x6131b5fae19ea4f9d964eac0408e4408b66337b5': { name: 'KyberSwap', type: 'aggregator' },
  '0x3fc91a3afd70395cd496c647d5a6cc9d4b2b7fad': { name: 'Uniswap Universal', type: 'aggregator' },
  '0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45': { name: 'Uniswap SwapRouter02', type: 'aggregator' },
  '0x7251febeabb01ec9de53ece7a96f1c951f886dd2': { name: 'Maverick V2', type: 'aggregator' },

  // Clear Protocol addresses
  '0x2879df6a88b63893ee62ad3cb7f7231e776d6bd1': { name: 'IOU Collector', type: 'protocol' },
  '0x5cc8b3282dcc692532b857a68bc0fb07f45fbade': { name: 'ClearVault', type: 'protocol' },
  '0xeb5ad3d93e59efcbc6934cad2b48eb33baf29745': { name: 'ClearSwap', type: 'protocol' },
  '0xc37bb2d1694e97e4ef6519e76d423e3baf5f7f62': { name: 'Treasury', type: 'protocol' },

  // DEX Pools/Vaults
  '0xba1333333333a1ba1108e8412f11850a5c319ba9': { name: 'Balancer V3', type: 'aggregator' },
  '0xba12222222228d8ba445958a75a0704d566bf2c8': { name: 'Balancer V2', type: 'aggregator' },
  '0x52aa899454998be5b000ad077a46bbe360f4e497': { name: 'Fluid Liquidity', type: 'aggregator' },
  '0x000000000004444c5dc75cb358380d2e3de08a90': { name: 'Uniswap V4', type: 'aggregator' },

  // Known MEV bots (common patterns/prefixes)
  '0x000000000000000000000000000000000000dead': { name: 'Burn Address', type: 'mev' },
  '0xae2fc483527b8ef99eb5d9b44875f005ba1fae13': { name: 'jaredfromsubway.eth', type: 'mev' },
  '0x56178a0d5f301baf6cf3e1cd53d9863437345bf9': { name: 'MEV Bot', type: 'mev' },
  '0x00000000003b3cc22af3ae1eac0440bcee416b40': { name: 'MEV Bot', type: 'mev' },
}

export function getAddressLabel(address: string): AddressLabel | null {
  return ADDRESS_LABELS[address.toLowerCase()] || null
}

export function formatAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}
