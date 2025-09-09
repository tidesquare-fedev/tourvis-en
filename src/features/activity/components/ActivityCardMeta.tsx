'use client'

import { memo } from 'react'
import { Star } from 'lucide-react'

type Props = {
  title: string
  category?: string | null
  location?: string | null
  rating?: number | null
  reviewCount?: number | null
}

export const ActivityCardMeta = memo(function ActivityCardMeta({ title, category, location, rating, reviewCount }: Props) {
  return (
    <div>
      <div className="text-sm text-gray-500 mb-1">
        <span className="truncate">{category || 'Category'}{location ? ` · ${location}` : ''}</span>
      </div>
      <h3 className="font-semibold text-sm sm:text-base mb-2 line-clamp-2 leading-tight">{title}</h3>
      {typeof rating === 'number' && rating > 0 && typeof reviewCount === 'number' && reviewCount > 0 && (
        <div className="flex items-center text-xs sm:text-sm text-black mb-3">
          <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-1 fill-[#ff00cc] text-[#ff00cc]" />
          {rating.toFixed(1)} ({reviewCount})
        </div>
      )}
    </div>
  )
})


