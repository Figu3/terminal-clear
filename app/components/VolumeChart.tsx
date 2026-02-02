'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { ChartDataPoint } from '@/app/hooks/useSwapEvents'
import { formatUSD, formatDate } from '@/app/lib/formatters'

interface VolumeChartProps {
  data: ChartDataPoint[]
  isLoading: boolean
}

export function VolumeChart({ data, isLoading }: VolumeChartProps) {
  if (isLoading && data.length === 0) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
        <h3 className="text-gray-400 text-sm mb-4">Daily Volume</h3>
        <div className="h-48 flex items-center justify-center text-gray-600 animate-pulse">
          Loading chart data...
        </div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
        <h3 className="text-gray-400 text-sm mb-4">Daily Volume</h3>
        <div className="h-48 flex items-center justify-center text-gray-500">
          No swap data available
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
      <h3 className="text-gray-400 text-sm mb-4">Daily Volume</h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis
              dataKey="timestamp"
              tickFormatter={(ts) => formatDate(ts / 1000)}
              stroke="#6b7280"
              fontSize={12}
            />
            <YAxis
              tickFormatter={(v) => formatUSD(v)}
              stroke="#6b7280"
              fontSize={12}
              width={50}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null
                const data = payload[0].payload as ChartDataPoint
                return (
                  <div className="bg-gray-800 border border-gray-700 rounded px-3 py-2">
                    <div className="text-gray-400 text-xs">{data.date}</div>
                    <div className="text-white font-semibold">{formatUSD(data.volume)}</div>
                  </div>
                )
              }}
            />
            <Bar dataKey="volume" radius={[4, 4, 0, 0]}>
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill="#3b82f6" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
