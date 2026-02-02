'use client'

import { SwapEvent } from '@/app/hooks/useSwapEvents'
import { AddressLabel } from './AddressLabel'
import { formatTokenAmount, formatTimestamp, calculateDepegBps } from '@/app/lib/formatters'
import { getAddressLabel } from '@/app/lib/addressLabels'
import { formatUnits } from 'viem'

// Get the best address to display for identifying the swap source
// Priority: txTo (aggregator contract) > receiver > txFrom
function getBestAddressForLabel(event: SwapEvent): string {
  // First check if txTo is a known aggregator
  if (event.txTo) {
    const txToLabel = getAddressLabel(event.txTo)
    if (txToLabel && txToLabel.type === 'aggregator') {
      return event.txTo
    }
  }

  // Then check receiver
  if (event.receiver) {
    const receiverLabel = getAddressLabel(event.receiver)
    if (receiverLabel && (receiverLabel.type === 'aggregator' || receiverLabel.type === 'solver' || receiverLabel.type === 'pool')) {
      return event.receiver
    }
  }

  // Fall back to txTo if it's any known address
  if (event.txTo) {
    const txToLabel = getAddressLabel(event.txTo)
    if (txToLabel) {
      return event.txTo
    }
  }

  // Fall back to receiver if it's any known address
  if (event.receiver) {
    const receiverLabel = getAddressLabel(event.receiver)
    if (receiverLabel) {
      return event.receiver
    }
  }

  // Finally, show the txTo (the contract called) or receiver
  return event.txTo || event.receiver || event.txFrom
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

                  {/* Source & Depeg */}
                  <div className="flex items-center justify-between">
                    <AddressLabel address={getBestAddressForLabel(event)} />
                    {depegBps > 0 ? (
                      <span className="text-red-400 font-mono text-sm">{depegBps} bps</span>
                    ) : (
                      <span className="text-gray-600 font-mono text-sm">0 bps</span>
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
              <th className="px-4 py-3 font-medium text-right">USD Value</th>
              <th className="px-4 py-3 font-medium text-right">Depeg (bps)</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && events.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                  <div className="animate-pulse">Loading swap events...</div>
                </td>
              </tr>
            ) : events.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
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
                      <AddressLabel address={getBestAddressForLabel(event)} />
                    </td>
                    <td className="px-4 py-3 text-right text-green-400 font-mono">
                      ${usdValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </td>
                    <td className="px-4 py-3 text-right font-mono">
                      {depegBps > 0 ? (
                        <span className="text-red-400">{depegBps}</span>
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
