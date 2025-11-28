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
import type { Banner } from '../types';
import { useState, useEffect } from 'react';
import type { CarouselApi } from '@/components/ui/carousel';

interface BannerCarouselProps {
  /** 배너 데이터 배열 */
  banners: Banner[];
  /** 캐러셀 API 설정 */
  setCarouselApi: (api: CarouselApi | undefined) => void;
}

/**
 * 배너 목록을 캐러셀로 표시하는 컴포넌트
 * 자동 슬라이드와 인디케이터를 포함
 */
export function BannerCarousel({
  banners,
  setCarouselApi,
}: BannerCarouselProps) {
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [carouselCount, setCarouselCount] = useState(0);
  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!api) return;

    const onSelect = () => setCarouselIndex(api.selectedScrollSnap());
    setCarouselCount(api.scrollSnapList().length);
    onSelect();
    api.on('select', onSelect);

    return () => {
      api.off('select', onSelect);
    };
  }, [api]);

  useEffect(() => {
    setCarouselApi(api);
  }, [api, setCarouselApi]);

  if (!banners || banners.length === 0) {
    return null;
  }

  return (
    <section className="w-full">
      <ResponsiveContainer verticalPadding="py-4 sm:py-8">
        <Carousel
          className="w-full"
          opts={{ align: 'start', loop: true }}
          setApi={setApi}
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {banners.map(banner => (
              <CarouselItem key={banner.id} className="pl-2 md:pl-4 basis-full">
                <Link
                  href={banner.href ?? `/products?banner/${banner.id}`}
                  className="block focus:outline-none focus-visible:outline-none"
                >
                  <div className="relative w-full h-48 sm:h-64 md:h-[20rem] rounded-xl overflow-hidden">
                    <img
                      src={banner.image}
                      alt={banner.title}
                      className="w-full h-full object-cover"
                    />
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
      </ResponsiveContainer>
    </section>
  );
}
