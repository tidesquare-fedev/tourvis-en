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
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm font-bold text-red-500">{discountRate}%</span>
          {typeof originalPrice === 'number' && (
            <span className="text-xs sm:text-sm text-gray-500 line-through">{formatCurrency(originalPrice)}</span>
          )}
        </div>
      )}
      {typeof price === 'number' && (
        <div className="text-[18px] font-bold text-black">{formatCurrency(price)}</div>
      )}
    </div>
  )}
)


