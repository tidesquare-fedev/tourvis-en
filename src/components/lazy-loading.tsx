'use client'

import { Suspense, lazy, ComponentType } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

// 로딩 스피너 컴포넌트
function LoadingSpinner({ message = '로딩 중...' }: { message?: string }) {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-blue-500" />
        <p className="text-sm text-gray-500">{message}</p>
      </div>
    </div>
  )
}

// 카드 형태의 로딩 스켈레톤
function CardSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
        </div>
      </CardContent>
    </Card>
  )
}

// 리스트 형태의 로딩 스켈레톤
function ListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  )
}

// Lazy Loading 래퍼 컴포넌트
interface LazyWrapperProps {
  fallback?: React.ReactNode
  errorFallback?: React.ReactNode
}

export function withLazyLoading<P extends Record<string, any>>(
  importFunc: () => Promise<{ default: ComponentType<P> }>,
  options: LazyWrapperProps = {}
) {
  const LazyComponent = lazy(importFunc)
  
  return function LazyWrapper(props: P) {
    return (
      <Suspense fallback={options.fallback || <LoadingSpinner />}>
        <LazyComponent {...props} />
      </Suspense>
    )
  }
}

// 관리자 페이지용 Lazy Loading
export const LazyAdminDashboard = withLazyLoading(
  () => import('@/app/admin/page'),
  {
    fallback: <LoadingSpinner message="관리자 대시보드를 불러오는 중..." />
  }
)

// 문의 상세 페이지용 Lazy Loading
export const LazyInquiryDetail = withLazyLoading(
  () => import('@/components/admin/InquiryDetail'),
  {
    fallback: <CardSkeleton />
  }
)

// 문의 목록용 Lazy Loading
export const LazyInquiryList = withLazyLoading(
  () => import('@/components/admin/InquiryList'),
  {
    fallback: <ListSkeleton count={5} />
  }
)

// 계정 관리용 Lazy Loading
export const LazyAccountManagement = withLazyLoading(
  () => import('@/components/admin/AccountManagement'),
  {
    fallback: <CardSkeleton />
  }
)

// 이미지 Lazy Loading 컴포넌트
interface LazyImageProps {
  src: string
  alt: string
  className?: string
  placeholder?: string
}

export function LazyImage({ src, alt, className, placeholder }: LazyImageProps) {
  return (
    <Suspense fallback={
      <div className={`bg-gray-200 animate-pulse ${className}`}>
        {placeholder && <span className="text-gray-400 text-sm">{placeholder}</span>}
      </div>
    }>
      <img
        src={src}
        alt={alt}
        className={className}
        loading="lazy"
        onError={(e) => {
          const target = e.target as HTMLImageElement
          target.src = '/placeholder.svg'
        }}
      />
    </Suspense>
  )
}

// 코드 스플리팅을 위한 동적 import 헬퍼
export function createLazyComponent<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: React.ReactNode
) {
  const LazyComponent = lazy(importFunc)
  
  return function WrappedComponent(props: React.ComponentProps<T>) {
    return (
      <Suspense fallback={fallback || <LoadingSpinner />}>
        <LazyComponent {...(props as any)} />
      </Suspense>
    )
  }
}

export { LoadingSpinner, CardSkeleton, ListSkeleton }
