'use client'

import Link from 'next/link'
import SearchBox from '@/components/shared/SearchBox'

export function AppHeader({ active }: { active?: 'tours' | 'inquiry' | 'reservation' }) {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center gap-3 sm:gap-6">
          <Link href="/">
            <span className="logo h-6 sm:h-8 w-24 sm:w-28" role="img" aria-label="TOURVIS" />
          </Link>
          <div className="flex-1 hidden md:block">
            <SearchBox />
          </div>
          <nav className="flex items-center space-x-3 sm:space-x-6">
            <Link href="/activity/search" className={`text-xs sm:text-sm ${active === 'tours' ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-blue-600 transition-colors'}`}>Tours</Link>
            <Link href="/inquiry-list" className={`text-xs sm:text-sm ${active === 'inquiry' ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-blue-600 transition-colors'}`}>Direct Inquiry</Link>
            <Link href="/reservation-lookup" className={`text-xs sm:text-sm ${active === 'reservation' ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-blue-600 transition-colors'}`}>Reservations</Link>
          </nav>
        </div>
      </div>
    </header>
  )
}


