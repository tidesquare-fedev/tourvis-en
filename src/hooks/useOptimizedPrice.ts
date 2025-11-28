/**
 * 최적화된 가격 조회 훅
 * 실시간 가격 변경에 대응하는 debounce 및 캐싱이 적용된 훅
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useDynamicPrice } from './useOptimizedQueries';
import { usePriceDebounce } from './useDebounce';
import { createError, ERROR_CODES } from '@/lib/error-handling';

interface PriceRequest {
  productId: string;
  optionId: string;
  selected_date: string;
  labels: Array<{ id: string; quantity: number }>;
  timeslot: { id: string };
}

interface PriceResult {
  price: number;
  originalPrice?: number;
  discountRate?: number;
  currency: string;
  isAvailable: boolean;
  error?: string;
}

interface UseOptimizedPriceOptions {
  /** Debounce 지연시간 (밀리초) */
  debounceDelay?: number;
  /** 자동 새로고침 간격 (밀리초) */
  refreshInterval?: number;
  /** 가격 조회 실패 시 재시도 횟수 */
  retryCount?: number;
  /** 가격 조회 실패 시 재시도 간격 (밀리초) */
  retryDelay?: number;
}

/**
 * 최적화된 가격 조회 훅
 * 사용자 입력에 따른 debounce와 실시간 업데이트를 지원
 */
export function useOptimizedPrice(options: UseOptimizedPriceOptions = {}) {
  const {
    debounceDelay = 500,
    refreshInterval,
    retryCount = 2,
    retryDelay = 1000,
  } = options;

  const [priceRequest, setPriceRequest] = useState<PriceRequest | null>(null);
  const [priceResult, setPriceResult] = useState<PriceResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentRetryCount, setCurrentRetryCount] = useState(0);

  // 가격 요청 debounce
  const { debouncedPriceParams, isCalculating: isDebouncing } =
    usePriceDebounce(priceRequest, debounceDelay);

  // 동적 가격 조회 뮤테이션
  const dynamicPriceMutation = useDynamicPrice();

  // 가격 조회 함수
  const fetchPrice = useCallback(
    async (request: PriceRequest) => {
      try {
        setIsCalculating(true);
        setError(null);

        const result = await dynamicPriceMutation.mutateAsync(request);

        if (result?.success === false) {
          throw createError(
            ERROR_CODES.DATA_NOT_FOUND,
            result.error || '가격 정보를 불러올 수 없습니다.',
          );
        }

        const priceData = result?.data || result;
        const newPriceResult: PriceResult = {
          price: priceData?.price || 0,
          originalPrice: priceData?.originalPrice,
          discountRate: priceData?.discountRate,
          currency: priceData?.currency || 'USD',
          isAvailable: priceData?.isAvailable !== false,
          error: undefined,
        };

        setPriceResult(newPriceResult);
        setCurrentRetryCount(0);
        return newPriceResult;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : '가격 조회 중 오류가 발생했습니다.';
        setError(errorMessage);

        // 재시도 로직
        if (currentRetryCount < retryCount) {
          setTimeout(() => {
            setCurrentRetryCount(prev => prev + 1);
            fetchPrice(request);
          }, retryDelay);
        }

        throw err;
      } finally {
        setIsCalculating(false);
      }
    },
    [dynamicPriceMutation, retryCount, retryDelay],
  );

  // Debounced 가격 조회
  useEffect(() => {
    if (debouncedPriceParams) {
      fetchPrice(debouncedPriceParams).catch(() => {
        // 에러는 이미 fetchPrice에서 처리됨
      });
    }
  }, [debouncedPriceParams, fetchPrice]);

  // 자동 새로고침
  useEffect(() => {
    if (!refreshInterval || !priceRequest) return;

    const interval = setInterval(() => {
      if (priceRequest) {
        fetchPrice(priceRequest).catch(() => {
          // 에러는 이미 fetchPrice에서 처리됨
        });
      }
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval, priceRequest, fetchPrice]);

  // 가격 요청 업데이트
  const updatePriceRequest = useCallback((request: PriceRequest) => {
    setPriceRequest(request);
    setCurrentRetryCount(0);
  }, []);

  // 가격 요청 초기화
  const resetPriceRequest = useCallback(() => {
    setPriceRequest(null);
    setPriceResult(null);
    setError(null);
    setCurrentRetryCount(0);
  }, []);

  // 수동 가격 조회 (debounce 없이 즉시 실행)
  const fetchPriceImmediate = useCallback(
    async (request: PriceRequest) => {
      return fetchPrice(request);
    },
    [fetchPrice],
  );

  // 가격 요청 유효성 검사
  const isValidRequest = useCallback(
    (request: PriceRequest | null): boolean => {
      if (!request) return false;

      return !!(
        request.productId &&
        request.optionId &&
        request.selected_date &&
        request.labels &&
        request.labels.length > 0 &&
        request.timeslot?.id
      );
    },
    [],
  );

  // 현재 상태
  const isLoading =
    isCalculating || isDebouncing || dynamicPriceMutation.isPending;
  const hasError = !!error || dynamicPriceMutation.isError;
  const currentError = error || (dynamicPriceMutation.error as Error)?.message;

  // 가격 포맷팅
  const formattedPrice = useMemo(() => {
    if (!priceResult) return null;

    const { price, currency, originalPrice, discountRate } = priceResult;

    return {
      current: `${currency} ${price.toLocaleString()}`,
      original: originalPrice
        ? `${currency} ${originalPrice.toLocaleString()}`
        : null,
      discount: discountRate ? `${discountRate}%` : null,
      isDiscounted: !!(originalPrice && discountRate && discountRate > 0),
    };
  }, [priceResult]);

  return {
    // 상태
    priceResult,
    formattedPrice,
    isLoading,
    hasError,
    error: currentError,
    isCalculating: isCalculating || isDebouncing,

    // 액션
    updatePriceRequest,
    resetPriceRequest,
    fetchPriceImmediate,

    // 유틸리티
    isValidRequest: isValidRequest(priceRequest),
    retryCount: currentRetryCount,
  };
}

/**
 * 간단한 가격 조회 훅 (debounce 없이)
 */
export function useSimplePrice() {
  const dynamicPriceMutation = useDynamicPrice();

  const fetchPrice = useCallback(
    async (request: PriceRequest) => {
      try {
        const result = await dynamicPriceMutation.mutateAsync(request);

        if (result?.success === false) {
          throw createError(
            ERROR_CODES.DATA_NOT_FOUND,
            result.error || '가격 정보를 불러올 수 없습니다.',
          );
        }

        const priceData = result?.data || result;
        return {
          price: priceData?.price || 0,
          originalPrice: priceData?.originalPrice,
          discountRate: priceData?.discountRate,
          currency: priceData?.currency || 'USD',
          isAvailable: priceData?.isAvailable !== false,
        };
      } catch (err) {
        throw err;
      }
    },
    [dynamicPriceMutation],
  );

  return {
    fetchPrice,
    isLoading: dynamicPriceMutation.isPending,
    error: dynamicPriceMutation.error,
  };
}
