'use client'

import { useCallback, useMemo, useState } from 'react'

export type FiltersState = {
  locations: string[]
  category: string
  priceRange: [number, number]
}

type UseFiltersStateArgs = {
  initialPriceMin?: number
  initialPriceMax?: number
}

export function useFiltersState({ initialPriceMin = 0, initialPriceMax = 0 }: UseFiltersStateArgs) {
  const initial: FiltersState = useMemo(() => {
    const min = Number.isFinite(initialPriceMin) ? initialPriceMin : 0
    const max = Number.isFinite(initialPriceMax) && initialPriceMax > min ? initialPriceMax : Math.max(min + 1, 200)
    return { locations: [], category: '', priceRange: [min, max] }
  }, [initialPriceMin, initialPriceMax])

  const [filters, setFilters] = useState<FiltersState>(initial)

  const setLocations = useCallback((locations: string[]) => setFilters((s) => ({ ...s, locations })), [])
  const setCategory = useCallback((category: string) => setFilters((s) => ({ ...s, category })), [])
  const setPriceRange = useCallback((priceRange: [number, number]) => setFilters((s) => ({ ...s, priceRange })), [])

  const replace = useCallback((next: FiltersState) => setFilters(next), [])

  return { filters, setLocations, setCategory, setPriceRange, replace }
}


