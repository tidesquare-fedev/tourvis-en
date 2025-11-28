'use client';

import { ActivityCard } from '@/features/activity/components/ActivityCard';
import type { ProductItem } from '@/features/activity/types';
import { memo } from 'react';

interface SearchResultsProps {
  items: ProductItem[];
  isLoading: boolean;
  totalCount: number;
  className?: string;
}

export const SearchResults = memo(function SearchResults({
  items,
  isLoading,
  totalCount,
  className = '',
}: SearchResultsProps) {
  if (isLoading) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        <p className="text-gray-500 mt-2">Loading tours...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <p className="text-gray-500">No tours match your current filters.</p>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* 상품 개수 표시 */}
      <div className="mb-6">
        <p className="text-gray-600">{totalCount} tours found</p>
      </div>

      {/* 상품 그리드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {items.map(item => (
          <ActivityCard key={item.id} item={item as ProductItem} />
        ))}
      </div>
    </div>
  );
});
