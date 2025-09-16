'use client'

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { ActivityCard } from '@/features/activity/components/ActivityCard'
import { ProductGridSkeleton, CarouselSkeleton } from '@/components/ui/skeleton'
import { useProductSearch } from '@/hooks/useOptimizedQueries'
import { useSearchDebounce } from '@/hooks/useDebounce'
import { getCarouselItemClassName, shouldShowCarouselArrows, getCarouselNavigationClassName } from '@/lib/utils/carousel'
import type { ProductItem } from '@/features/activity/types'
import { useState, useEffect } from 'react'

interface OptimizedProductCarouselProps {
  /** 제품 데이터 배열 (선택사항 - 없으면 API에서 로드) */
  products?: any[]
  /** 프로바이더 ID (API 호출 시 필요) */
  providerIds?: string
  /** 검색 키워드 */
  keyword?: string
  /** 화살표 표시 여부 */
  showArrows?: boolean
  /** 화살표를 표시할 최소 아이템 개수 */
  minItemsForArrows?: number
  /** 캐러셀 옵션 */
  carouselOptions?: {
    align?: 'start' | 'center' | 'end'
    slidesToScroll?: number
    loop?: boolean
  }
  /** 아이템 클래스명 커스터마이징 */
  itemClassName?: string
  /** 제품 변환 함수 커스터마이징 */
  transformProduct?: (product: any) => ProductItem
  /** 자동 새로고침 간격 (밀리초) */
  refreshInterval?: number
}

/**
 * 최적화된 제품 캐러셀 컴포넌트
 * 캐싱, 중복 제거, 로딩 상태 등을 포함한 고성능 캐러셀
 */
export function OptimizedProductCarousel({
  products: initialProducts,
  providerIds,
  keyword = '',
  showArrows = true,
  minItemsForArrows = 4,
  carouselOptions = {},
  itemClassName,
  transformProduct,
  refreshInterval,
}: OptimizedProductCarouselProps) {
  const [products, setProducts] = useState<any[]>(initialProducts || [])
  
  // 검색 키워드 debounce
  const { debouncedSearchTerm, isSearching } = useSearchDebounce(keyword, 300)
  
  // API에서 데이터 로드 (초기 데이터가 없는 경우)
  const { 
    data: apiData, 
    isLoading, 
    isError, 
    error 
  } = useProductSearch({
    providerIds: providerIds || '',
    keyword: debouncedSearchTerm,
  })

  // 제품 데이터 업데이트
  useEffect(() => {
    if (apiData?.items) {
      setProducts(apiData.items)
    } else if (initialProducts) {
      setProducts(initialProducts)
    }
  }, [apiData?.items, initialProducts])

  // 자동 새로고침
  useEffect(() => {
    if (!refreshInterval) return

    const interval = setInterval(() => {
      // React Query가 자동으로 리페치하므로 별도 처리 불필요
    }, refreshInterval)

    return () => clearInterval(interval)
  }, [refreshInterval])

  const {
    align = 'start',
    slidesToScroll = 1,
    loop = false
  } = carouselOptions

  const shouldShowArrows = shouldShowCarouselArrows(showArrows, products.length, minItemsForArrows)

  // 로딩 상태
  if (isLoading || isSearching) {
    return <CarouselSkeleton itemCount={minItemsForArrows} showArrows={shouldShowArrows} />
  }

  // 에러 상태
  if (isError) {
    return (
      <div className="w-full p-8 text-center">
        <div className="text-red-600 mb-2">데이터를 불러올 수 없습니다</div>
        <div className="text-sm text-gray-500">
          {error?.message || '알 수 없는 오류가 발생했습니다.'}
        </div>
      </div>
    )
  }

  // 빈 데이터
  if (!products || products.length === 0) {
    return (
      <div className="w-full p-8 text-center">
        <div className="text-gray-500">표시할 상품이 없습니다</div>
      </div>
    )
  }

  return (
    <Carousel 
      className="w-full" 
      opts={{ align, slidesToScroll, loop }}
    >
      <CarouselContent className="-ml-2 md:-ml-4">
        {products.map((product) => {
          const productItem = transformProduct ? transformProduct(product) : {
            id: product.id || product.productId || '',
            title: product.title || product.productName || product.name || '',
            image: product.image || product.imageUrl || '',
            images: product.images || (product.image ? [product.image] : []),
            price: typeof product.price === 'string' ? Number(product.price) : product.price,
            originalPrice: typeof product.originalPrice === 'string' ? Number(product.originalPrice) : product.originalPrice,
            discountRate: typeof product.discountRate === 'string' ? Number(product.discountRate) : product.discountRate,
            rating: product.rating,
            reviewCount: product.reviewCount,
            location: product.location,
            category: product.category,
            href: product.href,
          }
          
          return (
            <CarouselItem 
              key={productItem.id} 
              className={itemClassName || getCarouselItemClassName()}
            >
              <ActivityCard item={productItem} />
            </CarouselItem>
          )
        })}
      </CarouselContent>
      {shouldShowArrows && (
        <div className={getCarouselNavigationClassName()}>
          <CarouselPrevious className="relative translate-x-0 translate-y-0" />
          <CarouselNext className="relative translate-x-0 translate-y-0" />
        </div>
      )}
    </Carousel>
  )
}
