'use client'

import { useMemo, useCallback } from 'react'
import { ProductFilters } from '@/components/products/ProductFilters'
import { AppHeader } from '@/components/shared/AppHeader'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { useDerivedFilters } from '@/features/activity/hooks/useDerivedFilters'
import { ActivityCard } from '@/features/activity/components/ActivityCard'
import type { ProductItem } from '@/features/activity/types'
import { useFiltersState } from '@/features/activity/hooks/useFiltersState'

export default function SearchPageClient({ items }: { items: ProductItem[] }) {
  const { categories: dynamicCategories, locations: dynamicLocations, price: priceBounds } = useDerivedFilters(items)
  const { filters, replace } = useFiltersState({ initialPriceMin: priceBounds.min, initialPriceMax: priceBounds.max })

  const handleFiltersChange = useCallback((next: typeof filters) => replace(next), [replace])

  const filtered = useMemo(() => {
    return items.filter((it) => {
      const locationMatch = filters.locations.length === 0 || filters.locations.includes(it.location || '')
      const categoryMatch = !filters.category || (it.category || '') === filters.category
      const price = typeof it.price === 'number' ? it.price : Number.MAX_SAFE_INTEGER
      const priceMatch = price >= filters.priceRange[0] && price <= filters.priceRange[1]
      return locationMatch && categoryMatch && priceMatch
    })
  }, [items, filters])

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <AppHeader active="tours" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SectionHeader title="All Tours" subtitle="Explore Tours, Tickets & Activities" />

        <div className="md:hidden mb-6">
          <ProductFilters filters={filters} onFiltersChange={handleFiltersChange} dynamicCategories={dynamicCategories} dynamicLocations={dynamicLocations} priceMin={priceBounds.min} priceMax={priceBounds.max} />
        </div>

        <div className="grid grid-cols-12 gap-6">
          <aside className="hidden md:block md:col-span-3">
            <div className="md:sticky md:top-24">
              <ProductFilters filters={filters} onFiltersChange={handleFiltersChange} dynamicCategories={dynamicCategories} dynamicLocations={dynamicLocations} priceMin={priceBounds.min} priceMax={priceBounds.max} />
            </div>
          </aside>

          <div className="col-span-12 md:col-span-9">
            <div className="mb-6"><p className="text-gray-600">{filtered.length} tours found</p></div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3 sm:gap-6">
              {filtered.map((it) => (
                <ActivityCard key={it.id} item={it as any} />
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


