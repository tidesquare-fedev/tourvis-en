'use client';

import { ProductGridSkeleton } from '@/components/ui/skeleton';
import type { ProductItem } from '@/features/activity/types';
import { useSearchDebounce } from '@/hooks/useDebounce';
import { useProductSearch } from '@/hooks/useOptimizedQueries';
import { transformToProductItem } from '@/lib/utils/product';
import { Search, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

interface OptimizedSearchBoxProps {
  /** 검색 결과를 표시할 프로바이더 ID */
  providerIds: string;
  /** 검색 결과 최대 개수 */
  maxResults?: number;
  /** 검색 결과 표시 여부 */
  showResults?: boolean;
  /** 검색 결과 클릭 핸들러 */
  onResultClick?: (product: ProductItem) => void;
  /** 검색어 변경 핸들러 */
  onSearchChange?: (keyword: string) => void;
  /** 플레이스홀더 텍스트 */
  placeholder?: string;
  /** 추가 클래스명 */
  className?: string;
}

/**
 * 최적화된 검색 박스 컴포넌트
 * Debounce, 캐싱, 로딩 상태를 포함한 고성능 검색
 */
export function OptimizedSearchBox({
  providerIds,
  maxResults = 8,
  showResults = true,
  onResultClick,
  onSearchChange,
  placeholder = '상품을 검색하세요...',
  className = '',
}: OptimizedSearchBoxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // 검색어 debounce (300ms)
  const { debouncedSearchTerm, isSearching } = useSearchDebounce(
    searchTerm,
    300,
  );

  // 검색 결과 조회
  const {
    data: searchData,
    isLoading,
    isError,
  } = useProductSearch({
    providerIds,
    keyword: debouncedSearchTerm,
    count: maxResults,
  });

  // 검색어 변경 핸들러
  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchTerm(value);
      onSearchChange?.(value);

      // 검색어가 있으면 결과 표시
      if (value.trim()) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    },
    [onSearchChange],
  );

  // 검색 결과 클릭 핸들러
  const handleResultClick = useCallback(
    (product: ProductItem) => {
      onResultClick?.(product);
      setIsOpen(false);
      setSearchTerm('');
    },
    [onResultClick],
  );

  // 외부 클릭 시 결과 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('[data-search-box]')) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isOpen]);

  // 검색 결과
  const searchResults = searchData?.items || [];
  const hasResults = searchResults.length > 0;
  const showDropdown = isOpen && (isLoading || hasResults || isError);

  return (
    <div className={`relative ${className}`} data-search-box>
      {/* 검색 입력 */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={e => handleSearchChange(e.target.value)}
          placeholder={placeholder}
          className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
        {searchTerm && (
          <button
            onClick={() => handleSearchChange('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {/* 검색 결과 드롭다운 */}
      {showDropdown && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-96 overflow-y-auto">
          {isLoading || isSearching ? (
            <div className="p-4">
              <ProductGridSkeleton count={4} />
            </div>
          ) : isError ? (
            <div className="p-4 text-center text-red-600">
              검색 중 오류가 발생했습니다.
            </div>
          ) : hasResults ? (
            <div className="py-2">
              {searchResults.map((product: unknown) => {
                const productItem = transformToProductItem(product);
                return (
                  <button
                    key={productItem.id}
                    onClick={() => handleResultClick(productItem)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-12 h-12">
                        <img
                          src={productItem.image}
                          alt={productItem.title}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {productItem.title}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {productItem.location}
                        </p>
                        {productItem.price && (
                          <p className="text-sm font-semibold text-blue-600">
                            $
                            {typeof productItem.price === 'number'
                              ? productItem.price.toLocaleString()
                              : productItem.price}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              검색 결과가 없습니다.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
