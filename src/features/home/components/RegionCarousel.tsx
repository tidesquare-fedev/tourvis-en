'use client';

import Link from 'next/link';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { ResponsiveContainer } from '@/components/common/ResponsiveContainer';
import {
  getCarouselIndicatorsContainerClassName,
  getCarouselIndicatorClassName,
} from '@/lib/utils/carousel';
import type { Region } from '../types';
import { useState, useEffect } from 'react';
import type { CarouselApi } from '@/components/ui/carousel';

interface RegionCarouselProps {
  /** 지역 데이터 배열 */
  regions: Region[];
  /** 선택된 지역 ID */
  selectedRegionId: string;
  /** 지역 선택 핸들러 */
  onRegionSelect: (regionId: string) => void;
  /** 지역 호버 핸들러 */
  onRegionHover: (regionId: string | null) => void;
  /** 캐러셀 API 설정 */
  setCarouselApi: (api: CarouselApi | undefined) => void;
}

/**
 * 지역 목록을 캐러셀로 표시하는 컴포넌트
 * 호버 효과와 선택 상태를 관리
 */
export function RegionCarousel({
  regions,
  selectedRegionId,
  onRegionSelect,
  onRegionHover,
  setCarouselApi,
}: RegionCarouselProps) {
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [carouselCount, setCarouselCount] = useState(0);
  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      const idx = api.selectedScrollSnap();
      setCarouselIndex(idx);
      const region = regions[idx % Math.max(1, regions.length)];
      if (region) onRegionSelect(region.id);
    };

    setCarouselCount(api.scrollSnapList().length);
    onSelect();
    api.on('select', onSelect);

    return () => {
      api.off('select', onSelect);
    };
  }, [api, regions, onRegionSelect]);

  useEffect(() => {
    setCarouselApi(api);
  }, [api, setCarouselApi]);

  const selectedRegion =
    regions.find(r => r.id === selectedRegionId) || regions[0];

  return (
    <section className="relative w-full isolate bg-sky-50">
      <ResponsiveContainer
        verticalPadding="py-10 sm:py-14"
        backgroundColor="bg-sky-50"
      >
        <div className="relative group">
          {/* 지역 제목 섹션 */}
          <div className="pointer-events-none text-center mb-6 sm:mb-8 transition-transform duration-300 group-hover:-translate-y-1">
            <h2 className="text-xl sm:text-3xl font-extrabold mb-2 text-gray-900">
              {selectedRegion?.name}
            </h2>
            <p className="text-xs sm:text-sm text-gray-800/80">
              {selectedRegion?.subtitle}
            </p>
          </div>

          {/* 지역 캐러셀 */}
          <Carousel
            className="w-full"
            opts={{ align: 'start', slidesToScroll: 1, loop: true }}
            setApi={setApi}
          >
            <CarouselContent className="-ml-2 md:-ml-4 py-6 sm:py-8">
              {regions.map(region => (
                <CarouselItem
                  key={region.id}
                  className="pl-2 md:pl-4 basis-2/3 sm:basis-1/2 md:basis-1/3 lg:basis-1/5"
                >
                  <Link
                    href={`/products?region=${encodeURIComponent(region.id)}`}
                    aria-selected={selectedRegionId === region.id}
                    onMouseEnter={() => onRegionHover(region.id)}
                    onFocus={() => onRegionHover(region.id)}
                    onMouseLeave={() => onRegionHover(null)}
                    onBlur={() => onRegionHover(null)}
                    className={`
                      relative block h-72 sm:h-96 md:h-[28rem] overflow-hidden rounded-2xl cursor-pointer group 
                      outline-none focus:outline-none focus-visible:outline-none transition-transform duration-300 ease-out
                      ${selectedRegionId === region.id ? '-translate-y-4 sm:-translate-y-6 md:-translate-y-8 shadow-2xl' : ''}
                    `}
                  >
                    <img
                      src={region.image}
                      alt={region.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 active:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent group-hover:from-black/60" />
                    <div className="absolute bottom-3 left-3 text-white font-semibold text-sm sm:text-base drop-shadow">
                      {region.name}
                    </div>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {/* 캐러셀 인디케이터 */}
          {carouselCount > 1 && (
            <div className={getCarouselIndicatorsContainerClassName()}>
              {Array.from({ length: carouselCount }, (_, index) => (
                <button
                  key={index}
                  type="button"
                  className={getCarouselIndicatorClassName(
                    index === carouselIndex,
                  )}
                  onClick={() => api?.scrollTo(index)}
                  aria-label={`슬라이드 ${index + 1}로 이동`}
                />
              ))}
            </div>
          )}
        </div>
      </ResponsiveContainer>

      {/* 하단 여백 */}
      <div className="h-6 sm:h-8 bg-sky-50" />
    </section>
  );
}
