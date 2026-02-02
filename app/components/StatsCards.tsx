'use client'

import { VolumeData } from '@/app/hooks/useSwapEvents'
import { formatUSD } from '@/app/lib/formatters'

interface StatsCardsProps {
  data: VolumeData | null
  isLoading: boolean
}

export function StatsCards({ data, isLoading }: StatsCardsProps) {
  const stats = [
    { label: 'Total Volume', value: data ? formatUSD(data.totalVolume) : '-' },
    { label: '24h Volume', value: data ? formatUSD(data.dailyVolume) : '-' },
    { label: '7d Volume', value: data ? formatUSD(data.last7DaysVolume) : '-' },
    { label: 'Total Swaps', value: data ? data.swapCount.toLocaleString() : '-' },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-gray-900 border border-gray-800 rounded-lg p-4"
        >
          <div className="text-gray-400 text-sm mb-1">{stat.label}</div>
          <div className={`text-2xl font-bold ${isLoading ? 'animate-pulse text-gray-600' : 'text-white'}`}>
            {stat.value}
          </div>
        </div>
      ))}
    </div>
  )
}
