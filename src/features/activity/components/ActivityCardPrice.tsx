'use client'

import { memo } from 'react'
import { formatCurrency } from '@/lib/format'

type Props = {
  price?: number | null
  originalPrice?: number | null
  discountRate?: number | null
}

export const ActivityCardPrice = memo(function ActivityCardPrice({ price, originalPrice, discountRate }: Props) {
  return (
    <div className="space-y-1">
      {typeof discountRate === 'number' && discountRate > 0 && (
        <span className="text-xs sm:text-sm font-bold text-red-500">{discountRate}% OFF</span>
      )}
      {typeof discountRate === 'number' && discountRate > 0 && typeof originalPrice === 'number' && (
        <div className="text-xs sm:text-sm text-gray-500 line-through">{formatCurrency(originalPrice)}</div>
      )}
      <div className="flex items-center gap-2">
        {typeof price === 'number' && (
          <div className="text-lg sm:text-xl font-bold text-blue-600">{formatCurrency(price)}</div>
        )}
      </div>
    </div>
  )}
)


