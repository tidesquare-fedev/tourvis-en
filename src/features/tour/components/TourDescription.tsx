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
      <h3 className="text-[22px] font-semibold mb-6">Product Description</h3>
      <div className="space-y-6">
        {images && images.length > 0 && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            {images[0] && (
              <img 
                src={images[0]?.includes('http') ? images[0] : `https://images.unsplash.com/${images[0]}?auto=format&fit=crop&w=400&h=250&q=80`} 
                alt="Vatican Museum interior" 
                className="w-full h-48 object-cover rounded-lg" 
              />
            )}
            {images[1] && (
              <img 
                src={images[1]?.includes('http') ? images[1] : `https://images.unsplash.com/${images[1]}?auto=format&fit=crop&w=400&h=250&q=80`} 
                alt="Sistine Chapel" 
                className="w-full h-48 object-cover rounded-lg" 
              />
            )}
          </div>
        )}
        <div>
          <div 
            className={`text-gray-700 leading-relaxed mb-4 ${showFullDescription ? '' : 'line-clamp-5'}`}
            dangerouslySetInnerHTML={{ __html: description }}
          />
          {showFullDescription && (
            <div 
              className="text-gray-700 leading-relaxed mb-4"
              dangerouslySetInnerHTML={{ __html: longDescription }}
            />
          )}
          <button onClick={() => setShowFullDescription(!showFullDescription)} className="flex items-center text-gray-900 hover:text-gray-700 font-medium">
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


