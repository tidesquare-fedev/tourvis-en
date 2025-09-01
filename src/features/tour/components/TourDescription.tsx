"use client"

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

type TourDescriptionProps = {
  description: string
  longDescription: string
  images: string[]
}

export function TourDescription({ description, longDescription, images }: TourDescriptionProps) {
  const [showFullDescription, setShowFullDescription] = useState(false)
  return (
    <div className="mb-14">
      <h3 className="text-xl font-semibold mb-6">Product Description</h3>
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <img 
            src={images[0]?.includes('http') ? images[0] : `https://images.unsplash.com/${images[0]}?auto=format&fit=crop&w=400&h=250&q=80`} 
            alt="Vatican Museum interior" 
            className="w-full h-48 object-cover rounded-lg" 
          />
          <img 
            src={images[1]?.includes('http') ? images[1] : `https://images.unsplash.com/${images[1]}?auto=format&fit=crop&w=400&h=250&q=80`} 
            alt="Sistine Chapel" 
            className="w-full h-48 object-cover rounded-lg" 
          />
        </div>
        <div>
          <p className="text-gray-700 leading-relaxed mb-4">{description}</p>
          {showFullDescription && <p className="text-gray-700 leading-relaxed mb-4">{longDescription}</p>}
          <button onClick={() => setShowFullDescription(!showFullDescription)} className="flex items-center text-blue-600 hover:text-blue-700 font-medium">
            {showFullDescription ? (
              <>
                Show Less <ChevronUp className="w-4 h-4 ml-1" />
              </>
            ) : (
              <>
                Show More <ChevronDown className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}


