'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Star, MapPin, Calendar, Users, Search } from 'lucide-react'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from '@/components/ui/carousel'
import { useEffect, useRef, useState } from 'react'

export default function HomePage() {
  const [regionApi, setRegionApi] = useState<CarouselApi>()
  const [regionIndex, setRegionIndex] = useState(0)
  const [regionCount, setRegionCount] = useState(0)
  const [bannerApi, setBannerApi] = useState<CarouselApi>()
  const [bannerIndex, setBannerIndex] = useState(0)
  const [bannerCount, setBannerCount] = useState(0)

  // 1) Region Theme Banner (top)
  const banners = [
    { id: 1, image: 'photo-1501785888041-af3ef285b470', title: 'Autumn Jeju Bus Tour', subtitle: 'Book until September!' },
    { id: 2, image: 'photo-1469474968028-56623f02e42e', title: 'Mountain Sunrise Experience', subtitle: "Korea's breathtaking views" },
    { id: 3, image: 'photo-1470071459604-3b5ec3a7fe05', title: 'Adventure Tours', subtitle: 'Up to 30% off this month!' },
  ]

  // common products
  const allTours = [
    { id: 'jeju-hallasan-hiking', title: 'Jeju Hallasan Mountain Sunrise Hiking Tour', image: 'photo-1469474968028-56623f02e42e', originalPrice: 120, discountRate: 26, price: 89, rating: 4.8, reviewCount: 324, location: 'Jeju, South Korea' },
    { id: 'seoul-palace-tour', title: 'Seoul Royal Palace & Traditional Culture Tour', image: 'photo-1482938289607-e9573fc25ebb', originalPrice: 85, discountRate: 24, price: 65, rating: 4.7, reviewCount: 156, location: 'Seoul, South Korea' },
    { id: 'busan-coastal-tour', title: 'Busan Coastal Scenic Tour & Temple Visit', image: 'photo-1470071459604-3b5ec3a7fe05', originalPrice: 95, discountRate: 21, price: 75, rating: 4.9, reviewCount: 289, location: 'Busan, South Korea' },
    { id: 'gyeongju-history-tour', title: 'Gyeongju Historical Sites Full Day Tour', image: 'photo-1426604966848-d7adac402bff', originalPrice: 110, discountRate: 18, price: 90, rating: 4.6, reviewCount: 201, location: 'Gyeongju, South Korea' },
    { id: 'dmz-tour', title: 'DMZ & Joint Security Area Tour from Seoul', image: 'photo-1469474968028-56623f02e42e', originalPrice: 80, discountRate: 15, price: 68, rating: 4.5, reviewCount: 445, location: 'Seoul, South Korea' },
    { id: 'nami-island-tour', title: 'Nami Island & Petite France Day Tour', image: 'photo-1482938289607-e9573fc25ebb', originalPrice: 70, discountRate: 20, price: 56, rating: 4.7, reviewCount: 332, location: 'Gapyeong, South Korea' },
    { id: 'andong-village-tour', title: 'Andong Hahoe Folk Village Cultural Tour', image: 'photo-1470071459604-3b5ec3a7fe05', originalPrice: 90, discountRate: 22, price: 70, rating: 4.4, reviewCount: 178, location: 'Andong, South Korea' },
    { id: 'seoraksan-hiking', title: 'Seoraksan National Park Hiking Adventure', image: 'photo-1426604966848-d7adac402bff', originalPrice: 100, discountRate: 25, price: 75, rating: 4.8, reviewCount: 267, location: 'Sokcho, South Korea' },
    { id: 'gangneung-beach-tour', title: 'Gangneung Beach & Coffee Street Tour', image: 'photo-1469474968028-56623f02e42e', originalPrice: 65, discountRate: 17, price: 54, rating: 4.6, reviewCount: 189, location: 'Gangneung, South Korea' },
    { id: 'jeonju-hanok-tour', title: 'Jeonju Hanok Village Food & Culture Tour', image: 'photo-1482938289607-e9573fc25ebb', originalPrice: 75, discountRate: 19, price: 61, rating: 4.7, reviewCount: 298, location: 'Jeonju, South Korea' },
    ...Array.from({ length: 20 }, (_, i) => ({
      id: `tour-${i + 11}`,
      title: `Amazing Korea Tour ${i + 11}`,
      image: ['photo-1469474968028-56623f02e42e', 'photo-1482938289607-e9573fc25ebb', 'photo-1470071459604-3b5ec3a7fe05', 'photo-1426604966848-d7adac402bff'][i % 4],
      originalPrice: 80 + Math.floor(Math.random() * 40),
      discountRate: 15 + Math.floor(Math.random() * 15),
      price: 60 + Math.floor(Math.random() * 30),
      rating: 4.3 + Math.random() * 0.6,
      reviewCount: 50 + Math.floor(Math.random() * 300),
      location: ['Seoul, South Korea', 'Busan, South Korea', 'Jeju, South Korea', 'Gyeongju, South Korea', 'Incheon, South Korea'][i % 5],
    })),
  ]

  // region carousel data
  const regions = [
    { id: 'nz', name: 'New Zealand', subtitle: 'Heal in emerald lakes and glacier valleys', image: 'photo-1501785888041-af3ef285b470' },
    { id: 'alps', name: 'Canada', subtitle: 'Snowy peaks, lakes, and prairie highlights', image: 'photo-1501785888041-af3ef285b470' },
    { id: 'capadocia', name: 'Cappadocia', subtitle: 'Bucket-list flight at sunrise', image: 'photo-1500530855697-b586d89ba3ee' },
    { id: 'dolomiti', name: 'Dolomites', subtitle: 'UNESCO-loved scenic trails', image: 'photo-1519681393784-d120267933ba' },
    { id: 'sahara', name: 'Sahara', subtitle: 'A night in the desert under starlight', image: 'photo-1501785888041-af3ef285b470' },
    { id: 'tuscany', name: 'Tuscany', subtitle: 'Slow gourmet travel among hills and vineyards', image: 'photo-1467269204594-9661b134dd2b' },
  ]

  // 캐러셀 중앙(선택) 아이템과, Hover 중인 아이템을 분리 관리
  const [centerRegionId, setCenterRegionId] = useState<string>(regions[0].id)
  const [hoverRegionId, setHoverRegionId] = useState<string | null>(null)
  const activeRegionId = hoverRegionId ?? centerRegionId
  const selectedRegion = regions.find(r => r.id === activeRegionId) || regions[0]

  // 지역 슬라이더 페이지네이션 상태 업데이트
  useEffect(() => {
    if (!regionApi) return
    const onSelect = () => {
      const idx = regionApi.selectedScrollSnap()
      setRegionIndex(idx)
      // 슬라이드 이동 시 중앙 아이템을 선택으로 동기화 (Hover는 유지)
      const next = regions[idx % regions.length]
      if (next) setCenterRegionId(next.id)
    }
    setRegionCount(regionApi.scrollSnapList().length)
    onSelect()
    regionApi.on('select', onSelect)
    return () => {
      regionApi.off('select', onSelect)
    }
  }, [regionApi])

  // 하단 배너 도트 동기화
  useEffect(() => {
    if (!bannerApi) return
    const onSelect = () => setBannerIndex(bannerApi.selectedScrollSnap())
    setBannerCount(bannerApi.scrollSnapList().length)
    onSelect()
    bannerApi.on('select', onSelect)
    return () => {
      bannerApi.off('select', onSelect)
    }
  }, [bannerApi])

  // 2) Product theme categories
  const categories = [
    {
      title: 'Wonders of Nature: Into the Garden of the Gods',
      items: [
        { id: 'nat-1', title: 'Alps Hot Springs & Starlight Healing Trip', image: 'photo-1470071459604-3b5ec3a7fe05', category: 'Nature', location: 'Alps, Europe', rating: 4.9, reviewCount: 101, originalPrice: 6800000, discountRate: 12, price: 5990000 },
        { id: 'nat-2', title: 'Alps 5-Star All-Inclusive 4N5D', image: 'photo-1437623889155-075d40e2e59f', category: 'Luxury', location: 'Alps, Europe', rating: 3.0, reviewCount: 10, originalPrice: 1500000, discountRate: 14, price: 1290000 },
        { id: 'nat-3', title: 'Bangkok & Pattaya Free Trip 4N5D Hot Spots', image: 'photo-1500530855697-b586d89ba3ee', category: 'City Break', location: 'Bangkok, Thailand', rating: 3.5, reviewCount: 10, originalPrice: 900000, discountRate: 1, price: 890000 },
        { id: 'nat-4', title: 'Paris & Switzerland 7N8D European Vibes', image: 'photo-1521295121783-8a321d551ad2', category: 'Europe', location: 'Paris & Swiss', rating: 4.2, reviewCount: 10, originalPrice: 4000000, discountRate: 10, price: 3590000 },
      ],
    },
    { title: 'Romantic Autumn: Grand Tour of Europe', items: [ ...allTours.slice(0, 8).map(t => ({ id: `rom-${t.id}`, title: t.title, image: t.image, category: 'Romance', rating: t.rating, reviewCount: t.reviewCount, originalPrice: t.originalPrice*100, discountRate: 10, price: Math.max(50, t.price)*100, location: t.location })) ] },
    { title: 'Maldives Seaside Retreat', items: [ ...allTours.slice(4, 12).map(t => ({ id: `sea-${t.id}`, title: t.title, image: t.image, category: 'Resort', rating: t.rating, reviewCount: t.reviewCount, originalPrice: t.originalPrice*90, discountRate: 18, price: Math.max(50, t.price)*90, location: t.location })) ] },
    { title: 'US West Grand Circle Nature', items: [ ...allTours.slice(2, 10).map(t => ({ id: `us-${t.id}`, title: t.title, image: t.image, category: 'Trekking', rating: t.rating, reviewCount: t.reviewCount, originalPrice: t.originalPrice*110, discountRate: 7, price: Math.max(50, t.price)*110, location: t.location })) ] },
  ]

  // 3) Tabbed product area (below themes) - show first 4 items per tab
  const tabIcons = [MapPin, Calendar, Users, Search]
  const tabGroups = categories.slice(0, 4).map((cat, idx) => ({
    key: `cat-${idx}`,
    label: cat.title,
    Icon: tabIcons[idx % tabIcons.length],
    items: cat.items.slice(0, 4),
  }))

  // like removed per spec

  // 탭 바 드래그 스크롤
  const tabsListRef = useRef<HTMLDivElement | null>(null)
  const [isDraggingTabs, setIsDraggingTabs] = useState(false)
  const drag = useRef({ startX: 0, scrollLeft: 0 })

  const handleTabsPointerDown = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    const el = tabsListRef.current
    if (!el) return
    setIsDraggingTabs(true)
    const pageX = 'touches' in e ? e.touches[0].pageX : (e as any).pageX
    drag.current.startX = pageX - el.offsetLeft
    drag.current.scrollLeft = el.scrollLeft
  }

  const handleTabsPointerMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!isDraggingTabs) return
    e.preventDefault()
    const el = tabsListRef.current
    if (!el) return
    const pageX = 'touches' in e ? e.touches[0].pageX : (e as any).pageX
    const x = pageX - el.offsetLeft
    const walk = x - drag.current.startX
    el.scrollLeft = drag.current.scrollLeft - walk
  }

  const handleTabsPointerUp = () => setIsDraggingTabs(false)

  const renderCarousel = (items: any[]) => (
    <Carousel className="w-full" opts={{ align: 'start', slidesToScroll: 1 }}>
      <CarouselContent className="-ml-2 md:-ml-4">
        {items.slice(0, 4).map((p) => (
          <CarouselItem key={p.id} className="pl-2 md:pl-4 basis-3/4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
            <Link href={`/tour/${p.id}`}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer h-full">
                <div className="relative h-44 sm:h-52 overflow-hidden">
                  <img src={`https://images.unsplash.com/${p.image}?auto=format&fit=crop&w=600&q=80`} alt={p.title} className="w-full h-full object-cover" />
                </div>
                <CardContent className="p-3 sm:p-4">
                  <div className="text-[11px] sm:text-xs text-gray-500 mb-1">{p.category || 'Category'} · {p.location || 'Location'}</div>
                  <h3 className="font-semibold text-sm sm:text-base mb-2 line-clamp-2 leading-tight">{p.title}</h3>
                  <div className="flex items-center text-xs sm:text-sm text-yellow-600 mb-2">
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-1 fill-current" />
                    {p.rating?.toFixed ? p.rating.toFixed(1) : p.rating} ({p.reviewCount})
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs sm:text-sm text-gray-500 line-through">{typeof p.originalPrice === 'number' ? `$${p.originalPrice.toLocaleString()}` : p.originalPrice}</div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-bold text-red-500">{p.discountRate}% OFF</span>
                      <div className="text-lg sm:text-xl font-bold text-blue-600">{typeof p.price === 'number' ? `$${p.price.toLocaleString()}` : p.price}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="flex justify-center mt-3 space-x-4">
        <CarouselPrevious className="relative translate-x-0 translate-y-0" />
        <CarouselNext className="relative translate-x-0 translate-y-0" />
      </div>
    </Carousel>
  )

  

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-[60] bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/75 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex justify-between items-center">
            <Link href="/">
              <img
                src="https://i.namu.wiki/i/FbtahqHU60dnSITTtIs-h90AEG8OS8WhMlCv12wGgqqUhQr5T_VWe0OTKA7vJRQNxIJLAx4jKhcn9ILNtNWT1Q.svg"
                alt="Korea Tours"
                className="h-6 sm:h-8"
              />
            </Link>
            <nav className="flex items-center space-x-3 sm:space-x-6">
              <Link href="/products" className="text-xs sm:text-sm text-gray-600 hover:text-blue-600 transition-colors">Tours</Link>
              <Link href="/inquiry-list" className="text-xs sm:text-sm text-gray-600 hover:text-blue-600 transition-colors">Direct Inquiry</Link>
              <Link href="/reservation-lookup" className="text-xs sm:text-sm text-gray-600 hover:text-blue-600 transition-colors">Reservations</Link>
            </nav>
          </div>
        </div>
      </header>
      {/* 지역 테마 배너 영역 (독립 배경) */}
      <section className="relative w-full isolate bg-sky-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="relative group">
            <div className="pointer-events-none text-center mb-6 sm:mb-8 transition-transform duration-300 group-hover:-translate-y-1">
              <h2 className="text-xl sm:text-3xl font-extrabold mb-2 text-gray-900">{selectedRegion.name}</h2>
              <p className="text-xs sm:text-sm text-gray-800/80">{selectedRegion.subtitle}</p>
            </div>
            <Carousel className="w-full" opts={{ align: 'start', slidesToScroll: 1, loop: true }} setApi={setRegionApi}>
              <CarouselContent className="-ml-2 md:-ml-4 py-6 sm:py-8">
                {regions.map((r) => (
                  <CarouselItem key={r.id} className="pl-2 md:pl-4 basis-2/3 sm:basis-1/2 md:basis-1/3 lg:basis-1/5">
                    <Link
                      href={`/products?region=${encodeURIComponent(r.id)}`}
                      aria-selected={activeRegionId === r.id}
                      onMouseEnter={() => setHoverRegionId(r.id)}
                      onFocus={() => setHoverRegionId(r.id)}
                      onMouseLeave={() => setHoverRegionId(null)}
                      onBlur={() => setHoverRegionId(null)}
                      className={`relative block h-72 sm:h-96 md:h-[28rem] overflow-hidden rounded-2xl cursor-pointer group outline-none focus:outline-none focus-visible:outline-none transition-transform duration-300 ease-out ${hoverRegionId === r.id ? '-translate-y-4 sm:-translate-y-6 md:-translate-y-8 shadow-2xl' : ''}`}
                    >
                      <img src={`https://images.unsplash.com/${r.image}?auto=format&fit=crop&w=800&q=80`} alt={r.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 active:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent group-hover:from-black/60" />
                      <div className="absolute bottom-3 left-3 text-white font-semibold text-sm sm:text-base drop-shadow">{r.name}</div>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
            {/* 도트 페이지네이션 */}
            <div className="mt-3 flex justify-center gap-2">
              {Array.from({ length: regionCount }).map((_, i) => (
                <button key={i} aria-label={`Go to slide ${i + 1}`} onClick={() => regionApi?.scrollTo(i)} className={`h-2.5 w-2.5 rounded-full transition-all ${regionIndex === i ? 'bg-blue-600 w-5' : 'bg-gray-300 hover:bg-gray-400'}`} />
              ))}
            </div>
          </div>
        </div>
        {/* 배너 끝과 본문(흰색) 사이 여백 */}
        <div className="h-6 sm:h-8 bg-sky-50" />
      </section>

      {/* Best product themes */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Best Products</h2>
        </div>
        <Accordion type="single" collapsible className="w-full space-y-4 sm:space-y-6" defaultValue="cat-0">
          {categories.map((cat, idx) => (
            <AccordionItem
              key={cat.title}
              value={`cat-${idx}`}
              className="bg-white rounded-2xl shadow-sm ring-2 ring-[#f3f1f1] px-3 sm:px-5 py-4 sm:py-6"
            >
              <AccordionTrigger className="text-left">
                <span className="text-base sm:text-lg font-semibold">{cat.title}</span>
              </AccordionTrigger>
              <AccordionContent className="pt-2">
                {renderCarousel(cat.items)}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* 가로형 배너 - 도트 캐러셀 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <Carousel className="w-full" opts={{ align: 'start', loop: true }} setApi={setBannerApi}>
          <CarouselContent className="-ml-2 md:-ml-4">
            {banners.map((banner) => (
              <CarouselItem key={banner.id} className="pl-2 md:pl-4 basis-full">
                <Link href={`/products?banner=${banner.id}`} className="block focus:outline-none focus-visible:outline-none">
                  <div className="relative w-full h-48 sm:h-64 md:h-[20rem] rounded-xl overflow-hidden">
                    <img src={`https://images.unsplash.com/${banner.image}?auto=format&fit=crop&w=1600&q=80`} alt={banner.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <div className="text-center text-white px-4">
                        <h3 className="text-lg sm:text-2xl font-bold mb-1">{banner.title}</h3>
                        <p className="text-xs sm:text-base opacity-90">{banner.subtitle}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <div className="mt-3 flex justify-center gap-2">
          {Array.from({ length: bannerCount }).map((_, i) => (
            <button key={i} aria-label={`Go to banner ${i + 1}`} onClick={() => bannerApi?.scrollTo(i)} className={`h-2.5 w-2.5 rounded-full transition-all ${bannerIndex === i ? 'bg-blue-600 w-5' : 'bg-gray-300 hover:bg-gray-400'}`} />
          ))}
        </div>
      </section>

      {/* Product theme carousels */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-10">
        {categories.slice(0, 3).map((cat, i) => (
          <div key={cat.title} className="space-y-4">
            <div className="flex items-baseline justify-between">
              <h3 className="text-xl sm:text-2xl font-bold">{cat.title}</h3>
              <Link href={`/products?theme=${i + 1}`} className="text-blue-600 text-sm sm:text-base hover:underline">View more</Link>
            </div>
            <Carousel className="w-full relative" opts={{ align: 'start' }}>
              <CarouselContent className="-ml-2 md:-ml-4">
                {cat.items.slice(0, 4).map((p) => (
                  <CarouselItem key={p.id} className="pl-2 md:pl-4 basis-3/4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                    <Link href={`/tour/${p.id}`}>
                      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer h-full">
                        <div className="relative h-40 sm:h-48 overflow-hidden">
                          <img src={`https://images.unsplash.com/${p.image}?auto=format&fit=crop&w=400&q=80`} alt={p.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                        </div>
                        <CardContent className="p-3 sm:p-4">
                          <div className="text-[11px] sm:text-xs text-gray-500 mb-1">{p.category || 'Category'} · {p.location || 'Location'}</div>
                          <h4 className="font-semibold text-sm sm:text-base mb-2 line-clamp-2 leading-tight">{p.title}</h4>
                          <div className="flex items-center text-xs sm:text-sm text-yellow-600 mb-2">
                            <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-1 fill-current" />
                            {p.rating?.toFixed ? p.rating.toFixed(1) : p.rating} ({p.reviewCount})
                          </div>
                          <div className="space-y-1">
                            <div className="text-xs sm:text-sm text-gray-500 line-through">{typeof p.originalPrice === 'number' ? `$${p.originalPrice.toLocaleString()}` : p.originalPrice}</div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs sm:text-sm font-bold text-red-500">{p.discountRate}% OFF</span>
                              <div className="text-lg sm:text-xl font-bold text-blue-600">{typeof p.price === 'number' ? `$${p.price.toLocaleString()}` : p.price}</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {/* 4개 초과하면 좌우 버튼(사이드 중앙) 노출 */}
              {cat.items.length > 4 && (
                <>
                  <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-9 w-9 rounded-full bg-white/90 shadow hover:bg-white" />
                  <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-9 w-9 rounded-full bg-white/90 shadow hover:bg-white" />
                </>
              )}
            </Carousel>
          </div>
        ))}

        {/* 탭형 상품 영역 (좌측 이미지, 우측 텍스트 레이아웃, 2열 그리드) */}
        <div className="mt-2">
          <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">추천 상품</h3>
          <Tabs defaultValue={tabGroups[0]?.key ?? 'cat-0'} className="w-full">
            {/* 상단 Horizontal Tab: 아이콘 + 라벨, 선택 탭 굵게 + 하단 진한 밑줄 */}
            <TabsList
              ref={tabsListRef as any}
              onMouseDown={handleTabsPointerDown}
              onMouseMove={handleTabsPointerMove}
              onMouseLeave={handleTabsPointerUp}
              onMouseUp={handleTabsPointerUp}
              onTouchStart={handleTabsPointerDown}
              onTouchMove={handleTabsPointerMove}
              onTouchEnd={handleTabsPointerUp}
              className="w-full overflow-x-auto overflow-y-hidden flex gap-2 sm:gap-3 rounded-none bg-transparent p-0 border-b scrollbar-hide cursor-grab active:cursor-grabbing select-none"
            >
              {tabGroups.map(t => (
                <TabsTrigger
                  key={t.key}
                  value={t.key}
                  className="data-[state=active]:font-bold relative rounded-none bg-transparent px-3 sm:px-4 py-2 text-sm sm:text-base data-[state=active]:text-gray-900 text-gray-500 scrollbar-hide"
                >
                  <t.Icon className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5" />
                  {t.label}
                  <span className="absolute left-0 right-0 -bottom-[1px] h-[2px] bg-gray-900 opacity-0 data-[state=active]:opacity-100" />
                </TabsTrigger>
              ))}
            </TabsList>

            {tabGroups.map(t => (
              <TabsContent key={t.key} value={t.key} className="mt-4 sm:mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {t.items?.slice(0, 4).map((p: any) => (
                    <Link key={p.id} href={`/tour/${p.id}`} className="block">
                      <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300">
                        <div className="flex items-stretch">
                          {/* 좌측 이미지 */}
                          <div className="relative w-36 sm:w-44 md:w-48 shrink-0">
                            <img src={`https://images.unsplash.com/${p.image}?auto=format&fit=crop&w=500&q=80`} alt={p.title} className="w-full h-full object-cover aspect-[4/3]" />
                          </div>
                          {/* 우측 텍스트 */}
                          <CardContent className="p-3 sm:p-4 flex-1">
                            <h4 className="font-semibold text-sm sm:text-base mb-1 line-clamp-2 leading-snug">{p.title}</h4>
                            <div className="flex items-center text-[11px] sm:text-xs text-yellow-600 mb-1.5 sm:mb-2">
                              <Star className="w-3 h-3 mr-1 fill-current" />
                              {p.rating?.toFixed ? p.rating.toFixed(1) : p.rating} ({p.reviewCount})
                            </div>
                            <div className="text-[11px] sm:text-xs text-gray-500 line-through">{typeof p.originalPrice === 'number' ? `$${p.originalPrice.toLocaleString()}` : p.originalPrice}</div>
                            <div className="mt-1 flex items-center gap-2">
                              <span className="text-[11px] sm:text-xs font-bold text-red-500">{p.discountRate}%</span>
                              <div className="text-sm sm:text-base font-bold text-blue-600">{typeof p.price === 'number' ? `$${p.price.toLocaleString()}` : p.price}</div>
                            </div>
                          </CardContent>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>
    </div>
  )
}


