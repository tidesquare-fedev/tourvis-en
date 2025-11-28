/**
 * product 유틸리티 함수 테스트
 */

import {
  transformToProductItem,
  transformProductsToItems,
  isValidProduct,
  filterValidProducts,
} from '@/lib/utils/product';

describe('product utils', () => {
  describe('transformToProductItem', () => {
    it('올바른 제품 데이터를 ProductItem으로 변환한다', () => {
      const mockProduct = {
        id: '123',
        title: '테스트 제품',
        image: 'https://example.com/image.jpg',
        price: '10000',
        originalPrice: '12000',
        discountRate: '20',
        rating: 4.5,
        reviewCount: 100,
        location: '서울',
        category: '관광',
        href: 'https://example.com/product/123',
      };

      const result = transformToProductItem(mockProduct);

      expect(result).toEqual({
        id: '123',
        title: '테스트 제품',
        image: 'https://example.com/image.jpg',
        images: ['https://example.com/image.jpg'],
        price: 10000,
        originalPrice: 12000,
        discountRate: 20,
        rating: 4.5,
        reviewCount: 100,
        location: '서울',
        category: '관광',
        href: 'https://example.com/product/123',
      });
    });

    it('문자열 가격을 숫자로 변환한다', () => {
      const mockProduct = {
        id: '123',
        title: '테스트 제품',
        image: 'https://example.com/image.jpg',
        price: '15000',
        originalPrice: '20000',
        discountRate: '25',
      };

      const result = transformToProductItem(mockProduct);

      expect(result.price).toBe(15000);
      expect(result.originalPrice).toBe(20000);
      expect(result.discountRate).toBe(25);
    });

    it('이미지 배열이 없을 때 단일 이미지로 배열을 생성한다', () => {
      const mockProduct = {
        id: '123',
        title: '테스트 제품',
        image: 'https://example.com/image.jpg',
      };

      const result = transformToProductItem(mockProduct);

      expect(result.images).toEqual(['https://example.com/image.jpg']);
    });

    it('이미지 배열이 있을 때 그대로 사용한다', () => {
      const mockProduct = {
        id: '123',
        title: '테스트 제품',
        image: 'https://example.com/image.jpg',
        images: [
          'https://example.com/image1.jpg',
          'https://example.com/image2.jpg',
        ],
      };

      const result = transformToProductItem(mockProduct);

      expect(result.images).toEqual([
        'https://example.com/image1.jpg',
        'https://example.com/image2.jpg',
      ]);
    });

    it('빈 객체를 안전하게 처리한다', () => {
      const result = transformToProductItem({});

      expect(result.id).toBe('');
      expect(result.title).toBe('');
      expect(result.image).toBe('');
      expect(result.images).toEqual([]);
    });
  });

  describe('transformProductsToItems', () => {
    it('제품 배열을 ProductItem 배열로 변환한다', () => {
      const mockProducts = [
        { id: '1', title: '제품 1', image: 'image1.jpg' },
        { id: '2', title: '제품 2', image: 'image2.jpg' },
      ];

      const result = transformProductsToItems(mockProducts);

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('1');
      expect(result[1].id).toBe('2');
    });

    it('배열이 아닌 경우 빈 배열을 반환한다', () => {
      const result = transformProductsToItems(null as any);

      expect(result).toEqual([]);
    });

    it('빈 배열을 처리한다', () => {
      const result = transformProductsToItems([]);

      expect(result).toEqual([]);
    });
  });

  describe('isValidProduct', () => {
    it('유효한 제품을 올바르게 식별한다', () => {
      const validProduct = {
        id: '123',
        title: '테스트 제품',
        image: 'https://example.com/image.jpg',
      };

      expect(isValidProduct(validProduct)).toBe(true);
    });

    it('productId가 있는 경우도 유효하다고 판단한다', () => {
      const validProduct = {
        productId: '123',
        productName: '테스트 제품',
        image: 'https://example.com/image.jpg',
      };

      expect(isValidProduct(validProduct)).toBe(true);
    });

    it('name이 있는 경우도 유효하다고 판단한다', () => {
      const validProduct = {
        id: '123',
        name: '테스트 제품',
        image: 'https://example.com/image.jpg',
      };

      expect(isValidProduct(validProduct)).toBe(true);
    });

    it('ID가 없는 제품은 무효하다고 판단한다', () => {
      const invalidProduct = {
        title: '테스트 제품',
        image: 'https://example.com/image.jpg',
      };

      expect(isValidProduct(invalidProduct)).toBe(false);
    });

    it('제목이 없는 제품은 무효하다고 판단한다', () => {
      const invalidProduct = {
        id: '123',
        image: 'https://example.com/image.jpg',
      };

      expect(isValidProduct(invalidProduct)).toBe(false);
    });

    it('null이나 undefined는 무효하다고 판단한다', () => {
      expect(isValidProduct(null)).toBe(false);
      expect(isValidProduct(undefined)).toBe(false);
    });
  });

  describe('filterValidProducts', () => {
    it('유효한 제품만 필터링한다', () => {
      const products = [
        { id: '1', title: '제품 1', image: 'image1.jpg' },
        { id: '2', title: '제품 2' }, // 이미지 없음
        { productId: '3', productName: '제품 3', image: 'image3.jpg' },
        { id: '4' }, // 제목 없음
        { name: '5', title: '제품 5', image: 'image5.jpg' },
      ];

      const result = filterValidProducts(products);

      expect(result).toHaveLength(3);
      expect(result[0].id).toBe('1');
      expect(result[1].productId).toBe('3');
      expect(result[2].name).toBe('5');
    });

    it('배열이 아닌 경우 빈 배열을 반환한다', () => {
      const result = filterValidProducts(null as any);

      expect(result).toEqual([]);
    });

    it('빈 배열을 처리한다', () => {
      const result = filterValidProducts([]);

      expect(result).toEqual([]);
    });
  });
});
