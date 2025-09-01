"use client"

import { ThumbsUp, Star, Check, X, ChevronDown, ChevronUp } from 'lucide-react'

type Review = { name: string; rating: number; date: string; comment: string; helpful: number; tags?: string[] }

type TourReviewsProps = {
  rating: number
  reviews: Review[]
  showAll: boolean
  onShowAll: () => void
  onShowLess?: () => void
  maskName: (name: string) => string
  starColor?: string
}

export function TourReviews({ rating, reviews, showAll, onShowAll, onShowLess, maskName, starColor = '#ff00cc' }: TourReviewsProps) {
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

  // Calculate star distribution
  const starCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  reviews.forEach(review => {
    const stars = Math.floor(review.rating)
    if (stars >= 1 && stars <= 5) {
      starCounts[stars as keyof typeof starCounts]++
    }
  })

  const totalReviews = reviews.length
  const starDistribution = [5, 4, 3, 2, 1].map(stars => ({
    stars,
    count: starCounts[stars as keyof typeof starCounts],
    percentage: totalReviews > 0 ? (starCounts[stars as keyof typeof starCounts] / totalReviews) * 100 : 0
  }))

  return (
    <div className="mb-10 md:mb-12 min-w-0">
      <h3 className="text-[20px] md:text-[22px] font-semibold mb-4 md:mb-6">Reviews</h3>
      <div className="mb-6 md:mb-8 p-4 md:p-6 bg-gray-50 rounded-lg">
        <div className="flex flex-col lg:flex-row lg:justify-center items-center gap-6 md:gap-8">
          {/* Left side - Overall rating */}
          <div className="flex flex-col items-center lg:flex-1">
            <div className="text-4xl md:text-6xl font-bold mb-2">{rating}</div>
            <div className="mb-2">{renderStars(rating)}</div>
            <div className="text-sm text-gray-600">based on {totalReviews.toLocaleString()} reviews</div>
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
        {(showAll ? reviews : reviews.slice(0, 3)).map((review, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {renderStars(review.rating as number)}
                  <span className="font-semibold text-lg">{review.rating}.0</span>
                </div>
                <span className="text-sm text-gray-500">{maskName(String(review.name))}</span>
                <span className="text-sm text-gray-500">{review.date}</span>
              </div>
            </div>
            <div className="mb-3">
              <span className="text-sm text-gray-600">Tour date: {review.date}</span>
            </div>
            <p className={`text-gray-700 mb-3 whitespace-pre-line ${showAll ? '' : 'line-clamp-3'}`}>{review.comment}</p>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-1 hover:text-blue-600">
                  <span>Was this review helpful?</span>
                </button>
                <button className="flex items-center gap-1 hover:text-blue-600">
                  <ThumbsUp className="w-4 h-4" />
                  <span>{review.helpful}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
        {reviews.length >= 3 && (
          <div className="mt-2 flex justify-start">
            {!showAll ? (
              <button className="text-sm text-blue-600 hover:underline inline-flex items-center" onClick={onShowAll}>
                Show More <ChevronDown className="w-4 h-4 ml-1" />
              </button>
            ) : (
              <button className="text-sm text-blue-600 hover:underline inline-flex items-center" onClick={onShowLess || onShowAll}>
                Show Less <ChevronUp className="w-4 h-4 ml-1" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}


