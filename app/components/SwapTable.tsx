'use client'

import { SwapEvent } from '@/app/hooks/useSwapEvents'
import { AddressLabel } from './AddressLabel'
import { formatTokenAmount, formatTimestamp, calculateDepegBps } from '@/app/lib/formatters'
import { getAddressLabel, formatAddress, looksLikeBot } from '@/app/lib/addressLabels'
import { formatUnits } from 'viem'

// Identify the source/aggregator that routed the swap
// Priority: txTo (aggregator contract) > receiver (if aggregator/solver) > unknown
function getSourceInfo(event: SwapEvent): { address: string; isBot: boolean } {
  // Check txTo first - this is the contract the user/bot called
  if (event.txTo) {
    const txToLabel = getAddressLabel(event.txTo)
    if (txToLabel) {
      return {
        address: event.txTo,
        isBot: txToLabel.type === 'mev' || looksLikeBot(event.txFrom)
      }
    }
  }

  // Check receiver for aggregator/solver
  if (event.receiver) {
    const receiverLabel = getAddressLabel(event.receiver)
    if (receiverLabel && (receiverLabel.type === 'aggregator' || receiverLabel.type === 'solver')) {
      return {
        address: event.receiver,
        isBot: looksLikeBot(event.txFrom)
      }
    }
  }

  // Fall back to txTo even if unknown
  return {
    address: event.txTo || event.receiver || '',
    isBot: looksLikeBot(event.txFrom)
  }
}

// Small component for the Bot tag
function BotTag() {
  return (
    <span className="ml-1 px-1.5 py-0.5 text-[10px] font-medium bg-orange-900/50 text-orange-400 rounded">
      BOT
    </span>
  )
}

// Component to display source with optional bot tag
function SourceDisplay({ event }: { event: SwapEvent }) {
  const { address, isBot } = getSourceInfo(event)
  const label = getAddressLabel(address)

  if (!address) {
    return <span className="text-gray-500">-</span>
  }

  if (label) {
    const typeStyles: Record<string, string> = {
      aggregator: 'bg-blue-900/50 text-blue-400',
      solver: 'bg-cyan-900/50 text-cyan-400',
      mev: 'bg-red-900/50 text-red-400',
      protocol: 'bg-purple-900/50 text-purple-400',
      pool: 'bg-green-900/50 text-green-400',
      user: 'bg-gray-800 text-gray-400',
    }

    return (
      <div className="flex items-center gap-1">
        <span className={`px-2 py-0.5 rounded text-xs font-medium ${typeStyles[label.type] || typeStyles.user}`}>
          {label.name}
        </span>
        {isBot && label.type !== 'mev' && <BotTag />}
      </div>
    )
  }

  // Unknown source
  return (
    <div className="flex items-center gap-1">
      <a
        href={`https://etherscan.io/address/${address}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-400 hover:text-gray-200 font-mono text-xs"
      >
        {formatAddress(address)}
      </a>
      {isBot && <BotTag />}
    </div>
  )
}

// Component to display receiver address
function ReceiverDisplay({ address }: { address: string }) {
  if (!address) {
    return <span className="text-gray-500">-</span>
  }

  const label = getAddressLabel(address)

  if (label) {
    // For known addresses, show a subtle badge
    return (
      <a
        href={`https://etherscan.io/address/${address}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-400 hover:text-gray-200 font-mono text-xs"
        title={label.name}
      >
        {formatAddress(address)}
      </a>
    )
  }

  return (
    <a
      href={`https://etherscan.io/address/${address}`}
      target="_blank"
      rel="noopener noreferrer"
      className="text-gray-400 hover:text-gray-200 font-mono text-xs"
    >
      {formatAddress(address)}
    </a>
  )
}

interface SwapTableProps {
  events: SwapEvent[]
  isLoading: boolean
  onLoadMore: () => void
  daysLoaded: number
  onExportCSV: () => void
}

