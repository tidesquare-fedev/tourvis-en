"use client"

import { Check } from 'lucide-react'

type TourHighlightsProps = {
  highlights: string[]
}

export function TourHighlights({ highlights }: TourHighlightsProps) {
  return (
    <div className="mb-6 md:mb-8 p-3 md:p-4 bg-blue-50 rounded-lg min-w-0">
      <h3 className="text-base md:text-lg font-semibold mb-2 md:mb-3 text-blue-900">Tour Highlights</h3>
      <ul className="space-y-1.5 md:space-y-2">
        {highlights.map((highlight, index) => (
          <li key={index} className="flex items-start">
            <Check className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
            <span className="text-blue-800 text-sm md:text-base leading-relaxed">{highlight}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}


