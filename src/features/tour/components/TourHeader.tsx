"use client"

import { MapPin } from 'lucide-react'

type TourHeaderProps = {
  location: string
  title: string
  subtitle: string
}

export function TourHeader({ location, title, subtitle }: TourHeaderProps) {
  return (
    <>
      <div className="flex items-center gap-2 mb-3">
        <MapPin className="w-4 h-4 text-gray-500" />
        <span className="text-gray-600">{location}</span>
      </div>
      <div className="mb-4">
        <h1 className="text-[20px] font-bold text-gray-900 mb-2">{title}</h1>
        <p className="text-[14px] text-gray-600">{subtitle}</p>
      </div>
    </>
  )
}


