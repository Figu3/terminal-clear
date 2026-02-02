'use client'

import { SwapEvent } from '@/app/hooks/useSwapEvents'
import { AddressLabel } from './AddressLabel'
import { formatTokenAmount, formatTimestamp, calculateDepegPercent } from '@/app/lib/formatters'
import { formatUnits } from 'viem'

interface SwapTableProps {
  events: SwapEvent[]
  isLoading: boolean
  onLoadMore: () => void
  daysLoaded: number
}

export function SwapTable({ events, isLoading, onLoadMore, daysLoaded }: SwapTableProps) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-800">
        <h3 className="text-white font-semibold">Swap History</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-400 text-left border-b border-gray-800">
              <th className="px-4 py-3 font-medium">Tx</th>
              <th className="px-4 py-3 font-medium">Time</th>
              <th className="px-4 py-3 font-medium">Route</th>
              <th className="px-4 py-3 font-medium text-right">Amount In</th>
              <th className="px-4 py-3 font-medium text-right">Amount Out</th>
              <th className="px-4 py-3 font-medium text-right">IOUs</th>
              <th className="px-4 py-3 font-medium">Receiver</th>
              <th className="px-4 py-3 font-medium text-right">USD Value</th>
              <th className="px-4 py-3 font-medium text-right">Depeg %</th>
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
                const depegPercent = calculateDepegPercent(
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
                      <AddressLabel address={event.receiver} />
                    </td>
                    <td className="px-4 py-3 text-right text-green-400 font-mono">
                      ${usdValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </td>
                    <td className="px-4 py-3 text-right font-mono">
                      {depegPercent > 0 ? (
                        <span className="text-red-400">{depegPercent.toFixed(2)}%</span>
                      ) : (
                        <span className="text-gray-600">0%</span>
                      )}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="px-4 py-3 border-t border-gray-800 flex items-center justify-between">
        <span className="text-gray-500 text-sm">
          Showing {events.length} swaps from last {daysLoaded} days
        </span>
        <button
          onClick={onLoadMore}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white text-sm rounded transition-colors"
        >
          {isLoading ? 'Loading...' : 'Load More'}
        </button>
      </div>
    </div>
  )
}
