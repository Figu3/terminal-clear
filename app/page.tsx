'use client'

import { useSwapEvents } from '@/app/hooks/useSwapEvents'
import { StatsCards } from '@/app/components/StatsCards'
import { VolumeChart } from '@/app/components/VolumeChart'
import { SwapTable } from '@/app/components/SwapTable'

export default function Home() {
  const { events, volumeData, chartData, isLoading, error, loadMore, daysToLoad } = useSwapEvents()

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
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
            <span className="text-gray-500 text-sm">
              Last {daysToLoad} days
            </span>
            <a
              href="https://clear.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white text-sm transition-colors"
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

        {/* Swap Table */}
        <SwapTable
          events={events}
          isLoading={isLoading}
          onLoadMore={loadMore}
          daysLoaded={daysToLoad}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between text-sm text-gray-500">
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
              href="https://github.com/trevee"
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
