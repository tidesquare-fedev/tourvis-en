'use client'

import { useMemo } from 'react'
import type { ProductItem } from '@/features/activity/types'

export function useDerivedFilters(items: ProductItem[]) {
  const categories = useMemo(() => {
    const set = new Set<string>()
    for (const it of items) if (it.category) set.add(it.category)
    return Array.from(set)
  }, [items])

  const locations = useMemo(() => {
    const set = new Set<string>()
    for (const it of items) if (it.location) set.add(it.location)
    return Array.from(set)
  }, [items])

  const price = useMemo(() => {
    const prices = items.map((it) => (typeof it.price === 'number' ? it.price : null)).filter((n): n is number => typeof n === 'number' && isFinite(n))
    if (prices.length === 0) return { min: 0, max: 0 }
    return { min: Math.min(...prices), max: Math.max(...prices) }
  }, [items])

  return { categories, locations, price }
}


