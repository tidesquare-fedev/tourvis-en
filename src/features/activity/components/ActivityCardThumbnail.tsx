'use client'

import { memo } from 'react'

export const ActivityCardThumbnail = memo(function ActivityCardThumbnail({ image, title }: { image?: string | null; title: string }) {
  return (
    <div className="relative h-40 sm:h-48 overflow-hidden">
      {image && (
        <img src={image} alt={title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
      )}
    </div>
  )
})


