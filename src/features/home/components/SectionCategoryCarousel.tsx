'use client';

import { OptimizedProductCarousel } from '@/components/common/OptimizedProductCarousel';
import { useSectionProducts } from '@/hooks/useOptimizedQueries';
import { ProductGridSkeleton } from '@/components/ui/skeleton';

interface SectionCategoryCarouselProps {
  /** 카테고리 제목 */
  title: string;
  /** 기본 아이템 배열 */
  defaultItems: any[];
  /** 화살표 표시 여부 */
  showArrows?: boolean;
  /** 자동 새로고침 간격 (밀리초) */
  refreshInterval?: number;
}

/**
 * 최적화된 섹션별 카테고리 캐러셀 컴포넌트
 * 캐싱, 로딩 상태, 에러 처리가 개선된 제품 캐러셀
 */
export function SectionCategoryCarousel({
  title,
  defaultItems,
  showArrows = true,
  refreshInterval,
}: SectionCategoryCarouselProps) {
  const {
    data: queryData,
    isLoading,
    isError,
    error,
  } = useSectionProducts({
    templateId: 'TV_TAB_BSTP',
    title,
    limit: 20, // 최적화를 위해 제한
  });

  // API 데이터가 있으면 사용, 없으면 기본 데이터 사용
  const items =
    queryData?.items && queryData.items.length > 0
      ? queryData.items
      : defaultItems;

  // 로딩 상태
  if (isLoading) {
    return <ProductGridSkeleton count={4} />;
  }

  // 에러 상태
  if (isError) {
    console.warn(`섹션 "${title}" 데이터 로드 실패:`, error);
    // 에러가 있어도 기본 데이터로 렌더링
  }

  return (
    <OptimizedProductCarousel
      products={items}
      showArrows={showArrows}
      minItemsForArrows={4}
      refreshInterval={refreshInterval}
      carouselOptions={{
        align: 'start',
        slidesToScroll: 1,
        loop: false,
      }}
    />
  );
}
