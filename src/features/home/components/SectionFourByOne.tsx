"use client"

import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import { ActivityCard } from '@/features/activity/components/ActivityCard'
import type { ProductItem } from '@/features/activity/types'
import { useSectionProducts } from '@/hooks/useSectionProducts'

type Props = {
  title: string
  defaultItems: any[]
}

export function SectionFourByOne({ title, defaultItems }: Props) {
  const query = useSectionProducts({ templateId: 'TV_PC_TM_PRODUCT_4X1', title })
  const items = (query.data?.items && query.data.items.length > 0) ? query.data.items : defaultItems
  const shouldShowArrows = Array.isArray(items) && items.length > 4

  return (
    <Carousel className="w-full relative" opts={{ align: 'start' }}>
      <CarouselContent className="-ml-2 md:-ml-4">
        {items.map((p) => {
          const productItem: ProductItem = {
            id: (p as any).id,
            title: (p as any).title,
            image: (p as any).image,
            images: (p as any).images || ((p as any).image ? [(p as any).image] : []),
            price: typeof (p as any).price === 'string' ? Number((p as any).price) : (p as any).price,
            originalPrice: typeof (p as any).originalPrice === 'string' ? Number((p as any).originalPrice) : (p as any).originalPrice,
            discountRate: typeof (p as any).discountRate === 'string' ? Number((p as any).discountRate) : (p as any).discountRate,
            rating: (p as any).rating,
            reviewCount: (p as any).reviewCount,
            location: (p as any).location,
            category: (p as any).category,
          }
          return (
            <CarouselItem key={(p as any).id} className="pl-2 md:pl-4 basis-3/4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
              <ActivityCard item={productItem} />
            </CarouselItem>
          )
        })}
      </CarouselContent>
      {shouldShowArrows && (
        <div className="flex justify-center mt-3 space-x-4">
          {/* 재사용 가능한 Carousel 버튼 */}
        </div>
      )}
    </Carousel>
  )
}


