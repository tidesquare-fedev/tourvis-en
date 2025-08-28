"use client"

import { useMemo } from 'react'
import { AppHeader } from '@/components/shared/AppHeader'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { ProductFilters } from '@/components/products/ProductFilters'
import { ActivityCard } from '@/features/activity/components/ActivityCard'
import { useFiltersState } from '@/features/activity/hooks/useFiltersState'

type DemoItem = { id: string; title: string; image: string; originalPrice: number; discountRate: number; price: number; rating: number; reviewCount: number; location: string; category: string }

export default function ProductsPage() {

  const allTours: DemoItem[] = [
    { id: 'jeju-hallasan-hiking', title: 'Jeju Hallasan Mountain Sunrise Hiking Tour', image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=400&q=80', originalPrice: 120, discountRate: 26, price: 89, rating: 4.8, reviewCount: 324, location: 'Jeju', category: 'Adventure' },
    { id: 'seoul-palace-tour', title: 'Seoul Royal Palace & Traditional Culture Tour', image: 'https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?auto=format&fit=crop&w=400&q=80', originalPrice: 85, discountRate: 24, price: 65, rating: 4.7, reviewCount: 156, location: 'Seoul', category: 'Cultural' },
    { id: 'busan-coastal-tour', title: 'Busan Coastal Scenic Tour & Temple Visit', image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=400&q=80', originalPrice: 95, discountRate: 21, price: 75, rating: 4.9, reviewCount: 289, location: 'Busan', category: 'Nature' },
  ]

  const dynamicCategories = useMemo(() => Array.from(new Set(allTours.map(t => t.category))), [allTours])
  const dynamicLocations = useMemo(() => Array.from(new Set(allTours.map(t => t.location))), [allTours])

  const priceMin = useMemo(() => Math.min(...allTours.map(t => t.price)), [allTours])
  const priceMax = useMemo(() => Math.max(...allTours.map(t => t.price)), [allTours])
  const { filters, replace } = useFiltersState({ initialPriceMin: priceMin, initialPriceMax: priceMax })

  const filteredTours = useMemo(() => {
    return allTours.filter((tour) => {
      const locationMatch = filters.locations.length === 0 || filters.locations.includes(tour.location)
      const categoryMatch = !filters.category || tour.category === filters.category
      const priceMatch = tour.price >= filters.priceRange[0] && tour.price <= filters.priceRange[1]
      return locationMatch && categoryMatch && priceMatch
    })
  }, [allTours, filters])

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <AppHeader active="tours" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SectionHeader title="All Tours" subtitle="Explore Tours, Tickets & Activities" />

        <div className="md:hidden mb-6">
          <ProductFilters filters={filters} onFiltersChange={replace} dynamicCategories={dynamicCategories} dynamicLocations={dynamicLocations} priceMin={priceMin} priceMax={priceMax} />
        </div>

        <div className="grid grid-cols-12 gap-6">
          <aside className="hidden md:block md:col-span-3">
            <div className="md:sticky md:top-24">
              <ProductFilters filters={filters} onFiltersChange={replace} dynamicCategories={dynamicCategories} dynamicLocations={dynamicLocations} priceMin={priceMin} priceMax={priceMax} />
            </div>
          </aside>

          <div className="col-span-12 md:col-span-9">
            <div className="mb-6"><p className="text-gray-600">{filteredTours.length} tours found</p></div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6">
              {filteredTours.map((tour) => (
                <ActivityCard key={tour.id} item={{ id: tour.id, title: tour.title, image: tour.image, price: tour.price, originalPrice: tour.originalPrice, discountRate: tour.discountRate, rating: tour.rating, reviewCount: tour.reviewCount, location: tour.location, category: tour.category }} />
              ))}
            </div>

            {filteredTours.length === 0 && (
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

