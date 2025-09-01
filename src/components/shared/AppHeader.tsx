'use client'

import Link from 'next/link'
import SearchBox from '@/components/shared/SearchBox'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useEffect, useState } from 'react'

export function AppHeader({ active, mobileTitle }: { active?: 'tours' | 'inquiry' | 'reservation'; mobileTitle?: string }) {
  const pathname = usePathname()
  const router = useRouter()
  const isHome = pathname === '/' || pathname === '/en'
  const [isMobile, setIsMobile] = useState(false)
  const [showStickyTitle, setShowStickyTitle] = useState(false)
  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      setIsMobile(/Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent))
    }
  }, [])
  useEffect(() => {
    const onScroll = () => {
      // threshold: when user scrolls down a bit, swap logo → title
      setShowStickyTitle(window.scrollY > 40)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  const showMobileSearch = pathname === '/' || pathname === '/activity/search' || pathname === '/en' || pathname === '/en/activity/search'
  const isDetailPage = /\/tour\//.test(pathname)
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white backdrop-blur supports-[backdrop-filter]:bg-white/95 shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center gap-3 sm:gap-6">
          <div className="md:hidden">
            {isMobile && !isHome && (
              <Button variant="ghost" size="icon" aria-label="Back" onClick={() => router.back()}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
          </div>
          {!isDetailPage || !isMobile ? (
            <Link href="/">
              <span className="logo h-6 sm:h-8 w-24 sm:w-28" role="img" aria-label="TOURVIS" />
            </Link>
          ) : (
            <div className="truncate text-sm font-medium text-gray-900">
              {showStickyTitle && mobileTitle ? mobileTitle : (
                <span className="logo h-6 w-24 inline-block align-middle" role="img" aria-label="TOURVIS" />
              )}
            </div>
          )}
          <div className="flex-1 hidden md:block">
            <SearchBox />
          </div>
          <nav className={`ml-auto items-center gap-3 sm:gap-6 text-gray-600 ${isDetailPage ? 'hidden md:flex' : 'flex'}`}>
            <Link href="/activity/search" className={`text-xs sm:text-sm hover:text-blue-600 ${active === 'tours' ? 'text-blue-600 font-medium' : ''}`}>Tours</Link>
            <Link href="/inquiry-list" className={`text-xs sm:text-sm hover:text-blue-600 ${active === 'inquiry' ? 'text-blue-600 font-medium' : ''}`}>Inquiry</Link>
            <Link href="/reservation-lookup" className={`text-xs sm:text-sm hover:text-blue-600 ${active === 'reservation' ? 'text-blue-600 font-medium' : ''}`}>Reservations</Link>
          </nav>
        </div>
        {showMobileSearch && (
          <div className="mt-2 md:hidden">
            <SearchBox />
          </div>
        )}
      </div>
    </header>
  )
}


