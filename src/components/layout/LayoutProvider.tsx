'use client'

import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'
import { PageLayout } from './PageLayout'
import { TourDetailLayout } from './TourDetailLayout'
import { AppHeader } from '@/components/shared/AppHeader'

interface LayoutProviderProps {
  children: ReactNode
  // Tour detail specific props
  tourTitle?: string
  sections?: Array<{ id: string; label: string }>
  activeSection?: string
  onSectionClick?: (sectionId: string) => void
}

export function LayoutProvider({ 
  children, 
  tourTitle, 
  sections, 
  activeSection, 
  onSectionClick 
}: LayoutProviderProps) {
  const pathname = usePathname()
  
  // Tour detail page detection
  const isTourDetailPage = /\/tour\/\[id\]/.test(pathname) || /\/tour\/[^\/]+$/.test(pathname)
  
  // Determine active navigation based on pathname
  const getActiveNav = () => {
    if (pathname.startsWith('/activity/search') || pathname.startsWith('/products')) {
      return 'tours'
    }
    if (pathname.startsWith('/inquiry')) {
      return 'inquiry'
    }
    if (pathname.startsWith('/reservation')) {
      return 'reservation'
    }
    // 메인 페이지와 상품 상세 페이지에서는 비활성화
    return undefined
  }
  
  // Determine background class based on pathname
  const getBackgroundClass = () => {
    if (pathname.startsWith('/activity/search') || pathname.startsWith('/products')) {
      return 'min-h-screen bg-gradient-to-b from-blue-50 to-white'
    }
    return 'min-h-screen bg-white'
  }
  
  if (isTourDetailPage && tourTitle && sections && activeSection) {
    return (
      <TourDetailLayout
        title={tourTitle}
        sections={sections}
        activeSection={activeSection}
        onSectionClick={onSectionClick}
        className={getBackgroundClass()}
      >
        {children}
      </TourDetailLayout>
    )
  }
  
  return (
    <div className={getBackgroundClass()}>
      {/* GNB - fixed로 설정 */}
      <AppHeader active={getActiveNav()} />
      
      {/* GNB 아래 여백 */}
      <div className="h-16"></div>
      
      {children}
    </div>
  )
}
