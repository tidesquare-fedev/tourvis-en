/**
 * Skeleton UI 컴포넌트
 * 로딩 상태를 표시하는 스켈레톤 컴포넌트들
 */

import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 애니메이션 활성화 여부 */
  animate?: boolean;
  /** 반올림 정도 */
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** 높이 */
  height?: string | number;
  /** 너비 */
  width?: string | number;
}

/**
 * 기본 스켈레톤 컴포넌트
 */
export function Skeleton({
  className,
  animate = true,
  rounded = 'md',
  height,
  width,
  style,
  ...props
}: SkeletonProps) {
  const roundedClass = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full',
  }[rounded];

  return (
    <div
      className={cn(
        'bg-gray-200 dark:bg-gray-700',
        roundedClass,
        animate && 'animate-pulse',
        className,
      )}
      style={{
        height: height,
        width: width,
        ...style,
      }}
      {...props}
    />
  );
}

/**
 * 제품 카드 스켈레톤
 */
export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
      <Skeleton height={200} className="w-full" />
      <div className="p-4 space-y-3">
        <Skeleton height={20} width="80%" />
        <Skeleton height={16} width="60%" />
        <div className="flex items-center space-x-2">
          <Skeleton height={16} width={60} />
          <Skeleton height={16} width={40} />
        </div>
        <Skeleton height={24} width="50%" />
      </div>
    </div>
  );
}

/**
 * 제품 그리드 스켈레톤
 */
export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * 캐러셀 스켈레톤
 */
export function CarouselSkeleton({
  itemCount = 4,
  showArrows = true,
}: {
  itemCount?: number;
  showArrows?: boolean;
}) {
  return (
    <div className="w-full">
      <div className="flex space-x-4 overflow-hidden">
        {Array.from({ length: itemCount }).map((_, i) => (
          <div key={i} className="flex-shrink-0 w-1/4">
            <ProductCardSkeleton />
          </div>
        ))}
      </div>
      {showArrows && (
        <div className="flex justify-center mt-4 space-x-2">
          <Skeleton height={32} width={32} rounded="full" />
          <Skeleton height={32} width={32} rounded="full" />
        </div>
      )}
    </div>
  );
}

/**
 * 리뷰 스켈레톤
 */
export function ReviewSkeleton() {
  return (
    <div className="border-b border-gray-200 dark:border-gray-700 py-4">
      <div className="flex items-center space-x-3 mb-3">
        <Skeleton height={40} width={40} rounded="full" />
        <div className="space-y-2">
          <Skeleton height={16} width={120} />
          <div className="flex space-x-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} height={16} width={16} />
            ))}
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton height={16} width="100%" />
        <Skeleton height={16} width="80%" />
        <Skeleton height={16} width="60%" />
      </div>
    </div>
  );
}

/**
 * 리뷰 목록 스켈레톤
 */
export function ReviewListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-0">
      {Array.from({ length: count }).map((_, i) => (
        <ReviewSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * 테이블 스켈레톤
 */
export function TableSkeleton({
  rows = 5,
  columns = 4,
}: {
  rows?: number;
  columns?: number;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="bg-gray-50 dark:bg-gray-800 px-6 py-3">
        <div className="flex space-x-4">
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton key={i} height={20} width={100} />
          ))}
        </div>
      </div>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="px-6 py-4">
            <div className="flex space-x-4">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <Skeleton key={colIndex} height={16} width={80} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * 폼 스켈레톤
 */
export function FormSkeleton({ fieldCount = 4 }: { fieldCount?: number }) {
  return (
    <div className="space-y-6">
      {Array.from({ length: fieldCount }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton height={16} width={100} />
          <Skeleton height={40} width="100%" />
        </div>
      ))}
      <div className="flex space-x-4">
        <Skeleton height={40} width={100} />
        <Skeleton height={40} width={100} />
      </div>
    </div>
  );
}

/**
 * 네비게이션 스켈레톤
 */
export function NavigationSkeleton() {
  return (
    <div className="flex items-center space-x-6">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} height={20} width={80} />
      ))}
    </div>
  );
}

/**
 * 사이드바 스켈레톤
 */
export function SidebarSkeleton() {
  return (
    <div className="w-64 space-y-4 p-4">
      <Skeleton height={32} width="100%" />
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} height={24} width="80%" />
        ))}
      </div>
    </div>
  );
}

/**
 * 대시보드 스켈레톤
 */
export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700"
          >
            <Skeleton height={20} width={100} className="mb-2" />
            <Skeleton height={32} width={60} />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <Skeleton height={24} width={200} className="mb-4" />
          <Skeleton height={200} width="100%" />
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <Skeleton height={24} width={200} className="mb-4" />
          <TableSkeleton rows={5} columns={3} />
        </div>
      </div>
    </div>
  );
}
