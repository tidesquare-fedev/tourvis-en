"use client"

import { useState } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { ChevronDown, ChevronUp } from 'lucide-react'

type TourDescriptionProps = {
  description: string
  longDescription: string
  images: string[]
}

export function TourDescription({ description, longDescription, images }: TourDescriptionProps) {
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [isViewerOpen, setIsViewerOpen] = useState(false)
  const [viewerIndex, setViewerIndex] = useState(0)
  const extractImageUrls = (htmlOrText: string): string[] => {
    if (!htmlOrText || typeof htmlOrText !== 'string') return []
    const urls: string[] = []
    // <img src="..."> 태그 추출
    const imgTagRegex = /<img[^>]*src=["']([^"']+)["'][^>]*>/gi
    let m: RegExpExecArray | null
    while ((m = imgTagRegex.exec(htmlOrText)) !== null) {
      const u = String(m[1] || '').trim()
      if (u) urls.push(u)
    }
    // 텍스트 내 직접 URL (이미지 확장자)
    const urlRegex = /(https?:\/\/[^\s"']+\.(?:png|jpe?g|gif|webp|svg)(?:\?[^\s"']*)?)/gi
    let mm: RegExpExecArray | null
    while ((mm = urlRegex.exec(htmlOrText)) !== null) {
      const u = String(mm[1] || '').trim()
      if (u) urls.push(u)
    }
    // 고유화
    return Array.from(new Set(urls))
  }
  const descriptionImages = extractImageUrls(description || longDescription)
  const firstImage = descriptionImages[0]
  const stripImageTags = (htmlOrText: string): string => {
    if (!htmlOrText || typeof htmlOrText !== 'string') return ''
    return htmlOrText.replace(/<img[^>]*>/gi, '')
  }
  const sanitizedDescription = stripImageTags(description)
  const sanitizedLongDescription = stripImageTags(longDescription)
  return (
    <div className="mb-14">
      <h3 className="text-[22px] font-semibold mb-6">Product Description</h3>
      <div className="space-y-6">
        {descriptionImages.length > 0 && (
          descriptionImages.length === 1 ? (
            <div className="w-full flex justify-center mb-6">
              <img
                src={firstImage}
                alt="Product description image"
                className="max-h-96 w-auto object-contain rounded-lg cursor-zoom-in"
                onClick={() => { setViewerIndex(0); setIsViewerOpen(true) }}
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 mb-6">
              {descriptionImages.map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt={`Product description image ${idx + 1}`}
                  className="w-full h-48 object-cover rounded-lg cursor-zoom-in"
                  onClick={() => { setViewerIndex(idx); setIsViewerOpen(true) }}
                />
              ))}
            </div>
          )
        )}
        <div>
          <div 
            className={`text-gray-700 leading-relaxed mb-4 ${showFullDescription ? '' : 'line-clamp-5'}`}
            dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
          />
          {showFullDescription && (
            <div 
              className="text-gray-700 leading-relaxed mb-4"
              dangerouslySetInnerHTML={{ __html: sanitizedLongDescription }}
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
        {/* Image Viewer */}
        <Dialog open={isViewerOpen} onOpenChange={setIsViewerOpen}>
          <DialogContent className="sm:max-w-5xl max-h-[85vh] overflow-auto pt-14">
            {descriptionImages[viewerIndex] && (
              <img
                src={descriptionImages[viewerIndex]}
                alt="Product image enlarged"
                className="w-full h-auto max-h-[75vh] object-contain mx-auto rounded-lg"
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}


