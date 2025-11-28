/**
 * 최적화된 쿼리 훅들
 * 캐싱, 중복 제거, 에러 처리가 최적화된 React Query 훅들
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys, queryOptions, cacheUtils } from '@/lib/query-client';
import {
  homeApiClient,
  activityApiClient,
  reviewApiClient,
  tnaApiClient,
} from '@/lib/api/optimized-api';
import { createError, ERROR_CODES } from '@/lib/error-handling';
import { useCallback, useMemo } from 'react';

/**
 * 홈 페이지 데이터 훅
 */
export function useHomeData() {
  return useQuery({
    queryKey: queryKeys.home.all,
    queryFn: () => homeApiClient.getHomeData(),
    ...queryOptions.static,
    select: data => {
      if (!data?.success) {
        throw createError(
          ERROR_CODES.DATA_NOT_FOUND,
          '홈 페이지 데이터를 불러올 수 없습니다.',
        );
      }
      return data.data;
    },
  });
}

/**
 * 섹션별 상품 조회 훅
 */
export function useSectionProducts(params: {
  templateId: string;
  title?: string;
  index?: number;
  limit?: number;
}) {
  const { templateId, title, index, limit } = params;

  return useQuery({
    queryKey: queryKeys.home.sectionProducts(templateId, title, index, limit),
    queryFn: () => homeApiClient.getSectionProducts(params),
    enabled: Boolean(templateId),
    ...queryOptions.dynamic,
    select: data => {
      if (!data?.success) {
        return { items: [] };
      }
      return { items: data.data?.items || [] };
    },
  });
}

/**
 * 상품 검색 훅
 */
export function useProductSearch(params: {
  providerIds: string;
  keyword?: string;
  count?: number;
  offset?: number;
}) {
  const { providerIds, keyword, count, offset } = params;

  return useQuery({
    queryKey: queryKeys.activity.products(providerIds, keyword),
    queryFn: () => activityApiClient.searchProducts(params),
    enabled: Boolean(providerIds),
    ...queryOptions.dynamic,
    select: data => {
      if (!data?.success) {
        return { items: [] };
      }
      return { items: data.data?.items || [] };
    },
  });
}

/**
 * 상품 상세 조회 훅
 */
export function useProductDetail(productId: string) {
  return useQuery({
    queryKey: queryKeys.activity.product(productId),
    queryFn: () => activityApiClient.getProductDetail(productId),
    enabled: Boolean(productId),
    ...queryOptions.static,
    select: data => {
      if (!data?.success) {
        throw createError(
          ERROR_CODES.DATA_NOT_FOUND,
          '상품 정보를 불러올 수 없습니다.',
        );
      }
      return data.data;
    },
  });
}

/**
 * 리뷰 개수 조회 훅
 */
export function useReviewCount(params: {
  brand: string;
  prodCat: string;
  prodCd: string;
}) {
  const { brand, prodCat, prodCd } = params;

  return useQuery({
    queryKey: queryKeys.review.count(prodCd, brand, prodCat),
    queryFn: () => reviewApiClient.getReviewCount(params),
    enabled: Boolean(prodCd && brand && prodCat),
    ...queryOptions.dynamic,
    select: data => {
      if (!data?.success) {
        return 0;
      }
      return data.data?.count || 0;
    },
  });
}

/**
 * 리뷰 목록 조회 훅
 */
export function useReviews(params: {
  brand: string;
  prodCat: string;
  prodCd: string;
  limit?: number;
}) {
  const { brand, prodCat, prodCd, limit } = params;

  return useQuery({
    queryKey: queryKeys.review.list(prodCd, brand, prodCat, limit),
    queryFn: () => reviewApiClient.getReviews(params),
    enabled: Boolean(prodCd && brand && prodCat),
    ...queryOptions.dynamic,
    select: data => {
      if (!data?.success) {
        return { items: [] };
      }
      return { items: data.data?.items || [] };
    },
  });
}

/**
 * TNA 상품 옵션 조회 훅 (날짜형)
 */
export function useTnaOptionsDateType(productId: string, date: string) {
  return useQuery({
    queryKey: queryKeys.tna.options.dateType(productId, date),
    queryFn: () => tnaApiClient.getProductOptionsDateType(productId, date),
    enabled: Boolean(productId && date),
    ...queryOptions.dynamic,
    retry: 2, // TNA API는 재시도 횟수를 줄임
    select: data => {
      if (!data?.success) {
        throw createError(
          ERROR_CODES.DATA_NOT_FOUND,
          '상품 옵션을 불러올 수 없습니다.',
        );
      }
      return data.data;
    },
  });
}

