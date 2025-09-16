'use client'

import { LayoutProvider } from '@/components/layout/LayoutProvider'
import { useState } from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import type { CarouselApi } from '@/components/ui/carousel'
import type { Banner, Category, Region, Section } from './types'
import { SectionCategoryCarousel } from '@/features/home/components/SectionCategoryCarousel'
import { SectionFourByOne } from '@/features/home/components/SectionFourByOne'
import { RegionCarousel } from '@/features/home/components/RegionCarousel'
import { BannerCarousel } from '@/features/home/components/BannerCarousel'
import { ProductTabs } from '@/features/home/components/ProductTabs'
import { ProductCarousel } from '@/components/common/ProductCarousel'
import { ResponsiveContainer } from '@/components/common/ResponsiveContainer'
import { SectionHeader } from '@/components/common/SectionHeader'

export interface HomePageClientProps {
  banners: Banner[]
  regions: Region[]
  categories: Category[]
  sections?: Section[]
}

export default function HomePageClient({ banners, regions, categories, sections }: HomePageClientProps) {
  // 캐러셀 API 상태 관리
  const [regionApi, setRegionApi] = useState<CarouselApi>()
  const [bannerApi, setBannerApi] = useState<CarouselApi>()

  // 지역 선택 상태 관리
  const [centerRegionId, setCenterRegionId] = useState<string>('')
  const [hoverRegionId, setHoverRegionId] = useState<string | null>(null)

  // 섹션별 데이터 추출
  const regionsForCarousel = sections?.find(s => s.templateId === 'TV_TM_CAROUSEL' && 'regions' in s)?.regions ?? regions
  const bannersForLine = sections?.find(s => s.templateId === 'TV_PC_IV_LINE_BANNER_A' && 'banners' in s)?.banners ?? banners
  const bestTabCats = sections?.find(s => s.templateId === 'TV_TAB_BSTP' && 'categories' in s)?.categories ?? categories.slice(0, 4)
  const fourByOneCats = (sections?.filter(s => s.templateId === 'TV_PC_TM_PRODUCT_4X1' && 'category' in s).map(s => (s as any).category) as Category[]) ?? categories.slice(0, 3)
  const twoGridCats = sections?.find(s => s.templateId === 'TV_TAB_TWOGRID' && 'categories' in s)?.categories ?? categories.slice(0, 2)

  // 초기 지역 ID 설정
  if (centerRegionId === '' && regionsForCarousel.length > 0) {
    setCenterRegionId(regionsForCarousel[0].id)
  }

  const activeRegionId = hoverRegionId ?? centerRegionId
  const selectedRegion = regionsForCarousel.find(r => r.id === activeRegionId) || regionsForCarousel[0]

  /**
   * 지역 선택 핸들러
   */
  const handleRegionSelect = (regionId: string) => {
    setCenterRegionId(regionId)
  }

  /**
   * 지역 호버 핸들러
   */
  const handleRegionHover = (regionId: string | null) => {
    setHoverRegionId(regionId)
  }

  /**
   * 섹션별 렌더링 함수
   * 각 템플릿 ID에 따라 적절한 컴포넌트를 렌더링
   */
  const renderSection = (section: Section, idx: number) => {
    switch (section.templateId) {
      case 'TV_TM_CAROUSEL': {
        const regions = section.regions
        if (!Array.isArray(regions) || regions.length === 0) return null
        
        return (
          <RegionCarousel
            key={`sec-${idx}`}
            regions={regions}
            selectedRegionId={activeRegionId}
            onRegionSelect={handleRegionSelect}
            onRegionHover={handleRegionHover}
            setCarouselApi={setRegionApi}
          />
        )
      }
      
      case 'TV_TAB_BSTP': {
        const categories = (section.categories || []).filter(c => Array.isArray(c.items) && c.items.length > 0)
        if (categories.length === 0) return null
        
        return (
          <section key={`sec-${idx}`} className="w-full">
            <ResponsiveContainer verticalPadding="pt-6 sm:pt-10">
              <div className="mb-6 sm:mb-8">
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  {(section as any).title || 'Best Products'}
                </h2>
              </div>
              <Accordion type="single" collapsible className="w-full space-y-4 sm:space-y-6" defaultValue="cat-0">
                {categories.map((category, cidx) => (
                  <AccordionItem 
                    key={category.title} 
                    value={`cat-${cidx}`} 
                    className="bg-white rounded-2xl shadow-sm ring-2 ring-[#f3f1f1] px-3 sm:px-5 py-4 sm:py-6"
                  >
                    <AccordionTrigger className="text-left">
                      <span className="text-base sm:text-lg font-semibold">{category.title}</span>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2">
                      <SectionCategoryCarousel 
                        title={category.title} 
                        defaultItems={category.items} 
                        showArrows={category.items.length > 4} 
                      />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </ResponsiveContainer>
          </section>
        )
      }
      
      case 'TV_PC_IV_LINE_BANNER_A': {
        const banners = section.banners
        if (!Array.isArray(banners) || banners.length === 0) return null
        
        return (
          <BannerCarousel
            key={`sec-${idx}`}
            banners={banners}
            setCarouselApi={setBannerApi}
          />
        )
      }
      
      case 'TV_PC_TM_PRODUCT_4X1': {
        const category = section.category
        if (!Array.isArray(category.items) || category.items.length === 0) return null
        
        return (
          <section key={`sec-${idx}`} className="w-full">
            <ResponsiveContainer>
              <div className="space-y-4">
                <SectionHeader
                  title={category.title}
                  viewMoreHref={`/products?theme=${idx + 1}`}
                  viewMoreText="View more"
                />
                <SectionFourByOne 
                  title={category.title} 
                  defaultItems={category.items} 
                />
              </div>
            </ResponsiveContainer>
          </section>
        )
      }
      
      case 'TV_TAB_TWOGRID': {
        const categories = section.categories
        if (!Array.isArray(categories) || categories.length === 0) return null
        
        return (
          <ProductTabs
            key={`sec-${idx}`}
            categories={categories}
            title={(section as any).title || '추천 상품'}
          />
        )
      }
      
      default:
        return null
    }
  }

  return (
    <LayoutProvider>

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
    </LayoutProvider>
  )
}


