'use client'

import Link from 'next/link'
import { memo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import type { ProductItem } from '@/features/activity/types'
import { ActivityCardThumbnail } from '@/features/activity/components/ActivityCardThumbnail'
import { ActivityCardMeta } from '@/features/activity/components/ActivityCardMeta'
import { ActivityCardPrice } from '@/features/activity/components/ActivityCardPrice'

type Props = {
  item: ProductItem
}

const ActivityCardComponent = ({ item }: Props) => {
  return (
    <Link href={`/activity/product/${encodeURIComponent(item.id)}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer h-full">
        <ActivityCardThumbnail image={item.image} title={item.title} />
        <CardContent className="p-3 sm:p-4">
          <ActivityCardMeta title={item.title} category={item.category} location={item.location} rating={item.rating} reviewCount={item.reviewCount} />
          <ActivityCardPrice price={item.price} originalPrice={item.originalPrice} discountRate={item.discountRate} />
        </CardContent>
      </Card>
    </Link>
  )
}

export const ActivityCard = memo(ActivityCardComponent)


