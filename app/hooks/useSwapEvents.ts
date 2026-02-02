'use client'

import { useEffect, useState, useCallback } from 'react'
import { usePublicClient } from 'wagmi'
import { parseAbiItem, formatUnits } from 'viem'
import { CONTRACTS, getTokenInfo } from '@/app/lib/contracts'

export interface SwapEvent {
  from: string
  to: string
  receiver: string
  sender: string // The actual tx sender (user/aggregator)
  amountIn: bigint
  tokenAmountOut: bigint
  iouAmountOut: bigint
  blockNumber: bigint
  transactionHash: string
  timestamp: number
  fromSymbol: string
  toSymbol: string
  fromDecimals: number
  toDecimals: number
}

export interface VolumeData {
  totalVolume: number
  dailyVolume: number
  last7DaysVolume: number
  swapCount: number
}

export interface ChartDataPoint {
  date: string
  volume: number
  timestamp: number
}

const BLOCKS_PER_DAY = 7200n
const BLOCKS_PER_WEEK = 50400n

export function useSwapEvents(initialDays: number = 7) {
  const [events, setEvents] = useState<SwapEvent[]>([])
  const [volumeData, setVolumeData] = useState<VolumeData | null>(null)
  const [chartData, setChartData] = useState<ChartDataPoint[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [daysToLoad, setDaysToLoad] = useState(initialDays)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const publicClient = usePublicClient()

  const fetchEvents = useCallback(async () => {
    if (!publicClient) return

    try {
      setIsLoading(true)
      setError(null)

      const currentBlock = await publicClient.getBlockNumber()
      const blocksToFetch = BLOCKS_PER_DAY * BigInt(daysToLoad)
      const fromBlock = currentBlock - blocksToFetch
      const oneDayAgo = currentBlock - BLOCKS_PER_DAY

      console.log(`Fetching swap events from block ${fromBlock} to ${currentBlock}...`)

      const logs = await publicClient.getLogs({
        address: CONTRACTS.vault,
        event: parseAbiItem(
          'event LiquiditySwapExecuted(address indexed from, address indexed to, address receiver, uint256 amountIn, uint256 tokenAmountOut, uint256 iouAmountOut)'
        ),
        fromBlock,
        toBlock: currentBlock,
      })

      console.log(`Found ${logs.length} swap events`)

      // Fetch block timestamps in parallel (batch by 10)
      const blockNumbers = [...new Set(logs.map((l) => l.blockNumber))]
      const blockTimestamps: Record<string, number> = {}

      // Fetch blocks in batches
      for (let i = 0; i < blockNumbers.length; i += 10) {
        const batch = blockNumbers.slice(i, i + 10)
        const blocks = await Promise.all(
          batch.map((bn) => publicClient.getBlock({ blockNumber: bn }))
        )
        blocks.forEach((block) => {
          blockTimestamps[block.number.toString()] = Number(block.timestamp)
        })
      }

      // Fetch transaction details to get real sender (batch by 10)
      const txHashes = [...new Set(logs.map((l) => l.transactionHash))]
      const txSenders: Record<string, string> = {}

      for (let i = 0; i < txHashes.length; i += 10) {
        const batch = txHashes.slice(i, i + 10)
        const txs = await Promise.all(
          batch.map((hash) => publicClient.getTransaction({ hash }))
        )
        txs.forEach((tx) => {
          txSenders[tx.hash] = tx.from
        })
      }

      // Parse events
      const parsedEvents: SwapEvent[] = logs.map((log) => {
        const fromInfo = getTokenInfo(log.args.from!)
        const toInfo = getTokenInfo(log.args.to!)

        return {
          from: log.args.from!,
          to: log.args.to!,
          receiver: log.args.receiver!,
          sender: txSenders[log.transactionHash] || log.args.receiver!,
          amountIn: log.args.amountIn!,
          tokenAmountOut: log.args.tokenAmountOut!,
          iouAmountOut: log.args.iouAmountOut!,
          blockNumber: log.blockNumber,
          transactionHash: log.transactionHash,
          timestamp: blockTimestamps[log.blockNumber.toString()] || 0,
          fromSymbol: fromInfo.symbol,
          toSymbol: toInfo.symbol,
          fromDecimals: fromInfo.decimals,
          toDecimals: toInfo.decimals,
        }
      })

      // Sort by timestamp descending (newest first)
      parsedEvents.sort((a, b) => b.timestamp - a.timestamp)

      // Calculate volume metrics (assuming ~$1 per token for stablecoins)
      let totalVolume = 0
      let dailyVolume = 0
      let last7DaysVolume = 0

      const eventsByDay = new Map<string, number>()

      for (const event of parsedEvents) {
        const volumeUSD = Number(formatUnits(event.amountIn, event.fromDecimals))

        totalVolume += volumeUSD

        if (event.blockNumber >= currentBlock - BLOCKS_PER_WEEK) {
          last7DaysVolume += volumeUSD
        }

        if (event.blockNumber >= oneDayAgo) {
          dailyVolume += volumeUSD
        }

        // Group by day
        if (event.timestamp) {
          const date = new Date(event.timestamp * 1000)
          const dayKey = date.toISOString().split('T')[0]
          const currentDayVolume = eventsByDay.get(dayKey) || 0
          eventsByDay.set(dayKey, currentDayVolume + volumeUSD)
        }
      }

      // Convert chart data
      const chartDataPoints: ChartDataPoint[] = Array.from(eventsByDay.entries())
        .map(([date, volume]) => ({
          date,
          volume,
          timestamp: new Date(date).getTime(),
        }))
        .sort((a, b) => a.timestamp - b.timestamp)

      setEvents(parsedEvents)
      setVolumeData({
        totalVolume,
        dailyVolume,
        last7DaysVolume,
        swapCount: parsedEvents.length,
      })
      setChartData(chartDataPoints)
      setLastUpdated(new Date())
    } catch (err) {
      console.error('Failed to fetch swap events:', err)
      setError(err as Error)
    } finally {
      setIsLoading(false)
    }
  }, [publicClient, daysToLoad])

  useEffect(() => {
    fetchEvents()

    // Refresh every 60 seconds
    const interval = setInterval(fetchEvents, 60000)
    return () => clearInterval(interval)
  }, [fetchEvents])

  const loadMore = useCallback(() => {
    setDaysToLoad((prev) => prev + 7)
  }, [])

  return { events, volumeData, chartData, isLoading, error, loadMore, daysToLoad, lastUpdated }
}
