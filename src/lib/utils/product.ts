/**
 * 제품 관련 유틸리티 함수들
 * 중복된 ProductItem 변환 로직을 통합하여 관리
 */

import type { ProductItem } from '@/features/activity/types'

/**
 * 제품 데이터를 ProductItem 형태로 변환하는 공통 함수
 * @param product - 변환할 제품 데이터
 * @returns 표준화된 ProductItem 객체
 */
export function transformToProductItem(product: any): ProductItem {
  return {
    id: String(product.id || product.productId || ''),
    title: String(product.title || product.productName || product.name || ''),
    image: String(product.image || product.imageUrl || ''),
    images: product.images || (product.image ? [product.image] : []),
    price: typeof product.price === 'string' ? Number(product.price) : product.price,
    originalPrice: typeof product.originalPrice === 'string' ? Number(product.originalPrice) : product.originalPrice,
    discountRate: typeof product.discountRate === 'string' ? Number(product.discountRate) : product.discountRate,
    rating: product.rating,
    reviewCount: product.reviewCount,
    location: product.location,
    category: product.category,
  }
}

/**
 * 제품 배열을 ProductItem 배열로 변환
 * @param products - 변환할 제품 배열
 * @returns ProductItem 배열
 */
export function transformProductsToItems(products: any[]): ProductItem[] {
  return (Array.isArray(products) ? products : []).map(transformToProductItem)
}

/**
 * 제품이 유효한지 확인
 * @param product - 확인할 제품
 * @returns 유효한 제품인지 여부
 */
export function isValidProduct(product: any): boolean {
  return product && 
         (product.id || product.productId) && 
         (product.title || product.productName || product.name)
}

/**
 * 제품 배열에서 유효한 제품만 필터링
 * @param products - 필터링할 제품 배열
 * @returns 유효한 제품만 포함된 배열
 */
export function filterValidProducts(products: any[]): any[] {
  return (Array.isArray(products) ? products : []).filter(isValidProduct)
}
