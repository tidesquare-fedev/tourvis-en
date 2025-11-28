'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { ActivityCard } from '@/features/activity/components/ActivityCard';
import type { ProductItem } from '@/features/activity/types';
import {
  getCarouselItemClassName,
  getCarouselNavigationClassName,
  shouldShowCarouselArrows,
} from '@/lib/utils/carousel';
import { transformToProductItem } from '@/lib/utils/product';

interface ProductCarouselProps {
  /** 제품 데이터 배열 */
  products: unknown[];
  /** 화살표 표시 여부 */
  showArrows?: boolean;
  /** 화살표를 표시할 최소 아이템 개수 */
  minItemsForArrows?: number;
  /** 캐러셀 옵션 */
  carouselOptions?: {
    align?: 'start' | 'center' | 'end';
    slidesToScroll?: number;
    loop?: boolean;
  };
  /** 아이템 클래스명 커스터마이징 */
  itemClassName?: string;
  /** 제품 변환 함수 커스터마이징 */
  transformProduct?: (product: unknown) => ProductItem;
}

/**
 * 제품 목록을 캐러셀로 표시하는 재사용 가능한 컴포넌트
 *
 * @example
 * ```tsx
 * <ProductCarousel
 *   products={productList}
 *   showArrows={true}
 *   minItemsForArrows={4}
 * />
 * ```
 */
export function ProductCarousel({
  products,
  showArrows = true,
  minItemsForArrows = 4,
  carouselOptions = {},
  itemClassName,
  transformProduct = transformToProductItem,
}: ProductCarouselProps) {
  const { align = 'start', slidesToScroll = 1, loop = false } = carouselOptions;

  const shouldShowArrows = shouldShowCarouselArrows(
    showArrows,
    products.length,
    minItemsForArrows,
  );

  return (
    <Carousel className="w-full" opts={{ align, slidesToScroll, loop }}>
      <CarouselContent className="-ml-2 md:-ml-4">
        {products.map(product => {
          const productItem = transformProduct(product);

          return (
            <CarouselItem
              key={productItem.id}
              className={itemClassName || getCarouselItemClassName()}
            >
              <ActivityCard item={productItem} />
            </CarouselItem>
          );
        })}
      </CarouselContent>
      {shouldShowArrows && (
        <div className={getCarouselNavigationClassName()}>
          <CarouselPrevious className="relative translate-x-0 translate-y-0" />
          <CarouselNext className="relative translate-x-0 translate-y-0" />
        </div>
      )}
    </Carousel>
  );
}
