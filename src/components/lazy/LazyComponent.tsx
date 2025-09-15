'use client'

import { Suspense, ComponentType, lazy } from 'react'
import { cn } from '@/lib/utils'

interface LazyComponentProps {
  fallback?: React.ReactNode
  className?: string
}

// 로딩 스켈레톤 컴포넌트
const DefaultFallback = ({ className }: { className?: string }) => (
  <div className={cn('animate-pulse', className)}>
    <div className="bg-gray-200 rounded-lg h-48 w-full"></div>
  </div>
)

// 제네릭 lazy 컴포넌트 래퍼
export function createLazyComponent<T = {}>(
  importFunc: () => Promise<{ default: ComponentType<T> }>,
  fallback?: React.ReactNode
) {
  const LazyComponent = lazy(importFunc)

  return function WrappedLazyComponent(props: T & LazyComponentProps) {
    const { fallback: customFallback, className, ...componentProps } = props as any

    return (
      <Suspense fallback={customFallback || fallback || <DefaultFallback className={className} />}>
        <LazyComponent {...(componentProps as any)} />
      </Suspense>
    )
  }
}

// 특정 컴포넌트들을 위한 lazy 래퍼들
export const LazyActivityCard = createLazyComponent(
  () => import('@/features/activity/components/ActivityCard').then(module => ({ default: module.ActivityCard })),
  <div className="animate-pulse bg-gray-200 rounded-lg h-64 w-full" />
)

export const LazyProductFilters = createLazyComponent(
  () => import('@/components/products/ProductFilters').then(module => ({ default: module.ProductFilters })),
  <div className="animate-pulse bg-gray-200 rounded-lg h-32 w-full" />
)

export const LazyTourDetail = createLazyComponent(
  () => import('@/app/tour/[id]/TourDetailClient').then(module => ({ default: module.default })),
  <div className="animate-pulse bg-gray-200 rounded-lg h-96 w-full" />
)
