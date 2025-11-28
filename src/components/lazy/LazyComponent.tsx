'use client';

import { cn } from '@/lib/utils';
import { ComponentType, lazy, Suspense } from 'react';

interface LazyComponentProps {
  fallback?: React.ReactNode;
  className?: string;
}

// ProductFilters props 타입
interface ProductFiltersProps {
  filters: {
    locations: string[];
    category: string;
    priceRange: [number, number];
  };
  onFiltersChange: (filters: {
    locations: string[];
    category: string;
    priceRange: [number, number];
  }) => void;
  dynamicCategories?: string[];
  dynamicLocations?: string[];
  priceMin?: number;
  priceMax?: number;
}

// TourDetailClient props 타입
interface TourDetailClientProps {
  tourData: unknown;
  tourId: string;
}

// 로딩 스켈레톤 컴포넌트
const DefaultFallback = ({ className }: { className?: string }) => (
  <div className={cn('animate-pulse', className)}>
    <div className="bg-gray-200 rounded-lg h-48 w-full"></div>
  </div>
);

// 제네릭 lazy 컴포넌트 래퍼
// eslint-disable-next-line react-refresh/only-export-components
export function createLazyComponent<T extends object = object>(
  importFunc: () => Promise<{ default: ComponentType<T> }>,
  fallback?: React.ReactNode,
) {
  const LazyComponent = lazy(importFunc);

  return function WrappedLazyComponent(props: T & LazyComponentProps) {
    const { fallback: customFallback, className, ...componentProps } = props;

    return (
      <Suspense
        fallback={
          customFallback ||
          fallback || <DefaultFallback className={className} />
        }
      >
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <LazyComponent {...(componentProps as any)} />
      </Suspense>
    );
  };
}

// 특정 컴포넌트들을 위한 lazy 래퍼들
export const LazyActivityCard = createLazyComponent(
  () =>
    import('@/features/activity/components/ActivityCard').then(module => ({
      default: module.ActivityCard,
    })),
  <div className="animate-pulse bg-gray-200 rounded-lg h-64 w-full" />,
);

export const LazyProductFilters = createLazyComponent<ProductFiltersProps>(
  () =>
    import('@/components/products/ProductFilters').then(module => ({
      default: module.ProductFilters,
    })),
  <div className="animate-pulse bg-gray-200 rounded-lg h-32 w-full" />,
);

export const LazyTourDetail = createLazyComponent<TourDetailClientProps>(
  () =>
    import('@/app/tour/[id]/TourDetailClient').then(module => ({
      default: module.default,
    })),
  <div className="animate-pulse bg-gray-200 rounded-lg h-96 w-full" />,
);
