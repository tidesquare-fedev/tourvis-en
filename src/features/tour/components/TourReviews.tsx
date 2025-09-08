"use client"

import { ThumbsUp, Star, Check, X, ChevronDown, ChevronUp } from 'lucide-react'
import { maskName } from '@/lib/mask'
import { memo, useMemo, useState } from 'react'
import type { ReviewItem } from '@/types/review'

type TourReviewsProps = {
  rating: number
  reviews: ReviewItem[]
  statsReviews?: ReviewItem[]
  showAll: boolean
  onShowAll: () => void
  onShowLess?: () => void
  starColor?: string
  totalCount?: number
}

export const TourReviews = memo(function TourReviews({ rating, reviews, statsReviews, showAll, onShowAll, onShowLess, starColor = '#ff00cc', totalCount }: TourReviewsProps) {
  const [expanded, setExpanded] = useState<Record<number, boolean>>({})
  const renderStars = (value: number) => {
    const safe = Math.max(0, Math.min(5, Math.floor(Number(value) || 0)))
    return (
      <div className="flex items-center">
        {Array.from({ length: 5 }, (_, i) => (
          <Star key={i} className={`w-4 h-4 ${i < safe ? 'fill-current' : ''}`} style={i < safe ? { color: starColor } : { color: '#d1d5db' }} />
        ))}
      </div>
    )
  }

  // Calculate star distribution (use full stats if provided)
  const { starDistribution, displayedTotalCount } = useMemo(() => {
    const src = (Array.isArray(statsReviews) && statsReviews.length > 0) ? statsReviews : reviews
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    src.forEach(review => {
      const stars = Math.floor(Number(review.rating) || 0)
      if (stars >= 1 && stars <= 5) {
        counts[stars as keyof typeof counts]++
      }
    })
    const totalStats = src.length
    const dist = [5, 4, 3, 2, 1].map(stars => ({
      stars,
      count: counts[stars as keyof typeof counts],
      percentage: totalStats > 0 ? (counts[stars as keyof typeof counts] / totalStats) * 100 : 0
    }))
    return { starDistribution: dist, displayedTotalCount: typeof totalCount === 'number' ? totalCount : totalStats }
  }, [statsReviews, reviews, totalCount])

  const formatDateYYMMDD = (s: string): string => {
    const str = String(s || '')
    // Case: 20250817 (YYYYMMDD)
    const yyyymmdd = str.match(/^(\d{4})(\d{2})(\d{2})$/)
    if (yyyymmdd) {
      const yy = yyyymmdd[1].slice(-2)
      const mm = yyyymmdd[2]
      const dd = yyyymmdd[3]
      return `${yy}.${mm}.${dd}`
    }
    const m = str.match(/^(\d{4})[-\/.](\d{1,2})[-\/.](\d{1,2})/)
    if (m) {
      const yy = m[1].slice(-2)
      const mm = m[2].padStart(2, '0')
      const dd = m[3].padStart(2, '0')
      return `${yy}.${mm}.${dd}`
    }
    const d = new Date(str)
    if (!isNaN(d.getTime())) {
      const yyyy = d.getFullYear().toString().slice(-2)
      const mm = String(d.getMonth() + 1).padStart(2, '0')
      const dd = String(d.getDate()).padStart(2, '0')
      return `${yyyy}.${mm}.${dd}`
    }
    return str
  }
  return (
    <div className="mb-10 md:mb-12 min-w-0">
      <h3 className="text-[20px] md:text-[22px] font-semibold mb-4 md:mb-6">Reviews</h3>
      <div className="mb-6 md:mb-8 p-4 md:p-6 bg-gray-50 rounded-lg">
        <div className="flex flex-col lg:flex-row lg:justify-center items-center gap-6 md:gap-8">
          {/* Left side - Overall rating */}
          <div className="flex flex-col items-center lg:flex-1">
            <div className="text-4xl md:text-6xl font-bold mb-2">{rating}</div>
            <div className="mb-2">{renderStars(rating)}</div>
            <div className="text-sm text-gray-600">based on {displayedTotalCount.toLocaleString()} reviews</div>
          </div>
          
          {/* Right side - Star distribution */}
          <div className="flex-1 w-full max-w-md">
            <div className="text-center mb-4">
              <h4 className="text-xs md:text-sm font-semibold mb-2 text-gray-700">Total reviews and rating from TOURVIS & GetYourGuide</h4>
            </div>
            {starDistribution.map(({ stars, count, percentage }) => (
              <div key={stars} className="flex items-center gap-3 mb-2">
                <div className="w-12 text-xs md:text-sm text-gray-700">{stars} star</div>
                <div className="flex-1 bg-gray-300 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full transition-all duration-300" 
                    style={{ 
                      width: `${percentage}%`, 
                      backgroundColor: '#ff00cc' 
                    }}
                  />
                </div>
                <div className="w-12 text-xs md:text-sm text-gray-700 text-right">{count.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="space-y-4">
        {reviews.map((review, index) => {
          const needsMore = (review?.comment?.length || 0) > 160
          const isExpanded = Boolean(expanded[index])
          return (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {renderStars(review.rating as number)}
                  <span className="font-semibold text-lg">{review.rating}.0</span>
                </div>
                <span className="text-sm text-gray-500">{maskName(review.name)}</span>
                <span className="text-sm text-gray-500">{formatDateYYMMDD(review.date)}</span>
              </div>
            </div>
            <p className={`text-gray-700 mb-3 whitespace-pre-line ${isExpanded ? '' : 'line-clamp-2'}`}>{review.comment}</p>
            {needsMore && (
              <div className="-mt-2 mb-2">
                <button className="text-sm text-gray-900 hover:underline inline-flex items-center" onClick={() => setExpanded(prev => ({ ...prev, [index]: !isExpanded }))}>
                  {isExpanded ? (
                    <>
                      Show Less <ChevronUp className="w-4 h-4 ml-1" />
                    </>
                  ) : (
                    <>
                      Show More <ChevronDown className="w-4 h-4 ml-1" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )})}
      </div>
    </div>
  )
})


