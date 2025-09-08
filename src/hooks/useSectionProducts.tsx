'use client'

import { useQuery } from '@tanstack/react-query'
import { homeApi } from '@/lib/api/home'
import type { Section } from '@/features/home/types'

export function useSectionProducts(params: { templateId: Section['templateId']; title?: string; index?: number; limit?: number }) {
  const { templateId, title, index, limit } = params
  return useQuery({
    queryKey: ['home', 'section', 'products', templateId, title ?? '', index ?? -1, limit ?? 0],
    enabled: Boolean(templateId),
    queryFn: async () => homeApi.getSectionProducts({ templateId, title, index, limit }),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    select: (res) => {
      if ((res as any)?.success === false) return { items: [] }
      const items = (res as any)?.data?.items
      return { items: Array.isArray(items) ? items : [] }
    }
  })
}


