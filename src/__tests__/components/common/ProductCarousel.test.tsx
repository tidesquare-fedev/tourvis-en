/**
 * ProductCarousel 컴포넌트 테스트
 */

import { render, screen } from '@testing-library/react'
import { ProductCarousel } from '@/components/common/ProductCarousel'

// Mock 데이터
const mockProducts = [
  {
    id: '1',
    title: '테스트 제품 1',
    image: 'https://example.com/image1.jpg',
    price: 10000,
    rating: 4.5,
    reviewCount: 100,
  },
  {
    id: '2',
    title: '테스트 제품 2',
    image: 'https://example.com/image2.jpg',
    price: 20000,
    rating: 4.0,
    reviewCount: 50,
  },
  {
    id: '3',
    title: '테스트 제품 3',
    image: 'https://example.com/image3.jpg',
    price: 30000,
    rating: 3.5,
    reviewCount: 25,
  },
]

describe('ProductCarousel', () => {
  it('제품 목록을 올바르게 렌더링한다', () => {
    render(<ProductCarousel products={mockProducts} />)
    
    expect(screen.getByText('테스트 제품 1')).toBeInTheDocument()
    expect(screen.getByText('테스트 제품 2')).toBeInTheDocument()
    expect(screen.getByText('테스트 제품 3')).toBeInTheDocument()
  })

  it('빈 배열일 때 아무것도 렌더링하지 않는다', () => {
    const { container } = render(<ProductCarousel products={[]} />)
    
    expect(container.firstChild).toBeEmptyDOMElement()
  })

  it('화살표가 올바르게 표시된다', () => {
    const manyProducts = Array.from({ length: 10 }, (_, i) => ({
      id: `${i + 1}`,
      title: `제품 ${i + 1}`,
      image: `https://example.com/image${i + 1}.jpg`,
      price: (i + 1) * 1000,
    }))

    render(<ProductCarousel products={manyProducts} showArrows={true} />)
    
    // 화살표 버튼들이 있는지 확인
    const prevButton = screen.getByRole('button', { name: /previous/i })
    const nextButton = screen.getByRole('button', { name: /next/i })
    
    expect(prevButton).toBeInTheDocument()
    expect(nextButton).toBeInTheDocument()
  })

  it('최소 아이템 개수 미만일 때 화살표를 표시하지 않는다', () => {
    render(<ProductCarousel products={mockProducts} showArrows={true} minItemsForArrows={5} />)
    
    const prevButton = screen.queryByRole('button', { name: /previous/i })
    const nextButton = screen.queryByRole('button', { name: /next/i })
    
    expect(prevButton).not.toBeInTheDocument()
    expect(nextButton).not.toBeInTheDocument()
  })

  it('showArrows가 false일 때 화살표를 표시하지 않는다', () => {
    const manyProducts = Array.from({ length: 10 }, (_, i) => ({
      id: `${i + 1}`,
      title: `제품 ${i + 1}`,
      image: `https://example.com/image${i + 1}.jpg`,
      price: (i + 1) * 1000,
    }))

    render(<ProductCarousel products={manyProducts} showArrows={false} />)
    
    const prevButton = screen.queryByRole('button', { name: /previous/i })
    const nextButton = screen.queryByRole('button', { name: /next/i })
    
    expect(prevButton).not.toBeInTheDocument()
    expect(nextButton).not.toBeInTheDocument()
  })

  it('커스텀 아이템 클래스명이 적용된다', () => {
    const customClassName = 'custom-item-class'
    render(
      <ProductCarousel 
        products={mockProducts} 
        itemClassName={customClassName}
      />
    )
    
    const carouselItems = screen.getAllByRole('listitem')
    carouselItems.forEach(item => {
      expect(item).toHaveClass(customClassName)
    })
  })

  it('커스텀 캐러셀 옵션이 적용된다', () => {
    const customOptions = {
      align: 'center' as const,
      slidesToScroll: 2,
      loop: true
    }

    render(
      <ProductCarousel 
        products={mockProducts} 
        carouselOptions={customOptions}
      />
    )
    
    // 캐러셀이 렌더링되었는지 확인
    expect(screen.getByRole('region')).toBeInTheDocument()
  })
})
