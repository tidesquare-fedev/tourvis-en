/**
 * 배치 작업 훅들
 * 여러 API 요청을 효율적으로 처리하는 훅들
 */

import {
  activityApiClient,
  homeApiClient,
  reviewApiClient,
} from '@/lib/api/optimized-api';
import { queryKeys } from '@/lib/query-client';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

/**
 * 배치 프리페치 훅
 * 여러 데이터를 미리 로드하여 사용자 경험 향상
 */
export function useBatchPrefetch() {
  const queryClient = useQueryClient();

  /**
   * 홈 페이지 관련 데이터 프리페치
   */
  const prefetchHomeData = useCallback(async () => {
    const promises = [
      // 홈 페이지 메인 데이터
      queryClient.prefetchQuery({
        queryKey: queryKeys.home.all,
        queryFn: () => homeApiClient.getHomeData(),
        staleTime: 15 * 60 * 1000, // 15분
      }),

      // 인기 섹션들 프리페치
      queryClient.prefetchQuery({
        queryKey: queryKeys.home.sectionProducts('TV_TAB_BSTP', '인기 상품'),
        queryFn: () =>
          homeApiClient.getSectionProducts({
            templateId: 'TV_TAB_BSTP',
            title: '인기 상품',
            limit: 8,
          }),
        staleTime: 10 * 60 * 1000, // 10분
      }),
    ];

    await Promise.allSettled(promises);
  }, [queryClient]);

  /**
   * 상품 상세 페이지 관련 데이터 프리페치
   */
  const prefetchProductDetail = useCallback(
    async (productId: string) => {
      const promises = [
        // 상품 기본 정보
        queryClient.prefetchQuery({
          queryKey: queryKeys.activity.product(productId),
          queryFn: () => activityApiClient.getProductDetail(productId),
          staleTime: 30 * 60 * 1000, // 30분
        }),

        // 리뷰 데이터 (최소한만)
        queryClient.prefetchQuery({
          queryKey: queryKeys.review.count(productId, 'TOURVIS', 'ACTIVITY'),
          queryFn: () =>
            reviewApiClient.getReviewCount({
              brand: 'TOURVIS',
              prodCat: 'ACTIVITY',
              prodCd: productId,
            }),
          staleTime: 10 * 60 * 1000, // 10분
        }),
      ];

      await Promise.allSettled(promises);
    },
    [queryClient],
  );

  /**
   * 검색 결과 프리페치
   */
  const prefetchSearchResults = useCallback(
    async (searchParams: {
      providerIds: string;
      keyword?: string;
      count?: number;
    }) => {
      await queryClient.prefetchQuery({
        queryKey: queryKeys.activity.products(
          searchParams.providerIds,
          searchParams.keyword,
        ),
        queryFn: () => activityApiClient.searchProducts(searchParams),
        staleTime: 5 * 60 * 1000, // 5분
      });
    },
    [queryClient],
  );

  /**
   * 관련 상품 프리페치
   */
  const prefetchRelatedProducts = useCallback(
    async (productId: string, category?: string) => {
      const promises = [
        // 같은 카테고리 상품들
        queryClient.prefetchQuery({
          queryKey: queryKeys.activity.products('ALL', category),
          queryFn: () =>
            activityApiClient.searchProducts({
              providerIds: 'ALL',
              keyword: category,
              count: 12,
            }),
          staleTime: 10 * 60 * 1000, // 10분
        }),

        // 인기 상품들
        queryClient.prefetchQuery({
          queryKey: queryKeys.home.sectionProducts('TV_TAB_BSTP', '추천 상품'),
          queryFn: () =>
            homeApiClient.getSectionProducts({
              templateId: 'TV_TAB_BSTP',
              title: '추천 상품',
              limit: 8,
            }),
          staleTime: 10 * 60 * 1000, // 10분
        }),
      ];

      await Promise.allSettled(promises);
    },
    [queryClient],
  );

  return {
    prefetchHomeData,
    prefetchProductDetail,
    prefetchSearchResults,
    prefetchRelatedProducts,
  };
}

/**
 * 배치 캐시 무효화 훅
 */
export function useBatchCacheInvalidation() {
  const queryClient = useQueryClient();

  /**
   * 상품 관련 모든 캐시 무효화
   */
  const invalidateProductRelated = useCallback(
    async (productId: string) => {
      const patterns = [
        queryKeys.activity.product(productId),
        [...queryKeys.review.all, productId],
        [...queryKeys.tna.all, productId],
      ];

      await Promise.all(
        patterns.map(pattern =>
          queryClient.invalidateQueries({ queryKey: pattern }),
        ),
      );
    },
    [queryClient],
  );

  /**
   * 검색 관련 캐시 무효화
   */
  const invalidateSearchRelated = useCallback(
    async (providerIds: string) => {
      await queryClient.invalidateQueries({
        queryKey: [...queryKeys.activity.all, 'products', providerIds],
      });
    },
    [queryClient],
  );

  /**
   * 홈 페이지 관련 캐시 무효화
   */
  const invalidateHomeRelated = useCallback(async () => {
    await queryClient.invalidateQueries({
      queryKey: queryKeys.home.all,
    });
  }, [queryClient]);

  /**
   * 모든 캐시 무효화
   */
  const invalidateAll = useCallback(async () => {
    await queryClient.invalidateQueries();
  }, [queryClient]);

  return {
    invalidateProductRelated,
    invalidateSearchRelated,
    invalidateHomeRelated,
    invalidateAll,
  };
}

/**
 * 배치 데이터 로딩 훅
 */
