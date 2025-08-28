'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { MapPin, Star } from 'lucide-react'
import { ProductFilters } from '@/components/products/ProductFilters'
import SearchBox from '@/components/shared/SearchBox'

type Item = {
  id: string
  title: string
  image?: string | null
  price?: number | null
  originalPrice?: number | null
  discountRate?: number | null
  rating?: number | null
  reviewCount?: number | null
  location?: string | null
  category?: string | null
}

export default function SearchPageClient({ items }: { items: Item[] }) {
  const [filters, setFilters] = useState({ location: '', category: '', priceRange: [0, 99999999] as [number, number] })

  const dynamicCategories = useMemo(() => {
    const set = new Set<string>()
    for (const it of items) {
      if (it.category) set.add(it.category)
    }
    return Array.from(set)
  }, [items])

  const dynamicLocations = useMemo(() => {
    const set = new Set<string>()
    for (const it of items) {
      if (it.location) set.add(it.location)
    }
    return Array.from(set)
  }, [items])

  const filtered = useMemo(() => {
    return items.filter((it) => {
      const locationMatch = !filters.location || (it.location || '') === filters.location
      const categoryMatch = !filters.category || (it.category || '') === filters.category
      const price = typeof it.price === 'number' ? it.price : Number.MAX_SAFE_INTEGER
      const priceMatch = price >= filters.priceRange[0] && price <= filters.priceRange[1]
      return locationMatch && categoryMatch && priceMatch
    })
  }, [items, filters])

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
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
              <Link href="/activity/search" className="text-xs sm:text-sm text-blue-600 font-medium">Tours</Link>
              <Link href="/inquiry-list" className="text-xs sm:text-sm text-gray-600 hover:text-blue-600 transition-colors">Direct Inquiry</Link>
              <Link href="/reservation-lookup" className="text-xs sm:text-sm text-gray-600 hover:text-blue-600 transition-colors">Reservations</Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">All Tours</h1>
          <p className="text-gray-600">Discover amazing experiences</p>
        </div>

        <div className="md:hidden mb-6">
          <ProductFilters filters={filters} onFiltersChange={setFilters} dynamicCategories={dynamicCategories} dynamicLocations={dynamicLocations} />
        </div>

        <div className="grid grid-cols-12 gap-6">
          <aside className="hidden md:block md:col-span-3">
            <div className="md:sticky md:top-24">
              <ProductFilters filters={filters} onFiltersChange={setFilters} dynamicCategories={dynamicCategories} dynamicLocations={dynamicLocations} />
            </div>
          </aside>

          <div className="col-span-12 md:col-span-9">
            <div className="mb-6">
              <p className="text-gray-600">{filtered.length} tours found</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6">
              {filtered.map((it) => (
                <Link key={it.id} href={`/activity/product/${encodeURIComponent(it.id)}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer h-full">
                    <div className="relative h-40 sm:h-48 overflow-hidden">
                      {it.image && <img src={it.image} alt={it.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />}
                    </div>
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex items-center text-xs sm:text-sm text-gray-600 mb-2">
                        <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        <span className="truncate">{it.category || '—'}{it.location ? ` · ${it.location}` : ''}</span>
                      </div>
                      <h3 className="font-semibold text-sm sm:text-base mb-2 line-clamp-2 leading-tight">{it.title}</h3>
                      {typeof it.rating === 'number' && it.rating > 0 && typeof it.reviewCount === 'number' && it.reviewCount > 0 && (
                        <div className="flex items-center text-xs sm:text-sm text-yellow-600 mb-3">
                          <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-1 fill-current" />
                          {it.rating.toFixed(1)} ({it.reviewCount})
                        </div>
                      )}
                      <div className="space-y-1">
                        {typeof it.discountRate === 'number' && it.discountRate > 0 && typeof it.originalPrice === 'number' && (
                          <div className="text-xs sm:text-sm text-gray-500 line-through">${it.originalPrice}</div>
                        )}
                        <div className="flex items-center gap-2">
                          {typeof it.discountRate === 'number' && it.discountRate > 0 && (
                            <span className="text-xs sm:text-sm font-bold text-red-500">{it.discountRate}% OFF</span>
                          )}
                          {typeof it.price === 'number' && (
                            <div className="text-lg sm:text-xl font-bold text-blue-600">${it.price}</div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No tours match your current filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}