export function SwapTable({ events, isLoading, onLoadMore, daysLoaded, onExportCSV }: SwapTableProps) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h3 className="text-white font-semibold">Swap History</h3>
        <button
          onClick={onExportCSV}
          disabled={events.length === 0}
          className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-300 text-sm rounded transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export CSV
        </button>
      </div>

      {/* Mobile Card View */}
      <div className="block lg:hidden">
        {isLoading && events.length === 0 ? (
          <div className="px-4 py-8 text-center text-gray-500">
            <div className="animate-pulse">Loading swap events...</div>
          </div>
        ) : events.length === 0 ? (
          <div className="px-4 py-8 text-center text-gray-500">No swaps found</div>
        ) : (
          <div className="divide-y divide-gray-800">
            {events.map((event) => {
              const usdValue = Number(formatUnits(event.amountIn, event.fromDecimals))
              const depegBps = calculateDepegBps(
                event.amountIn,
                event.tokenAmountOut,
                event.fromDecimals,
                event.toDecimals
              )

              return (
                <div key={event.transactionHash} className="p-4 space-y-3">
                  {/* Header row */}
                  <div className="flex items-center justify-between">
                    <a
                      href={`https://etherscan.io/tx/${event.transactionHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 font-mono text-sm"
                    >
                      {event.transactionHash.slice(0, 10)}...
                    </a>
                    <span className="text-gray-500 text-sm">{formatTimestamp(event.timestamp)}</span>
                  </div>

                  {/* Route */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-white font-medium">{event.fromSymbol}</span>
                      <span className="text-gray-500 mx-2">→</span>
                      <span className="text-white font-medium">{event.toSymbol}</span>
                    </div>
                    <span className="text-green-400 font-mono">
                      ${usdValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </span>
                  </div>

                  {/* Amounts */}
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <div className="text-gray-500">In</div>
                      <div className="text-white font-mono">
                        {formatTokenAmount(event.amountIn, event.fromDecimals)}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-500">Out</div>
                      <div className="text-white font-mono">
                        {formatTokenAmount(event.tokenAmountOut, event.toDecimals)}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-500">IOUs</div>
                      <div className="font-mono">
                        {event.iouAmountOut > 0n ? (
                          <span className="text-yellow-400">
                            {formatTokenAmount(event.iouAmountOut, event.toDecimals)}
                          </span>
                        ) : (
                          <span className="text-gray-600">-</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Source & Receiver */}
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <div className="text-gray-500">Source</div>
                      <SourceDisplay event={event} />
                    </div>
                    <div>
                      <div className="text-gray-500">Receiver</div>
                      <ReceiverDisplay address={event.receiver} />
                    </div>
                  </div>

                  {/* Depeg */}
                  <div className="flex items-center justify-end">
                    {depegBps > 0 ? (
                      <span className="text-red-400 font-mono text-sm">{depegBps} bps depeg</span>
                    ) : (
                      <span className="text-gray-600 font-mono text-sm">0 bps depeg</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-400 text-left border-b border-gray-800">
              <th className="px-4 py-3 font-medium">Tx</th>
              <th className="px-4 py-3 font-medium">Time</th>
              <th className="px-4 py-3 font-medium">Route</th>
              <th className="px-4 py-3 font-medium text-right">Amount In</th>
              <th className="px-4 py-3 font-medium text-right">Amount Out</th>
              <th className="px-4 py-3 font-medium text-right">IOUs</th>
              <th className="px-4 py-3 font-medium">Source</th>
              <th className="px-4 py-3 font-medium">Receiver</th>
              <th className="px-4 py-3 font-medium text-right">USD Value</th>
              <th className="px-4 py-3 font-medium text-right">Depeg</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && events.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-4 py-8 text-center text-gray-500">
                  <div className="animate-pulse">Loading swap events...</div>
                </td>
              </tr>
            ) : events.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-4 py-8 text-center text-gray-500">
                  No swaps found
                </td>
              </tr>
            ) : (
              events.map((event) => {
                const usdValue = Number(formatUnits(event.amountIn, event.fromDecimals))
                const depegBps = calculateDepegBps(
                  event.amountIn,
                  event.tokenAmountOut,
                  event.fromDecimals,
                  event.toDecimals
                )

                return (
                  <tr
                    key={event.transactionHash}
                    className="border-b border-gray-800/50 hover:bg-gray-800/30"
                  >
                    <td className="px-4 py-3">
                      <a
                        href={`https://etherscan.io/tx/${event.transactionHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 font-mono text-xs"
                      >
                        {event.transactionHash.slice(0, 8)}...
                      </a>
                    </td>
                    <td className="px-4 py-3 text-gray-400 whitespace-nowrap">
                      {formatTimestamp(event.timestamp)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-white font-medium">{event.fromSymbol}</span>
                      <span className="text-gray-500 mx-1">→</span>
                      <span className="text-white font-medium">{event.toSymbol}</span>
                    </td>
                    <td className="px-4 py-3 text-right text-white font-mono">
                      {formatTokenAmount(event.amountIn, event.fromDecimals)}
                    </td>
                    <td className="px-4 py-3 text-right text-white font-mono">
                      {formatTokenAmount(event.tokenAmountOut, event.toDecimals)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono">
                      {event.iouAmountOut > 0n ? (
                        <span className="text-yellow-400">
                          {formatTokenAmount(event.iouAmountOut, event.toDecimals)}
                        </span>
                      ) : (
                        <span className="text-gray-600">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <SourceDisplay event={event} />
                    </td>
                    <td className="px-4 py-3">
                      <ReceiverDisplay address={event.receiver} />
                    </td>
                    <td className="px-4 py-3 text-right text-green-400 font-mono">
                      ${usdValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </td>
                    <td className="px-4 py-3 text-right font-mono">
                      {depegBps > 0 ? (
                        <span className="text-red-400">{depegBps} bps</span>
                      ) : (
                        <span className="text-gray-600">0</span>
                      )}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="px-4 py-3 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span className="text-gray-500 text-sm">
          Showing {events.length} swaps from last {daysLoaded} days
        </span>
        <button
          onClick={onLoadMore}
          disabled={isLoading}
          className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white text-sm rounded transition-colors"
        >
          {isLoading ? 'Loading...' : 'Load More'}
        </button>
      </div>
    </div>
  )
}
