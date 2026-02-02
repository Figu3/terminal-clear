import { http, createConfig } from 'wagmi'
import { mainnet } from 'wagmi/chains'

// Use Alchemy RPC with the key from contracts.json
const ALCHEMY_KEY = 'ph0FUrSi6-8SvDzvJYtc1'

export const config = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(`https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
