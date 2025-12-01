/**
 * 제품 관련 유틸리티 함수들
 * 중복된 ProductItem 변환 로직을 통합하여 관리
 */

import type { ProductItem } from '@/features/activity/types';

/**
 * 제품 데이터를 ProductItem 형태로 변환하는 공통 함수
 * @param product - 변환할 제품 데이터
 * @returns 표준화된 ProductItem 객체
 */
export function transformToProductItem(product: unknown): ProductItem {
  const p = product as Record<string, unknown>;
  return {
    id: String(p.id || p.productId || ''),
    title: String(p.title || p.productName || p.name || ''),
    image: String(p.image || p.imageUrl || ''),
    images: (Array.isArray(p.images)
      ? p.images
      : p.image
        ? [p.image]
        : []) as string[],
    price:
      typeof p.price === 'string'
        ? Number(p.price)
        : typeof p.price === 'number'
          ? p.price
          : undefined,
    originalPrice:
      typeof p.originalPrice === 'string'
        ? Number(p.originalPrice)
        : typeof p.originalPrice === 'number'
          ? p.originalPrice
          : undefined,
    discountRate:
      typeof p.discountRate === 'string'
        ? Number(p.discountRate)
        : typeof p.discountRate === 'number'
          ? p.discountRate
          : undefined,
    rating: typeof p.rating === 'number' ? p.rating : undefined,
    reviewCount: typeof p.reviewCount === 'number' ? p.reviewCount : undefined,
    location: typeof p.location === 'string' ? p.location : undefined,
    category: typeof p.category === 'string' ? p.category : undefined,
  };
}

/**
 * 제품 배열을 ProductItem 배열로 변환
 * @param products - 변환할 제품 배열
 * @returns ProductItem 배열
 */
export function transformProductsToItems(products: unknown[]): ProductItem[] {
  return (Array.isArray(products) ? products : []).map(transformToProductItem);
}

/**
 * 제품이 유효한지 확인
 * @param product - 확인할 제품
 * @returns 유효한 제품인지 여부
 */
export function isValidProduct(product: unknown): boolean {
  if (!product || typeof product !== 'object') return false;
  const p = product as Record<string, unknown>;
  return !!(p.id || p.productId) && !!(p.title || p.productName || p.name);
}

/**
 * 제품 배열에서 유효한 제품만 필터링
 * @param products - 필터링할 제품 배열
 * @returns 유효한 제품만 포함된 배열
 */
export function filterValidProducts(products: unknown[]): unknown[] {
  return (Array.isArray(products) ? products : []).filter(isValidProduct);
}
