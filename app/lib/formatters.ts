import { formatUnits } from 'viem'

export function formatUSD(value: number): string {
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2)}M`
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(2)}K`
  }
  return `$${value.toFixed(2)}`
}

export function formatTokenAmount(amount: bigint, decimals: number): string {
  const value = Number(formatUnits(amount, decimals))
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(2)}M`
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(2)}K`
  }
  return value.toFixed(2)
}

export function formatTimestamp(timestamp: number): string {
  const now = Date.now() / 1000
  const diff = now - timestamp

  if (diff < 60) return `${Math.floor(diff)}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`

  return new Date(timestamp * 1000).toLocaleDateString()
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

export function calculateDepegBps(amountIn: bigint, amountOut: bigint, fromDecimals: number, toDecimals: number): number {
  // Normalize to same decimals
  const normalizedIn = Number(formatUnits(amountIn, fromDecimals))
  const normalizedOut = Number(formatUnits(amountOut, toDecimals))

  if (normalizedIn === 0) return 0

  // Depeg in bps = (1 - out/in) * 10000
  const ratio = normalizedOut / normalizedIn
  return Math.round((1 - ratio) * 10000)
}
