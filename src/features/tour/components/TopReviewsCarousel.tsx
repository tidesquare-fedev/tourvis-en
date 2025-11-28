'use client';

import { memo, useMemo, useState, useCallback, useEffect } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import {
  Star,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import type { ReviewItem } from '@/types/review';

type TopReviewsCarouselProps = {
  reviews: ReviewItem[];
  starColor?: string;
  rating?: number;
  reviewCount?: number;
  onScrollToReviews?: () => void;
  maskName?: (name: string) => string;
};

const ReviewCard = memo(function ReviewCard({
  review,
  starColor,
  maskName,
}: {
  review: ReviewItem;
  starColor: string;
  maskName?: (name: string) => string;
}) {
  const [expanded, setExpanded] = useState(false);
  const needsMore = (review?.comment?.length || 0) > 160;

  const renderStars = (value: number) => {
    const safe = Math.max(0, Math.min(5, Math.floor(Number(value) || 0)));
    return (
      <div className="flex items-center">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${i < safe ? 'fill-current' : ''}`}
            style={i < safe ? { color: starColor } : { color: '#d1d5db' }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="h-full">
      <div className="border rounded-2xl shadow-sm p-4 h-full">
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-2">
            {renderStars(review.rating)}
            <span className="font-semibold text-gray-800">
              {Number(review.rating).toFixed(1)}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="font-medium">
              {maskName ? maskName(review.name) : review.name}
            </span>
            <span>·</span>
            <span>{review.date}</span>
          </div>
        </div>
        <p
          className={`text-gray-800 leading-relaxed text-sm ${expanded ? '' : 'line-clamp-2'}`}
        >
          {review.comment}
        </p>
        {needsMore && (
          <button
            className="mt-2 text-sm text-gray-900 hover:underline inline-flex items-center"
            onClick={() => setExpanded(v => !v)}
          >
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
  );
});

export const TopReviewsCarousel = memo(function TopReviewsCarousel({
  reviews,
  starColor = '#ff00cc',
  rating,
  reviewCount,
  onScrollToReviews,
  maskName,
}: TopReviewsCarouselProps) {
  const parseDate = (s: string): number => {
    const d = new Date(String(s || ''));
    const t = d.getTime();
    return isNaN(t) ? 0 : t;
  };
  const topReviews = useMemo(
    () =>
      [...(reviews || [])]
        .filter(r => Number(r?.rating ?? 0) >= 5)
        .sort((a, b) => parseDate(b.date) - parseDate(a.date))
        .slice(0, 10),
    [reviews],
  );

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  const renderStars = (value: number) => {
    const safe = Math.max(0, Math.min(5, Math.floor(Number(value) || 0)));
    return (
      <div className="flex items-center">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            className={`w-3 h-3 ${i < safe ? 'fill-current' : ''}`}
            style={i < safe ? { color: starColor } : { color: '#d1d5db' }}
          />
        ))}
      </div>
    );
  };

  if (topReviews.length === 0) return null;

  return (
    <div className="mb-8 overflow-visible">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h3 className="text-lg md:text-xl font-semibold">
          Real Traveler Reviews
        </h3>
        {typeof rating === 'number' && (
          <div className="flex items-center gap-2 flex-shrink-0">
            {renderStars(rating)}
            <span className="font-semibold">{Number(rating).toFixed(1)}</span>
            {typeof reviewCount === 'number' && (
              <span className="text-gray-500">
                ({reviewCount.toLocaleString()})
              </span>
            )}
            {onScrollToReviews && (
              <button
                onClick={onScrollToReviews}
                className="ml-2 text-sm text-black underline hover:underline"
              >
                Full review
              </button>
            )}
          </div>
        )}
      </div>
      <div className="relative group overflow-visible">
        <div className="overflow-x-hidden" ref={emblaRef}>
          <div className="flex">
            {topReviews.map((review, index) => (
              <div
                key={index}
                className="flex-[0_0_85%] sm:flex-[0_0_60%] md:flex-[0_0_50%] px-2"
              >
                <ReviewCard
                  review={review}
                  starColor={starColor}
                  maskName={maskName}
                />
              </div>
            ))}
          </div>
        </div>
        {topReviews.length > 2 && (
          <>
            {!prevBtnDisabled && (
              <button
                className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 transition-colors"
                onClick={scrollPrev}
              >
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>
            )}
            {!nextBtnDisabled && (
              <button
                className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 transition-colors"
                onClick={scrollNext}
              >
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
});