/**
 * TNA 상품 옵션 조회 훅 (기간형)
 */
export function useTnaOptionsPeriodType(productId: string) {
  return useQuery({
    queryKey: queryKeys.tna.options.periodType(productId),
    queryFn: () => tnaApiClient.getProductOptionsPeriodType(productId),
    enabled: Boolean(productId),
    ...queryOptions.static,
    retry: 2,
    select: data => {
      if (!data?.success) {
        throw createError(
          ERROR_CODES.DATA_NOT_FOUND,
          '상품 옵션을 불러올 수 없습니다.',
        );
      }
      return data.data;
    },
  });
}

/**
 * 동적 가격 조회 뮤테이션
 * 가격은 실시간 데이터이므로 뮤테이션으로 처리
 */
export function useDynamicPrice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      productId: string;
      optionId: string;
      selected_date: string;
      labels: Array<{ id: string; quantity: number }>;
      timeslot: { id: string };
    }) => {
      const { productId, optionId, ...body } = params;
      return tnaApiClient.getDynamicPrice(productId, optionId, body);
    },
    onSuccess: (data, variables) => {
      // 성공 시 관련 캐시 업데이트
      const { productId, optionId } = variables;
      queryClient.setQueryData(
        queryKeys.tna.price.dynamic(productId, optionId, variables),
        data,
      );
    },
    onError: error => {
      console.error('동적 가격 조회 실패:', error);
    },
  });
}

/**
 * 캐시 무효화 훅
 */
export function useCacheInvalidation() {
  const queryClient = useQueryClient();

  const invalidateHome = useCallback(() => {
    return cacheUtils.invalidateHome();
  }, []);

  const invalidateProduct = useCallback((productId: string) => {
    return cacheUtils.invalidateProduct(productId);
  }, []);

  const invalidateReviews = useCallback((prodCd: string) => {
    return cacheUtils.invalidateReviews(prodCd);
  }, []);

  const invalidateAll = useCallback(() => {
    return cacheUtils.invalidateAll();
  }, []);

  const invalidateByPattern = useCallback((pattern: string[]) => {
    return cacheUtils.invalidateByPattern(pattern);
  }, []);

  return {
    invalidateHome,
    invalidateProduct,
    invalidateReviews,
    invalidateAll,
    invalidateByPattern,
  };
}

/**
 * 프리페치 훅
 */
export function usePrefetch() {
  const queryClient = useQueryClient();

  const prefetchProductDetail = useCallback(
    async (productId: string) => {
      await queryClient.prefetchQuery({
        queryKey: queryKeys.activity.product(productId),
        queryFn: () => activityApiClient.getProductDetail(productId),
        ...queryOptions.static,
      });
    },
    [queryClient],
  );

  const prefetchReviews = useCallback(
    async (params: { brand: string; prodCat: string; prodCd: string }) => {
      await Promise.all([
        queryClient.prefetchQuery({
          queryKey: queryKeys.review.count(
            params.prodCd,
            params.brand,
            params.prodCat,
          ),
          queryFn: () => reviewApiClient.getReviewCount(params),
          ...queryOptions.dynamic,
        }),
        queryClient.prefetchQuery({
          queryKey: queryKeys.review.list(
            params.prodCd,
            params.brand,
            params.prodCat,
          ),
          queryFn: () => reviewApiClient.getReviews(params),
          ...queryOptions.dynamic,
        }),
      ]);
    },
    [queryClient],
  );

  return {
    prefetchProductDetail,
    prefetchReviews,
  };
}

/**
 * 쿼리 상태 관리 훅
 */
export function useQueryState() {
  const queryClient = useQueryClient();

  const isLoading = useMemo(() => {
    return queryClient.isFetching() > 0;
  }, [queryClient]);

  const hasError = useMemo(() => {
    return queryClient
      .getQueriesData({})
      .some(
        ([, data]) =>
          data && typeof data === 'object' && 'error' in data && data.error,
      );
  }, [queryClient]);

  const getQueryData = useCallback(
    (queryKey: string[]) => {
      return queryClient.getQueryData(queryKey);
    },
    [queryClient],
  );

  const setQueryData = useCallback(
    (queryKey: string[], data: any) => {
      queryClient.setQueryData(queryKey, data);
    },
    [queryClient],
  );

  return {
    isLoading,
    hasError,
    getQueryData,
    setQueryData,
  };
}
