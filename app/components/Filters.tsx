'use client'

import { useState } from 'react'
import { AddressType } from '@/app/lib/addressLabels'

export interface FilterState {
  tokenPair: string
  senderType: AddressType | 'all'
}

interface FiltersProps {
  filters: FilterState
  onFilterChange: (filters: FilterState) => void
  tokenPairs: string[]
}

const SENDER_TYPES: { value: AddressType | 'all'; label: string }[] = [
  { value: 'all', label: 'All Senders' },
  { value: 'aggregator', label: 'Aggregators' },
  { value: 'solver', label: 'Solvers' },
  { value: 'mev', label: 'MEV Bots' },
  { value: 'protocol', label: 'Protocols' },
  { value: 'user', label: 'Users' },
]

export function Filters({ filters, onFilterChange, tokenPairs }: FiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Token Pair Filter */}
      <div className="flex items-center gap-2">
        <label className="text-gray-500 text-sm">Route:</label>
        <select
          value={filters.tokenPair}
          onChange={(e) => onFilterChange({ ...filters, tokenPair: e.target.value })}
          className="bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500"
        >
          <option value="all">All Pairs</option>
          {tokenPairs.map((pair) => (
            <option key={pair} value={pair}>
              {pair}
            </option>
          ))}
        </select>
      </div>

      {/* Sender Type Filter */}
      <div className="flex items-center gap-2">
        <label className="text-gray-500 text-sm">Sender:</label>
        <select
          value={filters.senderType}
          onChange={(e) =>
            onFilterChange({ ...filters, senderType: e.target.value as AddressType | 'all' })
          }
          className="bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500"
        >
          {SENDER_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {/* Clear Filters */}
      {(filters.tokenPair !== 'all' || filters.senderType !== 'all') && (
        <button
          onClick={() => onFilterChange({ tokenPair: 'all', senderType: 'all' })}
          className="text-gray-400 hover:text-white text-sm underline"
        >
          Clear filters
        </button>
      )}
    </div>
  )
}
