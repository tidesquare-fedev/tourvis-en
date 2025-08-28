'use client'

import Link from 'next/link'
import SearchBox from '@/components/shared/SearchBox'
import { usePathname } from 'next/navigation'

export function AppHeader({ active }: { active?: 'tours' | 'inquiry' | 'reservation' }) {
  const pathname = usePathname()
  const showMobileSearch = pathname === '/' || pathname === '/activity/search' || pathname === '/en' || pathname === '/en/activity/search'
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/75 shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center gap-3 sm:gap-6">
          <Link href="/">
            <span className="logo h-6 sm:h-8 w-24 sm:w-28" role="img" aria-label="TOURVIS" />
          </Link>
          <div className="flex-1 hidden md:block">
            <SearchBox />
          </div>
          <nav className="ml-auto flex items-center gap-3 sm:gap-6 text-gray-600">
            <Link href="/activity/search" className={`text-xs sm:text-sm hover:text-blue-600 ${active === 'tours' ? 'text-blue-600 font-medium' : ''}`}>Tours</Link>
            <Link href="/inquiry-list" className={`text-xs sm:text-sm hover:text-blue-600 ${active === 'inquiry' ? 'text-blue-600 font-medium' : ''}`}>Direct Inquiry</Link>
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


