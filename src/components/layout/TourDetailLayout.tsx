'use client';

import { AppHeader } from '@/components/shared/AppHeader';
import { ReactNode, useState, useEffect } from 'react';

interface Section {
  id: string;
  label: string;
}

interface TourDetailLayoutProps {
  children: ReactNode;
  title: string;
  sections: Section[];
  activeSection: string;
  onSectionClick: (sectionId: string) => void;
  className?: string;
}

export function TourDetailLayout({
  children,
  title,
  sections,
  activeSection,
  onSectionClick,
  className = 'min-h-screen bg-white',
}: TourDetailLayoutProps) {
  const [showStickyHeader, setShowStickyHeader] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const triggerPoint = 50;
      const shouldShow = scrollY > triggerPoint;
      setShowStickyHeader(shouldShow);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // 초기 상태 설정

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const stickyNavigationContent = (
    <div className="max-w-7xl mx-auto px-4 py-3">
      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        {sections.map(section => (
          <button
            key={section.id}
            onClick={() => onSectionClick(section.id)}
            className={`relative px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
              activeSection === section.id
                ? 'text-[#01c5fd]'
                : 'text-gray-600 hover:text-[#01c5fd]'
            }`}
          >
            {section.label}
            <span
              className={`absolute left-0 right-0 -bottom-px h-0.5 transition-all ${
                activeSection === section.id ? 'bg-[#01c5fd]' : 'bg-transparent'
              }`}
            ></span>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className={className}>
      {/* GNB - fixed로 설정 */}
      <AppHeader active={undefined} mobileTitle={title} />

      {/* 스크롤 시 나타나는 메뉴탭 네비게이션 */}
      {showStickyHeader && (
        <div className="fixed top-16 left-0 right-0 z-40 bg-white border-b shadow-sm">
          {stickyNavigationContent}
        </div>
      )}

      {/* GNB 아래 여백 + 대표이미지와의 간격(16px) */}
      <div
        className={`transition-all duration-200 ${showStickyHeader ? 'sticky-nav-spacing' : 'header-spacing'} mb-4`}
      ></div>

      {children}
    </div>
  );
}
