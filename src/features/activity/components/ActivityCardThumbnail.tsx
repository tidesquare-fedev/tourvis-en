'use client';

import { memo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { LazyImage } from '@/components/lazy/LazyImage';

type ActivityCardThumbnailProps = {
  image?: string | null;
  images?: string[];
  title: string;
};

export const ActivityCardThumbnail = memo(function ActivityCardThumbnail({
  image,
  images,
  title,
}: ActivityCardThumbnailProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // 이미지 배열이 있으면 사용하고, 없으면 단일 이미지를 배열로 변환
  // 최대 5장으로 제한
  const allImages = images && images.length > 0 ? images : image ? [image] : [];
  const imageList = allImages.slice(0, 5);
  const hasMultipleImages = imageList.length > 1;

  const handlePrevious = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex(prev => (prev === 0 ? imageList.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex(prev => (prev === imageList.length - 1 ? 0 : prev + 1));
  };

  if (imageList.length === 0) {
    return (
      <div className="relative h-40 sm:h-48 overflow-hidden bg-gray-100">
        <div className="w-full h-full flex items-center justify-center text-gray-400">
          이미지 없음
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative h-40 sm:h-48 overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <LazyImage
        src={imageList[currentIndex]}
        alt={`${title} ${currentIndex + 1}`}
        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
      />

      {/* Navigation Buttons - 상품 상세와 동일한 스타일 */}
      {hasMultipleImages && isHovered && (
        <>
          <button
            onClick={handlePrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-colors opacity-0 group-hover:opacity-100"
          >
            <ChevronLeft className="w-4 h-4 text-gray-700" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-colors opacity-0 group-hover:opacity-100"
          >
            <ChevronRight className="w-4 h-4 text-gray-700" />
          </button>
        </>
      )}

      {/* Dot Indicators */}
      {hasMultipleImages && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
          {imageList.map((_, index) => (
            <button
              key={index}
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                setCurrentIndex(index);
              }}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentIndex
                  ? 'bg-white scale-110'
                  : 'bg-white/60 hover:bg-white/80'
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
});
