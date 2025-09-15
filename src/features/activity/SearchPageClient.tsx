'use client'

import { useMemo, useCallback } from 'react'
import { ProductFilters } from '@/components/products/ProductFilters'
import { LayoutProvider } from '@/components/layout/LayoutProvider'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { useDerivedFilters } from '@/features/activity/hooks/useDerivedFilters'
import type { ProductItem } from '@/features/activity/types'
import { useFiltersState } from '@/features/activity/hooks/useFiltersState'
import { useProducts } from '@/hooks/useProducts'
import { SearchResults } from '@/features/activity/components/SearchResults'

export default function SearchPageClient({ items, providerIds, keyword }: { items: ProductItem[]; providerIds?: string; keyword?: string }) {
  const query = useProducts(providerIds || '', keyword)
  const itemsSource = (providerIds && query.data?.items && query.data.items.length > 0) ? query.data.items : items
  const { categories: dynamicCategories, locations: dynamicLocations, price: priceBounds } = useDerivedFilters(items)
  const { filters, replace } = useFiltersState({ initialPriceMin: priceBounds.min, initialPriceMax: priceBounds.max })

  const handleFiltersChange = useCallback((next: typeof filters) => replace(next), [replace])

  const filtered = useMemo(() => {
    return itemsSource.filter((it) => {
      const locationMatch = filters.locations.length === 0 || filters.locations.includes(it.location || '')
      const categoryMatch = !filters.category || (it.category || '') === filters.category
      const priceValue = typeof it.price === 'number' ? it.price : null
      const priceMatch = priceValue !== null && priceValue >= filters.priceRange[0] && priceValue <= filters.priceRange[1]
      return locationMatch && categoryMatch && priceMatch
    })
  }, [itemsSource, filters])

  return (
    <LayoutProvider>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SectionHeader title="All Tours" subtitle="Explore Tours, Tickets & Activities" />

        {/* 필터를 상품 목록 위쪽으로 배치 */}
        <div className="mb-6">
          <ProductFilters 
            filters={filters} 
            onFiltersChange={handleFiltersChange} 
            dynamicCategories={dynamicCategories} 
            dynamicLocations={dynamicLocations} 
            priceMin={priceBounds.min} 
            priceMax={priceBounds.max} 
          />
        </div>

        {/* 검색 결과 */}
        <SearchResults
          items={filtered}
          isLoading={query.isLoading}
          totalCount={filtered.length}
        />
      </div>
    </LayoutProvider>
  )
}


