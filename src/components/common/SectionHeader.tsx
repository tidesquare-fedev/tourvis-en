'use client';

import Link from 'next/link';
import { ReactNode } from 'react';

interface SectionHeaderProps {
  /** 섹션 제목 */
  title: string;
  /** 부제목 (선택사항) */
  subtitle?: string;
  /** "더보기" 링크 URL (선택사항) */
  viewMoreHref?: string;
  /** "더보기" 링크 텍스트 (기본값: "View more") */
  viewMoreText?: string;
  /** 추가 클래스명 */
  className?: string;
  /** 제목 레벨 (h1, h2, h3, h4, h5, h6) */
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  /** 커스텀 액션 요소 */
  actions?: ReactNode;
}

/**
 * 섹션 헤더를 표시하는 재사용 가능한 컴포넌트
 * 제목, 부제목, 더보기 링크를 포함할 수 있음
 *
 * @example
 * ```tsx
 * <SectionHeader
 *   title="인기 상품"
 *   subtitle="고객들이 가장 많이 선택한 상품들"
 *   viewMoreHref="/products"
 *   viewMoreText="전체 보기"
 * />
 * ```
 */
export function SectionHeader({
  title,
  subtitle,
  viewMoreHref,
  viewMoreText = 'View more',
  className = '',
  level = 2,
  actions,
}: SectionHeaderProps) {
  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
  const titleClassName = `text-xl sm:text-2xl font-bold ${className}`;

  return (
    <div className="flex items-baseline justify-between mb-4 sm:mb-6">
      <div className="flex-1">
        <HeadingTag className={titleClassName}>{title}</HeadingTag>
        {subtitle && (
          <p className="text-sm sm:text-base text-gray-600 mt-1">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-4">
        {actions}
        {viewMoreHref && (
          <Link
            href={viewMoreHref}
            className="text-blue-600 text-sm sm:text-base hover:underline whitespace-nowrap"
          >
            {viewMoreText}
          </Link>
        )}
      </div>
    </div>
  );
}
