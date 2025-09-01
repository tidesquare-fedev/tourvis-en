"use client"

import { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

type TourImageGalleryProps = {
  images: string[]
  title: string
}

export function TourImageGallery({ images, title }: TourImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalIndex, setModalIndex] = useState(0)
  const maxThumbnails = 5
  const showMoreCount = images.length - maxThumbnails + 1
  const thumbnailListRef = useRef<HTMLDivElement>(null)

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index)
    // 모달이 열려있을 때도 modalIndex 업데이트
    if (isModalOpen) {
      setModalIndex(index)
    }
  }

  const handleSeeMoreClick = () => {
    setModalIndex(maxThumbnails - 1)
    setIsModalOpen(true)
  }

  const handleModalPrevious = () => {
    setModalIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleModalNext = () => {
    setModalIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  // currentIndex가 변경될 때 썸네일 리스트를 해당 이미지로 스크롤
  useEffect(() => {
    if (thumbnailListRef.current && currentIndex < maxThumbnails - 1) {
      const thumbnailElement = thumbnailListRef.current.children[currentIndex] as HTMLElement
      if (thumbnailElement) {
        thumbnailElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        })
      }
    }
  }, [currentIndex, maxThumbnails])

  // modalIndex가 변경될 때 모달의 썸네일 리스트를 해당 이미지로 스크롤
  useEffect(() => {
    if (isModalOpen) {
      const modalThumbnails = document.querySelector('.modal-thumbnails') as HTMLElement
      if (modalThumbnails) {
        const thumbnailElement = modalThumbnails.children[modalIndex] as HTMLElement
        if (thumbnailElement) {
          thumbnailElement.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
          })
        }
      }
    }
  }, [modalIndex, isModalOpen])

  return (
    <div className="mb-6">
      <div className="flex gap-3 md:gap-4 flex-col md:flex-row">
        {/* Main Image */}
        <div className="flex-1 relative">
          <div className="relative aspect-video sm:aspect-[3/2] md:aspect-[4/3] rounded-lg overflow-hidden">
                    <img
          src={images[currentIndex].includes('http') ? images[currentIndex] : `https://images.unsplash.com/${images[currentIndex]}?auto=format&fit=crop&w=800&h=600&q=80`}
          alt={`${title} ${currentIndex + 1}`}
          className="w-full h-full object-cover object-center"
        />
            
            {/* Navigation Buttons */}
            <button
              onClick={handlePrevious}
              className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-9 h-9 md:w-10 md:h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            
            <button
              onClick={handleNext}
              className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-9 h-9 md:w-10 md:h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>

        {/* Thumbnail List */}
        <div className="w-full md:w-24 md:aspect-[4/3]">
                     <div ref={thumbnailListRef} className="flex md:flex-col gap-2 md:h-full md:justify-between overflow-x-auto pb-2 md:pb-0 scrollbar-hide px-1 pt-1">
          {images.slice(0, maxThumbnails - 1).map((image, index) => (
            <button
              key={index}
              onClick={() => handleThumbnailClick(index)}
                             className={`relative flex-shrink-0 w-20 h-20 md:flex-initial md:h-0 md:grow rounded-lg overflow-hidden transition-all ${
                 currentIndex === index 
                   ? 'ring-2 ring-[#01c5fd] ring-offset-2' 
                   : 'hover:opacity-80'
               }`}
            >
                                <img
                    src={image.includes('http') ? image : `https://images.unsplash.com/${image}?auto=format&fit=crop&w=120&h=120&q=80`}
                    alt={`${title} thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
            </button>
          ))}
          
          {/* See More Thumbnail */}
          {images.length >= maxThumbnails && (
            <button
              onClick={handleSeeMoreClick}
              className="relative flex-shrink-0 w-20 h-20 md:flex-initial md:h-0 md:grow rounded-lg overflow-hidden transition-all hover:opacity-80"
            >
                                <img
                    src={images[maxThumbnails - 1].includes('http') ? images[maxThumbnails - 1] : `https://images.unsplash.com/${images[maxThumbnails - 1]}?auto=format&fit=crop&w=120&h=120&q=80`}
                    alt={`${title} thumbnail ${maxThumbnails}`}
                    className="w-full h-full object-cover"
                  />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-xs font-medium">See More</div>
                  <div className="text-xs">+{showMoreCount}</div>
                </div>
              </div>
            </button>
          )}
          </div>
        </div>
      </div>

      {/* Image Viewer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">상품 사진</h3>
              <button
                onClick={handleCloseModal}
                className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4">
              {/* Main Image */}
              <div className="relative mb-4">
                <div className="aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden">
                                        <img
                        src={images[modalIndex].includes('http') ? images[modalIndex] : `https://images.unsplash.com/${images[modalIndex]}?auto=format&fit=crop&w=800&h=600&q=80`}
                        alt={`${title} ${modalIndex + 1}`}
                        className="w-full h-full object-cover"
                      />
                </div>

                {/* Navigation Buttons */}
                <button
                  onClick={handleModalPrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-700" />
                </button>

                <button
                  onClick={handleModalNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-gray-700" />
                </button>

                {/* Image Counter */}
                <div className="absolute bottom-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
                  {modalIndex + 1} / {images.length}
                </div>
              </div>

                             {/* Thumbnail Strip */}
               <div className="modal-thumbnails flex gap-2 overflow-x-auto pb-2 scrollbar-hide px-1 pt-1">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setModalIndex(index)}
                                                              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden transition-all ${
                        modalIndex === index 
                          ? 'ring-2 ring-[#01c5fd] ring-offset-2' 
                          : 'hover:opacity-80'
                      }`}
                  >
                    <img
                      src={image.includes('http') ? image : `https://images.unsplash.com/${image}?auto=format&fit=crop&w=80&h=80&q=80`}
                      alt={`${title} thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