export function useBatchDataLoader() {
  const queryClient = useQueryClient();

  /**
   * 여러 상품 정보를 한 번에 로드
   */
  const loadMultipleProducts = useCallback(
    async (productIds: string[]) => {
      const promises = productIds.map(id =>
        queryClient.fetchQuery({
          queryKey: queryKeys.activity.product(id),
          queryFn: () => activityApiClient.getProductDetail(id),
          staleTime: 30 * 60 * 1000, // 30분
        }),
      );

      const results = await Promise.allSettled(promises);
      return results.map((result, index) => ({
        id: productIds[index],
        data: result.status === 'fulfilled' ? result.value : null,
        error: result.status === 'rejected' ? result.reason : null,
      }));
    },
    [queryClient],
  );

  /**
   * 여러 리뷰 정보를 한 번에 로드
   */
  const loadMultipleReviews = useCallback(
    async (productIds: string[]) => {
      const promises = productIds.map(id =>
        Promise.all([
          queryClient.fetchQuery({
            queryKey: queryKeys.review.count(id, 'TOURVIS', 'ACTIVITY'),
            queryFn: () =>
              reviewApiClient.getReviewCount({
                brand: 'TOURVIS',
                prodCat: 'ACTIVITY',
                prodCd: id,
              }),
            staleTime: 10 * 60 * 1000, // 10분
          }),
          queryClient.fetchQuery({
            queryKey: queryKeys.review.list(id, 'TOURVIS', 'ACTIVITY'),
            queryFn: () =>
              reviewApiClient.getReviews({
                brand: 'TOURVIS',
                prodCat: 'ACTIVITY',
                prodCd: id,
                limit: 5,
              }),
            staleTime: 5 * 60 * 1000, // 5분
          }),
        ]),
      );

      const results = await Promise.allSettled(promises);
      return results.map((result, index) => ({
        id: productIds[index],
        count: result.status === 'fulfilled' ? result.value[0] : 0,
        reviews: result.status === 'fulfilled' ? result.value[1] : [],
        error: result.status === 'rejected' ? result.reason : null,
      }));
    },
    [queryClient],
  );

  /**
   * 섹션별 상품들을 한 번에 로드
   */
  const loadSectionProducts = useCallback(
    async (
      sections: Array<{
        templateId: string;
        title?: string;
        limit?: number;
      }>,
    ) => {
      const promises = sections.map(section =>
        queryClient.fetchQuery({
          queryKey: queryKeys.home.sectionProducts(
            section.templateId,
            section.title,
            undefined,
            section.limit,
          ),
          queryFn: () => homeApiClient.getSectionProducts(section),
          staleTime: 10 * 60 * 1000, // 10분
        }),
      );

      const results = await Promise.allSettled(promises);
      return results.map((result, index) => ({
        section: sections[index],
        data: result.status === 'fulfilled' ? result.value : null,
        error: result.status === 'rejected' ? result.reason : null,
      }));
    },
    [queryClient],
  );

  return {
    loadMultipleProducts,
    loadMultipleReviews,
    loadSectionProducts,
  };
}

/**
 * 스마트 프리페치 훅
 * 사용자 행동을 기반으로 한 지능적인 프리페치
 */
export function useSmartPrefetch() {
  const queryClient = useQueryClient();
  const { prefetchProductDetail, prefetchRelatedProducts } = useBatchPrefetch();

  /**
   * 상품 카드 호버 시 관련 데이터 프리페치
   */
  const onProductHover = useCallback(
    async (productId: string, category?: string) => {
      // 상품 상세 정보 프리페치
      await prefetchProductDetail(productId);

      // 관련 상품 프리페치
      if (category) {
        await prefetchRelatedProducts(productId, category);
      }
    },
    [prefetchProductDetail, prefetchRelatedProducts],
  );

  /**
   * 검색어 입력 시 관련 데이터 프리페치
   */
  const onSearchInput = useCallback(
    async (keyword: string, providerIds: string) => {
      if (keyword.length >= 2) {
        // 검색 결과 프리페치
        await queryClient.prefetchQuery({
          queryKey: queryKeys.activity.products(providerIds, keyword),
          queryFn: () =>
            activityApiClient.searchProducts({
              providerIds,
              keyword,
              count: 8,
            }),
          staleTime: 5 * 60 * 1000, // 5분
        });
      }
    },
    [queryClient],
  );

  /**
   * 페이지 진입 시 백그라운드 프리페치
   */
  const onPageEnter = useCallback(
    async (
      pageType: 'home' | 'product' | 'search',
      params?: { productId?: string; providerIds?: string },
    ) => {
      switch (pageType) {
        case 'home':
          // 홈 페이지 관련 데이터 프리페치
          break;
        case 'product':
          if (params?.productId) {
            await prefetchProductDetail(params.productId);
          }
          break;
        case 'search':
          if (params?.providerIds) {
            // 인기 검색어 기반 프리페치
            const popularKeywords = ['관광', '투어', '액티비티', '체험'];
            await Promise.allSettled(
              popularKeywords.map(keyword =>
                queryClient.prefetchQuery({
                  queryKey: queryKeys.activity.products(
                    params.providerIds,
                    keyword,
                  ),
                  queryFn: () =>
                    activityApiClient.searchProducts({
                      providerIds: params.providerIds,
                      keyword,
                      count: 4,
                    }),
                  staleTime: 10 * 60 * 1000, // 10분
                }),
              ),
            );
          }
          break;
      }
    },
    [prefetchProductDetail, queryClient],
  );

  return {
    onProductHover,
    onSearchInput,
    onPageEnter,
  };
}
