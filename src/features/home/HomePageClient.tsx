'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Star, MapPin, Calendar, Users, Search } from 'lucide-react'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from '@/components/ui/carousel'
import type { Banner, Category, Region, Section } from './types'

export interface HomePageClientProps {
  banners: Banner[]
  regions: Region[]
  categories: Category[]
  sections?: Section[]
}

export default function HomePageClient({ banners, regions, categories, sections }: HomePageClientProps) {
  const [regionApi, setRegionApi] = useState<CarouselApi>()
  const [regionIndex, setRegionIndex] = useState(0)
  const [regionCount, setRegionCount] = useState(0)
  const [bannerApi, setBannerApi] = useState<CarouselApi>()
  const [bannerIndex, setBannerIndex] = useState(0)
  const [bannerCount, setBannerCount] = useState(0)

  const regionsForCarousel = sections?.find(s => s.templateId === 'TV_TM_CAROUSEL' && 'regions' in s)?.regions ?? regions
  const bannersForLine = sections?.find(s => s.templateId === 'TV_PC_IV_LINE_BANNER_A' && 'banners' in s)?.banners ?? banners
  const bestTabCats = sections?.find(s => s.templateId === 'TV_TAB_BSTP' && 'categories' in s)?.categories ?? categories.slice(0, 4)
  const fourByOneCats = (sections?.filter(s => s.templateId === 'TV_PC_TM_PRODUCT_4X1' && 'category' in s).map(s => (s as any).category) as Category[]) ?? categories.slice(0, 3)
  const twoGridCats = sections?.find(s => s.templateId === 'TV_TAB_TWOGRID' && 'categories' in s)?.categories ?? categories.slice(0, 2)

  const [centerRegionId, setCenterRegionId] = useState<string>(regionsForCarousel[0]?.id ?? '')
  const [hoverRegionId, setHoverRegionId] = useState<string | null>(null)
  const activeRegionId = hoverRegionId ?? centerRegionId
  const selectedRegion = regionsForCarousel.find(r => r.id === activeRegionId) || regionsForCarousel[0]

  useEffect(() => {
    if (!regionApi) return
    const onSelect = () => {
      const idx = regionApi.selectedScrollSnap()
      setRegionIndex(idx)
      const base = regionsForCarousel
      const next = base[idx % Math.max(1, base.length)]
      if (next) setCenterRegionId(next.id)
    }
    setRegionCount(regionApi.scrollSnapList().length)
    onSelect()
    regionApi.on('select', onSelect)
    return () => {
      regionApi.off('select', onSelect)
    }
  }, [regionApi, regionsForCarousel])

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

  const tabIcons = [MapPin, Calendar, Users, Search]
  const stripEmoji = (text: string) => {
    const surrogatePair = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g
    const variationSel = /\uFE0F/g
    return text.replace(surrogatePair, '').replace(variationSel, '').trim()
  }
  const toGitmoji = (text: string) => {
    const surrogatePairOne = /[\uD800-\uDBFF][\uDC00-\uDFFF]/
    const m = text.match(surrogatePairOne)
    return m ? m[0] : ''
  }

  const buildTabGroups = (cats: Category[]) => cats
    .filter((c) => Array.isArray(c.items) && c.items.length > 0)
    .slice(0, 4)
    .map((cat, idx) => {
      const gitmoji = toGitmoji(cat.title)
      const label = stripEmoji(cat.title)
      return {
        key: `cat-${idx}`,
        label,
        gitmoji,
        Icon: tabIcons[idx % tabIcons.length],
        items: cat.items.slice(0, 4),
      }
    })

  const tabsListRef = useRef<HTMLDivElement | null>(null)
  const [isDraggingTabs, setIsDraggingTabs] = useState(false)
  const drag = useRef({ startX: 0, scrollLeft: 0 }) as any

  const handleTabsPointerDown = (e: any) => {
    const el = tabsListRef.current
    if (!el) return
    setIsDraggingTabs(true)
    const pageX = 'touches' in e ? e.touches[0].pageX : e.pageX
    drag.current.startX = pageX - el.offsetLeft
    drag.current.scrollLeft = el.scrollLeft
  }

  const handleTabsPointerMove = (e: any) => {
    if (!isDraggingTabs) return
    e.preventDefault()
    const el = tabsListRef.current
    if (!el) return
    const pageX = 'touches' in e ? e.touches[0].pageX : e.pageX
    const x = pageX - el.offsetLeft
    const walk = x - drag.current.startX
    el.scrollLeft = drag.current.scrollLeft - walk
  }

  const handleTabsPointerUp = () => setIsDraggingTabs(false)

  const renderCarousel = (items: any[], opts?: { showArrows?: boolean }) => (
    <Carousel className="w-full" opts={{ align: 'start', slidesToScroll: 1 }}>
      <CarouselContent className="-ml-2 md:-ml-4">
        {items.slice(0, 4).map((p) => (
          <CarouselItem key={p.id} className="pl-2 md:pl-4 basis-3/4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
            <Link href={p.href || `/tour/${p.id}`}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer h-full">
                <div className="relative h-44 sm:h-52 overflow-hidden">
                  <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                </div>
                <CardContent className="p-3 sm:p-4">
                  <div className="text-[11px] sm:text-xs text-gray-500 mb-1">{p.category || 'Category'} · {p.location || 'Location'}</div>
                  <h3 className="font-semibold text-sm sm:text-base mb-2 line-clamp-2 leading-tight">{p.title}</h3>
                  {typeof p.rating === 'number' && p.rating > 0 && typeof p.reviewCount === 'number' && p.reviewCount > 0 && (
                    <div className="flex items-center text-xs sm:text-sm text-yellow-600 mb-2">
                      <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-1 fill-current" />
                      {p.rating?.toFixed ? p.rating.toFixed(1) : p.rating} ({p.reviewCount})
                    </div>
                  )}
                  <div className="space-y-1">
                    {typeof p.discountRate === 'number' && p.discountRate > 0 && (
                      <div className="text-xs sm:text-sm text-gray-500 line-through">{typeof p.originalPrice === 'number' ? `$${p.originalPrice.toLocaleString()}` : p.originalPrice}</div>
                    )}
                    <div className="flex items-center gap-2">
                      {typeof p.discountRate === 'number' && p.discountRate > 0 && (
                        <span className="text-xs sm:text-sm font-bold text-red-500">{p.discountRate}% OFF</span>
                      )}
                      <div className="text-lg sm:text-xl font-bold text-blue-600">{typeof p.price === 'number' ? `$${p.price.toLocaleString()}` : p.price}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
      {(opts?.showArrows ?? true) && (
        <div className="flex justify-center mt-3 space-x-4">
          <CarouselPrevious className="relative translate-x-0 translate-y-0" />
          <CarouselNext className="relative translate-x-0 translate-y-0" />
        </div>
      )}
    </Carousel>
  )

  const renderSection = (section: Section, idx: number) => {
    switch (section.templateId) {
      case 'TV_TM_CAROUSEL': {
        const list = section.regions
        if (!Array.isArray(list) || list.length === 0) return null
        return (
          <section key={`sec-${idx}`} className="relative w-full isolate bg-sky-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
              <div className="relative group">
                <div className="pointer-events-none text-center mb-6 sm:mb-8 transition-transform duration-300 group-hover:-translate-y-1">
                  <h2 className="text-xl sm:text-3xl font-extrabold mb-2 text-gray-900">{selectedRegion?.name}</h2>
                  <p className="text-xs sm:text-sm text-gray-800/80">{selectedRegion?.subtitle}</p>
                </div>
                <Carousel className="w-full" opts={{ align: 'start', slidesToScroll: 1, loop: true }} setApi={setRegionApi}>
                  <CarouselContent className="-ml-2 md:-ml-4 py-6 sm:py-8">
                    {list.map((r) => (
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
                          <img src={r.image} alt={r.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 active:scale-105" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent group-hover:from-black/60" />
                          <div className="absolute bottom-3 left-3 text-white font-semibold text-sm sm:text-base drop-shadow">{r.name}</div>
                        </Link>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
                <div className="mt-3 flex justify-center gap-2">
                  {Array.from({ length: regionCount }).map((_, i) => (
                    <button key={i} aria-label={`Go to slide ${i + 1}`} onClick={() => regionApi?.scrollTo(i)} className={`h-2.5 w-2.5 rounded-full transition-all ${regionIndex === i ? 'bg-blue-600 w-5' : 'bg-gray-300 hover:bg-gray-400'}`} />
                  ))}
                </div>
              </div>
            </div>
            <div className="h-6 sm:h-8 bg-sky-50" />
          </section>
        )
      }
      case 'TV_TAB_BSTP': {
        const cats = (section.categories || []).filter(c => Array.isArray(c.items) && c.items.length > 0)
        if (cats.length === 0) return null
        return (
          <section key={`sec-${idx}`} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10">
            <div className="mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{(section as any).title || 'Best Products'}</h2>
            </div>
            <Accordion type="single" collapsible className="w-full space-y-4 sm:space-y-6" defaultValue="cat-0">
              {cats.map((cat, cidx) => (
                <AccordionItem key={cat.title} value={`cat-${cidx}`} className="bg-white rounded-2xl shadow-sm ring-2 ring-[#f3f1f1] px-3 sm:px-5 py-4 sm:py-6">
                  <AccordionTrigger className="text-left">
                    <span className="text-base sm:text-lg font-semibold">{cat.title}</span>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2">
                    {renderCarousel(cat.items, { showArrows: cat.items.length > 4 })}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        )
      }
      case 'TV_PC_IV_LINE_BANNER_A': {
        const bs = section.banners
        if (!Array.isArray(bs) || bs.length === 0) return null
        return (
          <section key={`sec-${idx}`} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
            <Carousel className="w-full" opts={{ align: 'start', loop: true }} setApi={setBannerApi}>
              <CarouselContent className="-ml-2 md:-ml-4">
                {bs.map((banner) => (
                  <CarouselItem key={banner.id} className="pl-2 md:pl-4 basis-full">
                    <Link href={banner.href ?? `/products?banner/${banner.id}`} className="block focus:outline-none focus-visible:outline-none">
                      <div className="relative w-full h-48 sm:h-64 md:h-[20rem] rounded-xl overflow-hidden">
                        <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
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
        )
      }
      case 'TV_PC_TM_PRODUCT_4X1': {
        const cat = section.category
        if (!Array.isArray(cat.items) || cat.items.length === 0) return null
        return (
          <section key={`sec-${idx}`} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
            <div className="space-y-4">
              <div className="flex items-baseline justify-between">
                <h3 className="text-xl sm:text-2xl font-bold">{cat.title}</h3>
                <Link href={`/products?theme=${idx + 1}`} className="text-blue-600 text-sm sm:text-base hover:underline">View more</Link>
              </div>
              <Carousel className="w-full relative" opts={{ align: 'start' }}>
                <CarouselContent className="-ml-2 md:-ml-4">
                  {cat.items.slice(0, 4).map((p) => (
                    <CarouselItem key={p.id} className="pl-2 md:pl-4 basis-3/4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                      <Link href={p.href || `/tour/${p.id}`}>
                        <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer h-full">
                          <div className="relative h-40 sm:h-48 overflow-hidden">
                            <img src={p.image} alt={p.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                          </div>
                          <CardContent className="p-3 sm:p-4">
                            <div className="text-[11px] sm:text-xs text-gray-500 mb-1">{p.category || 'Category'} · {p.location || 'Location'}</div>
                            <h4 className="font-semibold text-sm sm:text-base mb-2 line-clamp-2 leading-tight">{p.title}</h4>
                            {typeof p.rating === 'number' && p.rating > 0 && typeof p.reviewCount === 'number' && p.reviewCount > 0 && (
                              <div className="flex items-center text-xs sm:text-sm text-yellow-600 mb-2">
                                <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-1 fill-current" />
                                {p.rating?.toFixed ? p.rating.toFixed(1) : p.rating} ({p.reviewCount})
                              </div>
                            )}
                            <div className="space-y-1">
                              {typeof p.discountRate === 'number' && p.discountRate > 0 && (
                                <div className="text-xs sm:text-sm text-gray-500 line-through">{typeof p.originalPrice === 'number' ? `$${p.originalPrice.toLocaleString()}` : p.originalPrice}</div>
                              )}
                              <div className="flex items-center gap-2">
                                {typeof p.discountRate === 'number' && p.discountRate > 0 && (
                                  <span className="text-xs sm:text-sm font-bold text-red-500">{p.discountRate}% OFF</span>
                                )}
                                <div className="text-lg sm:text-xl font-bold text-blue-600">{typeof p.price === 'number' ? `$${p.price.toLocaleString()}` : p.price}</div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
          </section>
        )
      }
      case 'TV_TAB_TWOGRID': {
        const cats = section.categories
        const tabGroups = buildTabGroups(cats)
        if (tabGroups.length === 0) return null
        return (
          <section key={`sec-${idx}`} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
            <div className="mt-2">
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-left">{(section as any).title || '추천 상품'}</h3>
              <Tabs defaultValue={tabGroups[0]?.key ?? 'cat-0'} className="w-full">
                <TabsList
                  ref={tabsListRef as any}
                  onMouseDown={handleTabsPointerDown}
                  onMouseMove={handleTabsPointerMove}
                  onMouseLeave={handleTabsPointerUp}
                  onMouseUp={handleTabsPointerUp}
                  onTouchStart={handleTabsPointerDown}
                  onTouchMove={handleTabsPointerMove}
                  onTouchEnd={handleTabsPointerUp}
                  className="w-full overflow-x-auto overflow-y-hidden flex gap-2 sm:gap-3 rounded-none bg-transparent p-0 border-b scrollbar-hide cursor-grab active:cursor-grabbing select-none justify-start"
                >
                  {tabGroups.map(t => (
                    <TabsTrigger
                      key={t.key}
                      value={t.key}
                      className="data-[state=active]:font-bold relative rounded-none bg-transparent px-3 sm:px-4 py-2 text-sm sm:text-base data-[state=active]:text-gray-900 text-gray-500 scrollbar-hide"
                    >
                      {t.gitmoji && <span className="mr-1.5">{t.gitmoji}</span>}
                      <span className="truncate">{t.label}</span>
                      <span className="absolute left-0 right-0 -bottom-[1px] h-[2px] bg-gray-900 opacity-0 data-[state=active]:opacity-100" />
                    </TabsTrigger>
                  ))}
                </TabsList>
                {tabGroups.map(t => (
                  <TabsContent key={t.key} value={t.key} className="mt-4 sm:mt-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {t.items?.slice(0, 4).map((p: any) => (
                        <Link key={p.id} href={p.href || `/tour/${p.id}`} className="block">
                          <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300">
                            <div className="flex items-stretch">
                              <div className="relative w-36 sm:w-44 md:w-48 shrink-0">
                                <img src={p.image} alt={p.title} className="w-full h-full object-cover aspect-[4/3]" />
                              </div>
                              <CardContent className="p-3 sm:p-4 flex-1">
                                <h4 className="font-semibold text-sm sm:text-base mb-1 line-clamp-2 leading-snug">{p.title}</h4>
                                {typeof p.rating === 'number' && p.rating > 0 && typeof p.reviewCount === 'number' && p.reviewCount > 0 && (
                                  <div className="flex items-center text-[11px] sm:text-xs text-yellow-600 mb-1.5 sm:mb-2">
                                    <Star className="w-3 h-3 mr-1 fill-current" />
                                    {p.rating?.toFixed ? p.rating.toFixed(1) : p.rating} ({p.reviewCount})
                                  </div>
                                )}
                                {typeof p.discountRate === 'number' && p.discountRate > 0 && (
                                  <div className="text-[11px] sm:text-xs text-gray-500 line-through">{typeof p.originalPrice === 'number' ? `$${p.originalPrice.toLocaleString()}` : p.originalPrice}</div>
                                )}
                                <div className="mt-1 flex items-center gap-2">
                                  {typeof p.discountRate === 'number' && p.discountRate > 0 && (
                                    <span className="text-[11px] sm:text-xs font-bold text-red-500">{p.discountRate}%</span>
                                  )}
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
        )
      }
    }
  }

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

      {(sections && sections.length > 0
        ? sections
        : [
            { templateId: 'TV_TM_CAROUSEL', regions: regionsForCarousel },
            { templateId: 'TV_TAB_BSTP', categories: bestTabCats },
            { templateId: 'TV_PC_IV_LINE_BANNER_A', banners: bannersForLine },
            ...fourByOneCats.map(cat => ({ templateId: 'TV_PC_TM_PRODUCT_4X1', category: cat } as const)),
            { templateId: 'TV_TAB_TWOGRID', categories: twoGridCats },
          ] as Section[]
      ).map((sec, idx) => renderSection(sec, idx))}
    </div>
  )
}


