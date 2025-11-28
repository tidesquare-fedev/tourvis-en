'use client';

import { AppHeader } from '@/components/shared/AppHeader';
import { ReactNode } from 'react';

interface PageLayoutProps {
  children: ReactNode;
  active?: 'tours' | 'inquiry' | 'reservation';
  mobileTitle?: string;
  className?: string;
  showStickyNavigation?: boolean;
  stickyNavigationContent?: ReactNode;
}

export function PageLayout({
  children,
  active,
  mobileTitle,
  className = 'min-h-screen bg-white',
  showStickyNavigation = false,
  stickyNavigationContent,
}: PageLayoutProps) {
  return (
    <div className={className}>
      {/* GNB - fixed로 설정 */}
      <AppHeader active={active} mobileTitle={mobileTitle} />

      {/* 스크롤 시 나타나는 메뉴탭 네비게이션 (상세 페이지 전용) */}
      {showStickyNavigation && stickyNavigationContent && (
        <div className="fixed top-16 left-0 right-0 z-40 bg-white border-b shadow-sm">
          {stickyNavigationContent}
        </div>
      )}

      {/* GNB 아래 여백 - 메뉴 네비게이션 고려 */}
      <div
        className={`transition-all duration-200 ${showStickyNavigation ? 'h-20' : 'h-16'}`}
      ></div>

      {children}
    </div>
  );
}
