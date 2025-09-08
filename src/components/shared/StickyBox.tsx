"use client"

import { ReactNode, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

type StickyBoxProps = {
  children: ReactNode
  topOffset?: number // px from viewport top
  enableBelow?: number // enable sticky only when viewport width >= this (px)
  boundarySelector?: string // CSS selector for the scroll boundary container
  triggerSelector?: string // element after which sticky should start
}

// Robust sticky/floating wrapper that doesn't depend on CSS sticky (works inside transformed/overflow parents)
export function StickyBox({ children, topOffset = 112, enableBelow = 1024, boundarySelector = '.booking-container', triggerSelector }: StickyBoxProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const boxRef = useRef<HTMLDivElement | null>(null)
  const [isEnabled, setIsEnabled] = useState<boolean>(true)

  const compute = useCallback(() => {
    const container = containerRef.current
    const box = boxRef.current
    if (!container || !box) return

    const vw = window.innerWidth
    if (vw < enableBelow) {
      // Reset on mobile
      box.style.position = 'static'
      box.style.top = ''
      box.style.left = ''
      box.style.width = ''
      box.style.transform = ''
      setIsEnabled(false)
      return
    }
    setIsEnabled(true)

    const boundary = (boundarySelector ? (container.closest(boundarySelector) as HTMLElement | null) : null) || (boundarySelector ? (document.querySelector(boundarySelector) as HTMLElement | null) : null)
    const boundaryRect = boundary ? boundary.getBoundingClientRect() : container.getBoundingClientRect()
    const containerRect = container.getBoundingClientRect() // wrapper for width/offset within boundary
    const boxRect = box.getBoundingClientRect()
    const scrollY = window.scrollY || window.pageYOffset
    const boundaryTop = boundaryRect.top + scrollY
    const boundaryBottom = boundaryTop + boundaryRect.height
    const containerTop = containerRect.top + scrollY
    const offsetWithinBoundary = containerTop - boundaryTop
    const boxHeight = boxRect.height
    const left = containerRect.left + window.pageXOffset
    const width = containerRect.width

    // stickyStart: either container top or trigger bottom if provided
    let stickyStart = containerTop
    if (triggerSelector) {
      const el = document.querySelector(triggerSelector) as HTMLElement | null
      if (el) {
        const r = el.getBoundingClientRect()
        stickyStart = (r.top + scrollY) + r.height
      }
    }
    const stickyEnd = boundaryBottom - boxHeight - offsetWithinBoundary
    const currentTop = scrollY + topOffset

    // reserve space to prevent layout shift when fixed
    // container must span the whole boundary height so that absolute pinning works within it
    container.style.minHeight = `${Math.max(Math.ceil(boundaryRect.height), Math.ceil(boxRect.height))}px`

    if (currentTop <= stickyStart) {
      // Static
      box.style.position = 'static'
      box.style.top = ''
      box.style.left = ''
      box.style.width = ''
      box.style.transform = ''
      box.style.zIndex = ''
    } else if (currentTop >= stickyEnd) {
      // Pin to bottom inside container (absolute)
      box.style.position = 'absolute'
      // Place box at boundary bottom (relative to container)
      const pinnedTop = boundaryBottom - containerTop - boxHeight
      box.style.top = `${Math.max(0, pinnedTop)}px`
      box.style.left = '0px'
      box.style.width = `${width}px`
      box.style.zIndex = '30'
    } else {
      // Fixed to viewport with computed left/width
      box.style.position = 'fixed'
      box.style.top = `${topOffset}px`
      box.style.left = `${left}px`
      box.style.width = `${width}px`
      box.style.zIndex = '30'
    }
  }, [topOffset, enableBelow, boundarySelector])

  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(compute)
    }
    const onResize = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(compute)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    compute()
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [compute])

  useLayoutEffect(() => {
    compute()
  }, [compute])

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <div ref={boxRef} aria-live={isEnabled ? 'off' : 'polite'}>
        {children}
      </div>
    </div>
  )
}


