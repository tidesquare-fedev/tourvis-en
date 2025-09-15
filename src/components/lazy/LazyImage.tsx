'use client'

import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { IMAGE_CONFIG } from '@/lib/constants/api'

interface LazyImageProps {
  src: string
  alt: string
  className?: string
  placeholder?: string
  fallback?: string
  onLoad?: () => void
  onError?: () => void
}

export function LazyImage({
  src,
  alt,
  className,
  placeholder = IMAGE_CONFIG.PLACEHOLDER,
  fallback = IMAGE_CONFIG.FALLBACK,
  onLoad,
  onError
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isError, setIsError] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const img = imgRef.current
    if (!img) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { threshold: IMAGE_CONFIG.LAZY_LOAD_THRESHOLD, rootMargin: IMAGE_CONFIG.LAZY_LOAD_ROOT_MARGIN }
    )

    observer.observe(img)

    return () => observer.disconnect()
  }, [])

  const handleLoad = () => {
    setIsLoaded(true)
    onLoad?.()
  }

  const handleError = () => {
    setIsError(true)
    onError?.()
  }

  const imageSrc = isInView ? (isError ? fallback : src) : placeholder

  return (
    <img
      ref={imgRef}
      src={imageSrc}
      alt={alt}
      className={cn(
        'transition-opacity duration-300',
        isLoaded && !isError ? 'opacity-100' : 'opacity-70',
        className
      )}
      onLoad={handleLoad}
      onError={handleError}
      loading="lazy"
    />
  )
}
