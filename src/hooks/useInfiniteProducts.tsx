'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchProductsInfinite } from '@/features/activity/lib/searchApi';
import type { ProductItem } from '@/features/activity/types';

interface UseInfiniteProductsOptions {
  providerIds: string;
  keyword?: string;
  pageSize?: number;
  enabled?: boolean;
}

export function useInfiniteProducts({
  providerIds,
  keyword,
  pageSize = 20,
  enabled = true,
}: UseInfiniteProductsOptions) {
  return useInfiniteQuery({
    queryKey: ['activity', 'products', 'infinite', providerIds, keyword ?? ''],
    queryFn: async ({ pageParam = 0 }) => {
      const result = await fetchProductsInfinite(
        providerIds,
        pageParam,
        pageSize,
        keyword,
      );
      if (!result.ok) {
        throw new Error(result.errorBody || 'Failed to fetch products');
      }
      return result;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.hasMore) return undefined;
      return allPages.length;
    },
    enabled: enabled && Boolean(providerIds),
    staleTime: 2 * 60 * 1000, // 2분
    gcTime: 10 * 60 * 1000, // 10분
    refetchOnWindowFocus: false,
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

// 무한 스크롤 데이터를 평면화하는 헬퍼
export function useFlattenedProducts(options: UseInfiniteProductsOptions) {
  const query = useInfiniteProducts(options);

  const products: ProductItem[] =
    query.data?.pages.flatMap(page => page.items) ?? [];
  const total = query.data?.pages[0]?.total ?? 0;
  const hasMore =
    query.data?.pages[query.data.pages.length - 1]?.hasMore ?? false;

  return {
    ...query,
    products,
    total,
    hasMore,
    isEmpty: products.length === 0 && !query.isLoading,
    isRefreshing: query.isFetching && !query.isFetchingNextPage,
  };
}
