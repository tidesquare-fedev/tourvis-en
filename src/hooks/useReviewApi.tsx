'use client'

import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { reviewApi, normalizeReviewItems } from '@/lib/api/review'
import type { ReviewItem } from '@/types/review'

type BrandCat = { brand?: string; prodCat?: string }

const DEFAULTS: Required<BrandCat> = { brand: 'TOURVIS', prodCat: 'TNT' }

export function useReviewCount(prodCd: string, ctx?: BrandCat) {
  const brand = ctx?.brand ?? DEFAULTS.brand
  const prodCat = ctx?.prodCat ?? DEFAULTS.prodCat
  return useQuery({
    queryKey: ['reviews', 'count', brand, prodCat, prodCd],
    queryFn: async () => reviewApi.getCount({ brand, prodCat, prodCd }),
    enabled: Boolean(prodCd),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  })
}

export function useReviews(prodCd: string, ctx?: BrandCat) {
  const brand = ctx?.brand ?? DEFAULTS.brand
  const prodCat = ctx?.prodCat ?? DEFAULTS.prodCat

  const countQuery = useReviewCount(prodCd, { brand, prodCat })

  const limit = useMemo(() => {
    const c = Number((countQuery.data as any)?.data?.count ?? 0) || 0
    return c > 0 ? c : 100
  }, [countQuery.data])

  const listQuery = useQuery({
    queryKey: ['reviews', 'list', brand, prodCat, prodCd, limit],
    queryFn: async () => reviewApi.getList({ brand, prodCat, prodCd, limit }),
    enabled: Boolean(prodCd) && (countQuery.isFetched || countQuery.isError),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  })

  const totalCount = useMemo(() => {
    const c = Number((countQuery.data as any)?.data?.count ?? 0) || 0
    if (c > 0) return c
    const items = (listQuery.data as any)?.data?.items
    return Array.isArray(items) ? items.length : 0
  }, [countQuery.data, listQuery.data])

  const reviews: ReviewItem[] = useMemo(() => {
    const items = (listQuery.data as any)?.data?.items
    return normalizeReviewItems(Array.isArray(items) ? items : [])
  }, [listQuery.data])

  const isLoading = countQuery.isLoading || listQuery.isLoading
  const isError = Boolean(countQuery.error || listQuery.error) ||
    ((countQuery.data as any)?.success === false) || ((listQuery.data as any)?.success === false)

  const error = (countQuery.error as Error) || (listQuery.error as Error) || undefined

  return { isLoading, isError, error, totalCount, reviews, countQuery, listQuery }
}


