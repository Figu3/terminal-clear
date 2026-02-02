'use client'

import { getAddressLabel, formatAddress, looksLikeBot, AddressType } from '@/app/lib/addressLabels'

interface AddressLabelProps {
  address: string
  showFull?: boolean
}

const TYPE_STYLES: Record<AddressType, { bg: string; text: string }> = {
  aggregator: { bg: 'bg-blue-900/50', text: 'text-blue-400' },
  solver: { bg: 'bg-cyan-900/50', text: 'text-cyan-400' },
  pool: { bg: 'bg-green-900/50', text: 'text-green-400' },
  mev: { bg: 'bg-red-900/50', text: 'text-red-400' },
  protocol: { bg: 'bg-purple-900/50', text: 'text-purple-400' },
  user: { bg: 'bg-gray-800', text: 'text-gray-400' },
}

export function AddressLabel({ address, showFull = false }: AddressLabelProps) {
  const label = getAddressLabel(address)
  const displayAddress = showFull ? address : formatAddress(address)

  if (label) {
    const styles = TYPE_STYLES[label.type]
    return (
      <div className="flex items-center gap-2">
        <span className={`px-2 py-0.5 rounded text-xs font-medium ${styles.bg} ${styles.text}`}>
          {label.name}
        </span>
        <a
          href={`https://etherscan.io/address/${address}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 hover:text-gray-300 font-mono text-xs"
        >
          {formatAddress(address)}
        </a>
      </div>
    )
  }

  // Check if it looks like a bot address (heuristic)
  if (looksLikeBot(address)) {
    return (
      <div className="flex items-center gap-2">
        <span className="px-2 py-0.5 rounded text-xs font-medium bg-orange-900/50 text-orange-400">
          Bot?
        </span>
        <a
          href={`https://etherscan.io/address/${address}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 hover:text-gray-300 font-mono text-xs"
        >
          {formatAddress(address)}
        </a>
      </div>
    )
  }

  return (
    <a
      href={`https://etherscan.io/address/${address}`}
      target="_blank"
      rel="noopener noreferrer"
      className="text-gray-400 hover:text-gray-200 font-mono text-sm"
    >
      {displayAddress}
    </a>
  )
}
