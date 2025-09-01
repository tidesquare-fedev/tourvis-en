"use client"

import { useMemo, useState } from 'react'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { Star, ChevronUp, ChevronDown } from 'lucide-react'

type Review = { name: string; rating: number; date: string; comment: string }

type TopReviewsCarouselProps = {
  reviews: Review[]
  starColor?: string
  rating?: number
  reviewCount?: number
  onScrollToReviews?: () => void
  maskName?: (name: string) => string
}

function ReviewCard({ review, starColor, maskName }: { review: Review; starColor: string; maskName?: (name: string) => string }) {
  const [expanded, setExpanded] = useState(false)
  const needsMore = (review?.comment?.length || 0) > 160

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

  return (
    <div className="h-full">
      <div className="border rounded-2xl shadow-sm p-5 h-full">
        <div className="flex flex-col gap-1 md:flex-row md:items-center md:gap-2 text-sm text-gray-600 mb-3">
          <div className="flex items-center gap-2">
            {renderStars(review.rating)}
            <span className="font-semibold text-gray-800">{Number(review.rating).toFixed(1)}</span>
          </div>
          <div className="flex items-center gap-2 md:ml-2">
            <span className="font-medium">{maskName ? maskName(review.name) : review.name}</span>
            <span className="hidden md:inline">·</span>
            <span>{review.date}</span>
          </div>
        </div>
        <p className={`text-gray-800 leading-relaxed ${expanded ? '' : 'line-clamp-3'}`}>{review.comment}</p>
        {needsMore && (
          <button className="mt-2 text-sm text-blue-600 hover:underline inline-flex items-center" onClick={() => setExpanded((v) => !v)}>
            {expanded ? (
              <>
                Show Less <ChevronUp className="w-4 h-4 ml-1" />
              </>
            ) : (
              <>
                Show More <ChevronDown className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}

export function TopReviewsCarousel({ reviews, starColor = '#ff00cc', rating, reviewCount, onScrollToReviews, maskName }: TopReviewsCarouselProps) {
  const topReviews = [...(reviews || [])]
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    .slice(0, 10)

  const renderStars = (value: number) => {
    const safe = Math.max(0, Math.min(5, Math.floor(Number(value) || 0)))
    return (
      <div className="flex items-center">
        {Array.from({ length: 5 }, (_, i) => (
          <Star key={i} className={`w-3 h-3 ${i < safe ? 'fill-current' : ''}`} style={i < safe ? { color: starColor } : { color: '#d1d5db' }} />
        ))}
      </div>
    )
  }

  if (topReviews.length === 0) return null

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h3 className="text-lg md:text-xl font-semibold">Real Traveler Stories</h3>
        {typeof rating === 'number' && (
          <div className="flex items-center gap-2 flex-shrink-0">
            {renderStars(rating)}
            <span className="font-semibold">{Number(rating).toFixed(1)}</span>
            {typeof reviewCount === 'number' && <span className="text-gray-500">({reviewCount.toLocaleString()})</span>}
            {onScrollToReviews && (
              <button onClick={onScrollToReviews} className="ml-2 text-sm text-black underline hover:underline">
                Full review
              </button>
            )}
          </div>
        )}
      </div>
      <Carousel className="w-full relative overflow-hidden">
        <CarouselContent>
          {topReviews.map((review, index) => (
            <CarouselItem key={index} className="basis-[85%] sm:basis-[60%] md:basis-1/2">
              <ReviewCard review={review} starColor={starColor} maskName={maskName} />
            </CarouselItem>
          ))}
        </CarouselContent>
        {topReviews.length > 2 && (
          <>
            <CarouselPrevious className="absolute left-2 md:-left-8 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-white shadow-md disabled:opacity-0 disabled:pointer-events-none" />
            <CarouselNext className="absolute right-2 md:-right-8 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-white shadow-md disabled:opacity-0 disabled:pointer-events-none" />
          </>
        )}
      </Carousel>
    </div>
  )
}


