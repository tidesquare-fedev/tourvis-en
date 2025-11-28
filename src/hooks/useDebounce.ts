/**
 * Debounce 및 Throttle 훅들
 * 사용자 입력 기반 API 호출 최적화를 위한 훅들
 */

import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Debounce 훅
 * 연속된 호출을 지연시켜 마지막 호출만 실행
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Debounced 콜백 훅
 * 함수 호출을 debounce하여 성능 최적화
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  deps: React.DependencyList = [],
): T {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const callbackRef = useRef(callback);

  // 최신 콜백 참조 유지
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const debouncedCallback = useCallback(
    ((...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, delay);
    }) as T,
    [delay, ...deps],
  );

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback;
}

/**
 * Throttle 훅
 * 일정 시간 간격으로만 함수 실행을 허용
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  deps: React.DependencyList = [],
): T {
  const lastRunRef = useRef<number>(0);
  const callbackRef = useRef(callback);

  // 최신 콜백 참조 유지
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const throttledCallback = useCallback(
    ((...args: Parameters<T>) => {
      const now = Date.now();

      if (now - lastRunRef.current >= delay) {
        lastRunRef.current = now;
        callbackRef.current(...args);
      }
    }) as T,
    [delay, ...deps],
  );

  return throttledCallback;
}

/**
 * 검색 입력을 위한 특화된 debounce 훅
 */
export function useSearchDebounce(
  initialValue: string = '',
  delay: number = 300,
) {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(initialValue);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setIsSearching(false);
    }, delay);

    if (searchTerm !== debouncedSearchTerm) {
      setIsSearching(true);
    }

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, delay, debouncedSearchTerm]);

  const reset = useCallback(() => {
    setSearchTerm('');
    setDebouncedSearchTerm('');
    setIsSearching(false);
  }, []);

  return {
    searchTerm,
    debouncedSearchTerm,
    isSearching,
    setSearchTerm,
    reset,
  };
}

/**
 * 가격 조회를 위한 특화된 debounce 훅
 * 가격 API는 자주 호출되므로 더 짧은 지연시간 사용
 */
export function usePriceDebounce(
  initialValue: any = null,
  delay: number = 500,
) {
  const [priceParams, setPriceParams] = useState(initialValue);
  const [debouncedPriceParams, setDebouncedPriceParams] =
    useState(initialValue);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedPriceParams(priceParams);
      setIsCalculating(false);
    }, delay);

    if (JSON.stringify(priceParams) !== JSON.stringify(debouncedPriceParams)) {
      setIsCalculating(true);
    }

    return () => {
      clearTimeout(handler);
    };
  }, [priceParams, delay, debouncedPriceParams]);

  const reset = useCallback(() => {
    setPriceParams(null);
    setDebouncedPriceParams(null);
    setIsCalculating(false);
  }, []);

  return {
    priceParams,
    debouncedPriceParams,
    isCalculating,
    setPriceParams,
    reset,
  };
}

/**
 * 필터링을 위한 debounce 훅
 */
export function useFilterDebounce<T extends Record<string, any>>(
  initialFilters: T = {} as T,
  delay: number = 400,
) {
  const [filters, setFilters] = useState<T>(initialFilters);
  const [debouncedFilters, setDebouncedFilters] = useState<T>(initialFilters);
  const [isFiltering, setIsFiltering] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedFilters(filters);
      setIsFiltering(false);
    }, delay);

    if (JSON.stringify(filters) !== JSON.stringify(debouncedFilters)) {
      setIsFiltering(true);
    }

    return () => {
      clearTimeout(handler);
    };
  }, [filters, delay, debouncedFilters]);

  const updateFilter = useCallback((key: keyof T, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const updateFilters = useCallback((newFilters: Partial<T>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
    setDebouncedFilters(initialFilters);
    setIsFiltering(false);
  }, [initialFilters]);

  return {
    filters,
    debouncedFilters,
    isFiltering,
    updateFilter,
    updateFilters,
    resetFilters,
  };
}

/**
 * 무한 스크롤을 위한 throttle 훅
 */
export function useInfiniteScrollThrottle(
  callback: () => void,
  delay: number = 200,
) {
  const throttledCallback = useThrottle(callback, delay, [callback]);

  const handleScroll = useCallback(() => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

    // 스크롤이 하단 근처에 도달했을 때
    if (scrollTop + clientHeight >= scrollHeight - 100) {
      throttledCallback();
    }
  }, [throttledCallback]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return { handleScroll };
}
