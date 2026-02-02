'use client'

import { useState, useMemo, useCallback } from 'react'
import { useSwapEvents, SwapEvent } from '@/app/hooks/useSwapEvents'
import { StatsCards } from '@/app/components/StatsCards'
import { VolumeChart } from '@/app/components/VolumeChart'
import { SwapTable } from '@/app/components/SwapTable'
import { Filters, FilterState } from '@/app/components/Filters'
import { getAddressLabel } from '@/app/lib/addressLabels'
import { formatUnits } from 'viem'
import { calculateDepegBps } from '@/app/lib/formatters'

export default function Home() {
  const { events, volumeData, chartData, isLoading, error, loadMore, daysToLoad, lastUpdated } = useSwapEvents()

  const [filters, setFilters] = useState<FilterState>({
    tokenPair: 'all',
    senderType: 'all',
  })

  // Get unique token pairs from events
  const tokenPairs = useMemo(() => {
    const pairs = new Set<string>()
    events.forEach((event) => {
      pairs.add(`${event.fromSymbol}→${event.toSymbol}`)
    })
    return Array.from(pairs).sort()
  }, [events])

  // Filter events based on current filters
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      // Token pair filter
      if (filters.tokenPair !== 'all') {
        const eventPair = `${event.fromSymbol}→${event.toSymbol}`
        if (eventPair !== filters.tokenPair) return false
      }

      // Sender type filter
      if (filters.senderType !== 'all') {
        const label = getAddressLabel(event.sender)
        const senderType = label?.type || 'user'
        if (senderType !== filters.senderType) return false
      }

      return true
    })
  }, [events, filters])

  // CSV Export
  const exportCSV = useCallback(() => {
    const headers = [
      'Transaction Hash',
      'Timestamp',
      'From Token',
      'To Token',
      'Amount In',
      'Amount Out',
      'IOUs',
      'Sender',
      'USD Value',
      'Depeg (bps)',
    ]

    const rows = filteredEvents.map((event) => {
      const usdValue = Number(formatUnits(event.amountIn, event.fromDecimals))
      const depegBps = calculateDepegBps(
        event.amountIn,
        event.tokenAmountOut,
        event.fromDecimals,
        event.toDecimals
      )
      const label = getAddressLabel(event.sender)

      return [
        event.transactionHash,
        new Date(event.timestamp * 1000).toISOString(),
        event.fromSymbol,
        event.toSymbol,
        formatUnits(event.amountIn, event.fromDecimals),
        formatUnits(event.tokenAmountOut, event.toDecimals),
        formatUnits(event.iouAmountOut, event.toDecimals),
        label ? `${label.name} (${event.sender})` : event.sender,
        usdValue.toFixed(2),
        depegBps.toString(),
      ]
    })

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `clear-swaps-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }, [filteredEvents])

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold">
              <span className="text-gray-400">terminal</span>
              <span className="text-white">.clear</span>
            </h1>
            <span className="text-xs bg-blue-900/50 text-blue-400 px-2 py-0.5 rounded">
              Ethereum
            </span>
          </div>
          <div className="flex items-center gap-4">
            {/* Real-time indicator */}
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-gray-500 text-sm hidden sm:inline">
                {lastUpdated ? `Updated ${formatTimeAgo(lastUpdated)}` : 'Live'}
              </span>
            </div>
            <span className="text-gray-600">|</span>
            <span className="text-gray-500 text-sm">
              Last {daysToLoad} days
            </span>
            <a
              href="https://clear.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white text-sm transition-colors hidden sm:inline"
            >
              clear.xyz →
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Error Banner */}
        {error && (
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 text-red-400">
            <strong>Error:</strong> {error.message}
          </div>
        )}

        {/* Stats Cards */}
        <StatsCards data={volumeData} isLoading={isLoading} />

        {/* Volume Chart */}
        <VolumeChart data={chartData} isLoading={isLoading} />

        {/* Filters */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <Filters
            filters={filters}
            onFilterChange={setFilters}
            tokenPairs={tokenPairs}
          />
        </div>

        {/* Swap Table */}
        <SwapTable
          events={filteredEvents}
          isLoading={isLoading}
          onLoadMore={loadMore}
          daysLoaded={daysToLoad}
          onExportCSV={exportCSV}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <div>
            Data sourced from{' '}
            <a
              href="https://etherscan.io/address/0x5cc8b3282dcc692532b857a68bc0fb07f45fbade"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white"
            >
              ClearVault
            </a>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/Figu3/terminal-clear"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              GitHub
            </a>
            <a
              href="https://twitter.com/clearcrypto"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              Twitter
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  return `${Math.floor(minutes / 60)}h ago`
}
