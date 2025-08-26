'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { MapPin, Star } from 'lucide-react'
import { ProductFilters } from '@/components/products/ProductFilters'

export default function ProductsPage() {
  const [filters, setFilters] = useState({ location: '', category: '', priceRange: [0, 200] as [number, number] })

  const allTours = [
    { id: 'jeju-hallasan-hiking', title: 'Jeju Hallasan Mountain Sunrise Hiking Tour', image: 'photo-1469474968028-56623f02e42e', originalPrice: 120, discountRate: 26, price: 89, rating: 4.8, reviewCount: 324, location: 'Jeju', category: 'Adventure' },
    { id: 'seoul-palace-tour', title: 'Seoul Royal Palace & Traditional Culture Tour', image: 'photo-1482938289607-e9573fc25ebb', originalPrice: 85, discountRate: 24, price: 65, rating: 4.7, reviewCount: 156, location: 'Seoul', category: 'Cultural' },
    { id: 'busan-coastal-tour', title: 'Busan Coastal Scenic Tour & Temple Visit', image: 'photo-1470071459604-3b5ec3a7fe05', originalPrice: 95, discountRate: 21, price: 75, rating: 4.9, reviewCount: 289, location: 'Busan', category: 'Nature' },
    { id: 'gyeongju-history-tour', title: 'Gyeongju Historical Sites Full Day Tour', image: 'photo-1426604966848-d7adac402bff', originalPrice: 110, discountRate: 18, price: 90, rating: 4.6, reviewCount: 201, location: 'Gyeongju', category: 'Cultural' },
    { id: 'dmz-tour', title: 'DMZ & Joint Security Area Tour from Seoul', image: 'photo-1469474968028-56623f02e42e', originalPrice: 80, discountRate: 15, price: 68, rating: 4.5, reviewCount: 445, location: 'Seoul', category: 'Historical' },
    { id: 'nami-island-tour', title: 'Nami Island & Petite France Day Tour', image: 'photo-1482938289607-e9573fc25ebb', originalPrice: 70, discountRate: 20, price: 56, rating: 4.7, reviewCount: 332, location: 'Gapyeong', category: 'Nature' },
    { id: 'andong-village-tour', title: 'Andong Hahoe Folk Village Cultural Tour', image: 'photo-1470071459604-3b5ec3a7fe05', originalPrice: 90, discountRate: 22, price: 70, rating: 4.4, reviewCount: 178, location: 'Andong', category: 'Cultural' },
    { id: 'seoraksan-hiking', title: 'Seoraksan National Park Hiking Adventure', image: 'photo-1426604966848-d7adac402bff', originalPrice: 100, discountRate: 25, price: 75, rating: 4.8, reviewCount: 267, location: 'Sokcho', category: 'Adventure' },
    { id: 'gangneung-beach-tour', title: 'Gangneung Beach & Coffee Street Tour', image: 'photo-1469474968028-56623f02e42e', originalPrice: 65, discountRate: 17, price: 54, rating: 4.6, reviewCount: 189, location: 'Gangneung', category: 'Nature' },
    { id: 'jeonju-hanok-tour', title: 'Jeonju Hanok Village Food & Culture Tour', image: 'photo-1482938289607-e9573fc25ebb', originalPrice: 75, discountRate: 19, price: 61, rating: 4.7, reviewCount: 298, location: 'Jeonju', category: 'Cultural' },
    ...Array.from({ length: 15 }, (_, i) => ({
      id: `tour-${i + 11}`,
      title: `Amazing Korea Tour ${i + 11}`,
      image: ['photo-1469474968028-56623f02e42e', 'photo-1482938289607-e9573fc25ebb', 'photo-1470071459604-3b5ec3a7fe05', 'photo-1426604966848-d7adac402bff'][i % 4],
      originalPrice: 80 + Math.floor(Math.random() * 40),
      discountRate: 15 + Math.floor(Math.random() * 15),
      price: 60 + Math.floor(Math.random() * 30),
      rating: 4.3 + Math.random() * 0.6,
      reviewCount: 50 + Math.floor(Math.random() * 300),
      location: ['Seoul', 'Busan', 'Jeju', 'Gyeongju', 'Incheon'][i % 5],
      category: ['Adventure', 'Cultural', 'Nature', 'Historical'][i % 4],
    })),
  ]

  const filteredTours = useMemo(() => {
    return allTours.filter((tour) => {
      const locationMatch = !filters.location || tour.location === filters.location
      const categoryMatch = !filters.category || tour.category === filters.category
      const priceMatch = tour.price >= filters.priceRange[0] && tour.price <= filters.priceRange[1]
      return locationMatch && categoryMatch && priceMatch
    })
  }, [allTours, filters])

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex justify-between items-center">
            <Link href="/">
              <img src="https://i.namu.wiki/i/FbtahqHU60dnSITTtIs-h90AEG8OS8WhMlCv12wGgqqUhQr5T_VWe0OTKA7vJRQNxIJLAx4jKhcn9ILNtNWT1Q.svg" alt="Korea Tours" className="h-6 sm:h-8" />
            </Link>
            <nav className="flex items-center space-x-3 sm:space-x-6">
              <Link href="/products" className="text-xs sm:text-sm text-blue-600 font-medium">Tours</Link>
              <Link href="/inquiry-list" className="text-xs sm:text-sm text-gray-600 hover:text-blue-600 transition-colors">Direct Inquiry</Link>
              <Link href="/reservation-lookup" className="text-xs sm:text-sm text-gray-600 hover:text-blue-600 transition-colors">Reservations</Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">All Tours</h1>
          <p className="text-gray-600">Discover amazing experiences in Korea</p>
        </div>

        {/* Mobile filters at top */}
        <div className="md:hidden mb-6">
          <ProductFilters filters={filters} onFiltersChange={setFilters} />
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Left sticky sidebar filters */}
          <aside className="hidden md:block md:col-span-3">
            <div className="md:sticky md:top-24">
              <ProductFilters filters={filters} onFiltersChange={setFilters} />
            </div>
          </aside>

          {/* Results */}
          <div className="col-span-12 md:col-span-9">
            <div className="mb-6">
              <p className="text-gray-600">{filteredTours.length} tours found</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6">
              {filteredTours.map((tour) => (
                <Link key={tour.id} href={`/tour/${tour.id}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer h-full">
                    <div className="relative h-40 sm:h-48 overflow-hidden">
                      <img src={`https://images.unsplash.com/${tour.image}?auto=format&fit=crop&w=400&q=80`} alt={tour.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                    </div>
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex items-center text-xs sm:text-sm text-gray-600 mb-2">
                        <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        <span className="truncate">{tour.location}</span>
                      </div>
                      <h3 className="font-semibold text-sm sm:text-base mb-2 line-clamp-2 leading-tight">{tour.title}</h3>
                      {typeof tour.rating === 'number' && tour.rating > 0 && typeof tour.reviewCount === 'number' && tour.reviewCount > 0 && (
                        <div className="flex items-center text-xs sm:text-sm text-yellow-600 mb-3">
                          <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-1 fill-current" />
                          {tour.rating.toFixed(1)} ({tour.reviewCount})
                        </div>
                      )}
                      <div className="space-y-1">
                        {typeof tour.discountRate === 'number' && tour.discountRate > 0 && (
                          <div className="text-xs sm:text-sm text-gray-500 line-through">${tour.originalPrice}</div>
                        )}
                        <div className="flex items-center gap-2">
                          {typeof tour.discountRate === 'number' && tour.discountRate > 0 && (
                            <span className="text-xs sm:text-sm font-bold text-red-500">{tour.discountRate}% OFF</span>
                          )}
                          <div className="text-lg sm:text-xl font-bold text-blue-600">${tour.price}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
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


