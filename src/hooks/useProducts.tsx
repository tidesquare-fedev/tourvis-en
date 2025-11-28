'use client';

import { useQuery } from '@tanstack/react-query';
import { activityApi } from '@/lib/api/activity';
import type { ProductItem } from '@/features/activity/types';

export function useProducts(providerIds: string, keyword?: string) {
  return useQuery({
    queryKey: ['activity', 'products', providerIds, keyword ?? ''],
    enabled: Boolean(providerIds),
    queryFn: async () => activityApi.search({ providerIds, keyword }),
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    select: (res): { items: ProductItem[] } => {
      if ((res as any)?.success === false) return { items: [] };
      const items = (res as any)?.data?.items as ProductItem[] | undefined;
      return { items: Array.isArray(items) ? items : [] };
    },
  });
}
