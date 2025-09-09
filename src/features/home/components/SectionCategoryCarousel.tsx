"use client"

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { ActivityCard } from '@/features/activity/components/ActivityCard'
import type { ProductItem } from '@/features/activity/types'
import { useSectionProducts } from '@/hooks/useSectionProducts'

type Props = {
  title: string
  defaultItems: any[]
  showArrows?: boolean
}

export function SectionCategoryCarousel({ title, defaultItems, showArrows = true }: Props) {
  const query = useSectionProducts({ templateId: 'TV_TAB_BSTP', title })
  const items = (query.data?.items && query.data.items.length > 0) ? query.data.items : defaultItems
  const shouldShowArrows = showArrows && Array.isArray(items) && items.length > 4

  return (
    <Carousel className="w-full" opts={{ align: 'start', slidesToScroll: 1 }}>
      <CarouselContent className="-ml-2 md:-ml-4">
        {items.map((p: any) => {
          const productItem: ProductItem = {
            id: p.id,
            title: p.title,
            image: p.image,
            images: p.images || (p.image ? [p.image] : []),
            price: typeof p.price === 'string' ? Number(p.price) : p.price,
            originalPrice: typeof p.originalPrice === 'string' ? Number(p.originalPrice) : p.originalPrice,
            discountRate: typeof p.discountRate === 'string' ? Number(p.discountRate) : p.discountRate,
            rating: p.rating,
            reviewCount: p.reviewCount,
            location: p.location,
            category: p.category,
          }
          return (
            <CarouselItem key={p.id} className="pl-2 md:pl-4 basis-3/4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
              <ActivityCard item={productItem} />
            </CarouselItem>
          )
        })}
      </CarouselContent>
      {shouldShowArrows && (
        <div className="flex justify-center mt-3 space-x-4">
          <CarouselPrevious className="relative translate-x-0 translate-y-0" />
          <CarouselNext className="relative translate-x-0 translate-y-0" />
        </div>
      )}
    </Carousel>
  )
}


