'use client';

import {
  MapPin,
  Star,
  Clock,
  Users,
  Globe,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  Quote,
} from 'lucide-react';
import { TopReviewsCarousel } from './TopReviewsCarousel';
import { TourApiResponse } from '@/types/tour';
import { useState, useEffect, useRef } from 'react';

type TourHeroSectionProps = {
  tourData: TourApiResponse;
  tour: {
    title: string;
    subtitle: string;
    location: string;
    rating: number;
    reviewCount: number;
    price: number;
    originalPrice?: number | null;
    discountRate?: number | null;
    duration: string;
    language: string;
    images: string[];
    reviews: Array<{
      name: string;
      rating: number;
      date: string;
      comment: string;
      helpful: number;
      tags?: string[];
    }>;
  };
  starColor: string;
  onScrollToReviews: () => void;
  maskName: (name: string) => string;
  reviewsOverride?: Array<{
    name: string;
    rating: number;
    date: string;
    comment: string;
  }>;
  ratingOverride?: number;
  reviewCountOverride?: number;
};

export function TourHeroSection({
  tourData,
  tour,
  starColor,
  onScrollToReviews,
  maskName,
  reviewsOverride,
  ratingOverride,
  reviewCountOverride,
}: TourHeroSectionProps) {
  // tour.images가 문자열 배열이므로 이를 우선으로 사용
  const allImages =
    tour.images && tour.images.length > 0
      ? tour.images
      : tourData.detail.images?.map(img => img.file_url) || [];
  const primaryImage = allImages[0] || tourData.detail.primary_image?.file_url;
  const additionalImages = allImages.slice(1, 5);

  // 디버그 로그 제거 (noise 방지)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [currentMainImageIndex, setCurrentMainImageIndex] = useState(0);
  const thumbnailRef = useRef<HTMLDivElement>(null);

  // Main image navigation functions
  const handlePreviousImage = () => {
    setCurrentMainImageIndex(prev =>
      prev > 0 ? prev - 1 : allImages.length - 1,
    );
  };

  const handleNextImage = () => {
    setCurrentMainImageIndex(prev =>
      prev < allImages.length - 1 ? prev + 1 : 0,
    );
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentMainImageIndex(index);
  };

  const handleMainImageClick = () => {
    setSelectedImageIndex(currentMainImageIndex);
    setIsModalOpen(true);
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isModalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsModalOpen(false);
      } else if (e.key === 'ArrowLeft') {
        setSelectedImageIndex(prev =>
          prev === 0 ? allImages.length - 1 : prev - 1,
        );
      } else if (e.key === 'ArrowRight') {
        setSelectedImageIndex(prev =>
          prev === allImages.length - 1 ? 0 : prev + 1,
        );
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, allImages.length]);

  // Auto-scroll thumbnail to selected image
  useEffect(() => {
    if (!isModalOpen || !thumbnailRef.current) return;

    const scrollToThumbnail = () => {
      const thumbnailContainer = thumbnailRef.current;
      if (!thumbnailContainer) return;

      const selectedThumbnail = thumbnailContainer.children[
        selectedImageIndex
      ] as HTMLElement;
      if (!selectedThumbnail) return;

      console.log(
        'Scrolling to thumbnail:',
        selectedImageIndex,
        'Total thumbnails:',
        thumbnailContainer.children.length,
      );

      // Simple approach: scroll the selected thumbnail into view
      selectedThumbnail.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    };

    // Use requestAnimationFrame to ensure DOM is ready
    const rafId = requestAnimationFrame(() => {
      scrollToThumbnail();
    });

    return () => cancelAnimationFrame(rafId);
  }, [selectedImageIndex, isModalOpen]);

  return (
    <div className="bg-white pt-0 lg:pt-4">
      {/* Main Hero Section */}
      <div className="max-w-7xl mx-auto px-0 lg:px-4 pb-4">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Main Image - Mobile: Top, Desktop: Left */}
          <div className="order-1 lg:order-1">
            <div className="relative group">
              <img
                src={
                  allImages[currentMainImageIndex] ||
                  'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&h=600&fit=crop'
                }
                alt={tour.title}
                className="w-full h-[300px] sm:h-[400px] lg:h-[600px] object-cover rounded-none lg:rounded-2xl shadow-lg cursor-pointer"
                onClick={handleMainImageClick}
                onError={e => {
                  e.currentTarget.src =
                    'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&h=600&fit=crop';
                }}
              />

              {/* Navigation Buttons */}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={handlePreviousImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Additional Images Thumbnails - Mobile: Below main image */}
            {allImages.length > 1 && (
              <div className="mt-4 lg:hidden px-4">
                <div className="grid grid-cols-4 gap-2">
                  {allImages.slice(0, 4).map((image, index) => (
                    <div
                      key={index}
                      className="relative group cursor-pointer"
                      onClick={() => handleThumbnailClick(index)}
                    >
                      <img
                        src={
                          typeof image === 'string'
                            ? image
                            : (image as any)?.file_url || String(image)
                        }
                        alt={`${tour.title} ${index + 1}`}
                        className={`w-full h-16 object-cover rounded-lg shadow-sm group-hover:shadow-md transition-all duration-200 ${
                          currentMainImageIndex === index
                            ? 'ring-2 ring-blue-500'
                            : ''
                        }`}
                      />

                      {/* See More overlay on last thumbnail */}
                      {index === 3 && allImages.length > 4 && (
                        <div
                          className="absolute inset-0 bg-black/40 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-black/50 transition-colors"
                          onClick={e => {
                            e.stopPropagation();
                            setSelectedImageIndex(0);
                            setIsModalOpen(true);
                          }}
                        >
                          <div className="text-white text-center">
                            <div className="text-xs font-semibold mb-1">
                              See More
                            </div>
                            <div className="text-xs opacity-90">
                              +{allImages.length}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Tour Information - Mobile: Bottom, Desktop: Right */}
          <div className="order-2 lg:order-2 flex flex-col px-4 lg:px-0">
            {/* Location */}
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600 text-sm">{tour.location}</span>
            </div>

            {/* Title */}
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {tour.title}
            </h1>

            {/* Subtitle */}
            {tour.subtitle && (
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                {tour.subtitle}
              </p>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* Duration (from summaries.duration like IN4H) */}
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <Clock className="w-5 h-5 text-blue-500" />
                <div>
                  <div className="font-semibold text-gray-900">
                    {(() => {
                      const code = tourData.summary?.duration;
                      if (typeof code === 'string' && code.startsWith('IN')) {
                        const num = code.replace(/[^0-9]/g, '');
                        if (code.endsWith('H') && num) return `${num} hours`;
                        if (code.endsWith('D') && num) return `${num} days`;
                      }
                      if (typeof code === 'string' && code.startsWith('OV')) {
                        const num = code.replace(/[^0-9]/g, '');
                        if (code.endsWith('H') && num)
                          return `Over ${num} hours`;
                        if (code.endsWith('D') && num)
                          return `Over ${num} days`;
                      }
                      return tour.duration;
                    })()}
                  </div>
                  <div className="text-xs text-gray-500">Duration</div>
                </div>
              </div>

              {/* Language (from summaries.languages) */}
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <Globe className="w-5 h-5 text-green-500" />
                <div>
                  <div className="font-semibold text-gray-900">
                    {(() => {
                      const mapLang = (s: string): string => {
                        const raw = String(s || '').trim();
                        const upper = raw.toUpperCase();
                        const korMap: Record<string, string> = {
                          영어: 'English',
                          한국어: 'Korean',
                          일본어: 'Japanese',
                          중국어: 'Chinese',
                          스페인어: 'Spanish',
                          프랑스어: 'French',
                          독일어: 'German',
                          이탈리아어: 'Italian',
                          포르투갈어: 'Portuguese',
                          러시아어: 'Russian',
                        };
                        if (korMap[raw as keyof typeof korMap])
                          return korMap[raw as keyof typeof korMap];
                        const codeMap: Record<string, string> = {
                          ENGLISH: 'English',
                          KOREAN: 'Korean',
                          JAPANESE: 'Japanese',
                          CHINESE: 'Chinese',
                          SPANISH: 'Spanish',
                          FRENCH: 'French',
                          GERMAN: 'German',
                          ITALIAN: 'Italian',
                          PORTUGUESE: 'Portuguese',
                          RUSSIAN: 'Russian',
                          ETC: 'Korean',
                          EN: 'English',
                          KO: 'Korean',
                          JA: 'Japanese',
                          ZH: 'Chinese',
                          ES: 'Spanish',
                          FR: 'French',
                          DE: 'German',
                          IT: 'Italian',
                          PT: 'Portuguese',
                          RU: 'Russian',
                        };
                        return codeMap[upper] || raw;
                      };
                      const pref =
                        Array.isArray(tourData.summary?.languages) &&
                        tourData.summary!.languages!.length > 0
                          ? tourData.summary!.languages!
                          : Array.isArray(tourData.basic.languages)
                            ? tourData.basic.languages
                            : [];
                      const mapped = (pref as string[])
                        .map(mapLang)
                        .filter(Boolean);
                      return mapped.join(', ');
                    })()}
                  </div>
                  <div className="text-xs text-gray-500">Language</div>
                </div>
              </div>

              {/* Confirm (from summaries.confirm_hour / product_policies) */}
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <div className="w-5 h-5 rounded-full border-2 border-green-500 flex items-center justify-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    {(() => {
                      const hasInstantConfirmation =
                        (tourData.summary?.product_policies || []).includes(
                          'INSTANT_CONFIRMATION',
                        ) || tourData.summary?.confirm_hour === 'IN0H';
                      return hasInstantConfirmation
                        ? 'Instant confirmation'
                        : 'Confirmation required';
                    })()}
                  </div>
                  <div className="text-xs text-gray-500">Confirm</div>
                </div>
              </div>

              {/* Voucher (from summaries.voucher_types) */}
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <div className="w-5 h-5 rounded-full border-2 border-purple-500 flex items-center justify-center">
                  <div className="w-3 h-3 bg-purple-500 rounded-sm"></div>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    {(() => {
                      const voucherType = Array.isArray(
                        tourData.summary?.voucher_types,
                      )
                        ? tourData.summary?.voucher_types[0]
                        : (tourData.summary as any)?.voucher_type;
                      if (voucherType === 'M_VOUCHER') return 'Mobile voucher';
                      if (voucherType === 'P_VOUCHER') return 'Printed voucher';
                      return 'Mobile voucher';
                    })()}
                  </div>
                  <div className="text-xs text-gray-500">Voucher</div>
                </div>
              </div>
            </div>

            {/* Real Traveler Reviews */}
            <div className="mt-6">
              <TopReviewsCarousel
                reviews={
                  reviewsOverride && reviewsOverride.length > 0
                    ? reviewsOverride
                    : (tour.reviews as any)
                }
                starColor={starColor}
                rating={
                  typeof ratingOverride === 'number'
                    ? ratingOverride
                    : tour.rating
                }
                reviewCount={
                  typeof reviewCountOverride === 'number'
                    ? reviewCountOverride
                    : tour.reviewCount
                }
                onScrollToReviews={onScrollToReviews}
                maskName={maskName}
              />
            </div>
          </div>
        </div>

        {/* Additional Images Thumbnails - Desktop Only */}
        {allImages.length > 1 && (
          <div className="hidden lg:block mt-8 px-4">
            <div className="grid grid-cols-4 gap-4">
              {allImages.slice(0, 4).map((image, index) => (
                <div
                  key={index}
                  className="relative group cursor-pointer"
                  onClick={() => handleThumbnailClick(index)}
                >
                  <img
                    src={
                      typeof image === 'string'
                        ? image
                        : (image as any)?.file_url || String(image)
                    }
                    alt={`${tour.title} ${index + 1}`}
                    className={`w-full h-32 object-cover rounded-lg shadow-sm group-hover:shadow-md transition-all duration-200 ${
                      currentMainImageIndex === index
                        ? 'ring-2 ring-blue-500'
                        : ''
                    }`}
                  />

                  {/* See More overlay on last thumbnail */}
                  {index === 3 && allImages.length > 4 && (
                    <div
                      className="absolute inset-0 bg-black/40 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-black/50 transition-colors"
                      onClick={e => {
                        e.stopPropagation();
                        setSelectedImageIndex(0);
                        setIsModalOpen(true);
                      }}
                    >
                      <div className="text-white text-center">
                        <div className="text-lg font-semibold mb-1">
                          See More
                        </div>
                        <div className="text-sm opacity-90">
                          +{allImages.length}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Image Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-6xl max-h-[90vh] w-full flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">See all</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 relative overflow-hidden">
              {/* Main Image Container */}
              <div className="relative h-full flex items-center justify-center bg-gray-50">
                <img
                  src={
                    typeof allImages[selectedImageIndex] === 'string'
                      ? allImages[selectedImageIndex]
                      : (allImages[selectedImageIndex] as any)?.file_url ||
                        String(allImages[selectedImageIndex])
                  }
                  alt={`${tour.title} ${selectedImageIndex + 1}`}
                  className="max-w-full max-h-full object-contain"
                />

                {/* Navigation Buttons */}
                {allImages.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setSelectedImageIndex(prev =>
                          prev === 0 ? allImages.length - 1 : prev - 1,
                        )
                      }
                      className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 sm:p-3 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6 text-gray-700" />
                    </button>
                    <button
                      onClick={() =>
                        setSelectedImageIndex(prev =>
                          prev === allImages.length - 1 ? 0 : prev + 1,
                        )
                      }
                      className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 sm:p-3 transition-colors"
                    >
                      <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6 text-gray-700" />
                    </button>
                  </>
                )}

                {/* Image Counter */}
                {allImages.length > 1 && (
                  <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                    {selectedImageIndex + 1} / {allImages.length}
                  </div>
                )}
              </div>
            </div>

            {/* Thumbnail Strip */}
            {allImages.length > 1 && (
              <div className="p-4 border-t border-gray-200">
                <div
                  ref={thumbnailRef}
                  className="flex gap-2 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
                >
                  {allImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors snap-center ${
                        index === selectedImageIndex
                          ? 'border-blue-500'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={
                          typeof image === 'string'
                            ? image
                            : (image as any)?.file_url || String(image)
                        }
                        alt={`${tour.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
