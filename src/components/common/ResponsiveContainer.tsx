'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ResponsiveContainerProps {
  /** 컨테이너 내용 */
  children: ReactNode
  /** 최대 너비 클래스 (기본값: 'max-w-7xl') */
  maxWidth?: string
  /** 패딩 클래스 (기본값: 'px-4 sm:px-6 lg:px-8') */
  padding?: string
  /** 추가 클래스명 */
  className?: string
  /** 세로 패딩 클래스 (기본값: 'py-6 sm:py-10') */
  verticalPadding?: string
  /** 배경색 클래스 */
  backgroundColor?: string
}

/**
 * 반응형 컨테이너를 제공하는 재사용 가능한 컴포넌트
 * 일관된 최대 너비, 패딩, 마진을 적용
 * 
 * @example
 * ```tsx
 * <ResponsiveContainer>
 *   <h1>제목</h1>
 *   <p>내용</p>
 * </ResponsiveContainer>
 * ```
 */
export function ResponsiveContainer({
  children,
  maxWidth = 'max-w-7xl',
  padding = 'px-4 sm:px-6 lg:px-8',
  verticalPadding = 'py-6 sm:py-10',
  backgroundColor,
  className
}: ResponsiveContainerProps) {
  return (
    <div 
      className={cn(
        'mx-auto',
        maxWidth,
        padding,
        verticalPadding,
        backgroundColor,
        className
      )}
    >
      {children}
    </div>
  )
}
