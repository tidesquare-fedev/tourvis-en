# 공통 컴포넌트

이 디렉토리는 애플리케이션 전반에서 재사용되는 공통 컴포넌트들을 포함합니다.

## 컴포넌트 목록

### ProductCarousel
제품 목록을 캐러셀로 표시하는 재사용 가능한 컴포넌트입니다.

**Props:**
- `products`: 제품 데이터 배열
- `showArrows`: 화살표 표시 여부 (기본값: true)
- `minItemsForArrows`: 화살표를 표시할 최소 아이템 개수 (기본값: 4)
- `carouselOptions`: 캐러셀 옵션 (align, slidesToScroll, loop 등)
- `itemClassName`: 아이템 클래스명 커스터마이징
- `transformProduct`: 제품 변환 함수 커스터마이징

**사용 예시:**
```tsx
<ProductCarousel 
  products={productList} 
  showArrows={true}
  minItemsForArrows={4}
  carouselOptions={{
    align: 'start',
    slidesToScroll: 1,
    loop: false
  }}
/>
```

### SectionHeader
섹션 헤더를 표시하는 재사용 가능한 컴포넌트입니다.

**Props:**
- `title`: 섹션 제목
- `subtitle`: 부제목 (선택사항)
- `viewMoreHref`: "더보기" 링크 URL (선택사항)
- `viewMoreText`: "더보기" 링크 텍스트 (기본값: "View more")
- `className`: 추가 클래스명
- `level`: 제목 레벨 (h1-h6, 기본값: h2)
- `actions`: 커스텀 액션 요소

**사용 예시:**
```tsx
<SectionHeader 
  title="인기 상품" 
  subtitle="고객들이 가장 많이 선택한 상품들"
  viewMoreHref="/products"
  viewMoreText="전체 보기"
/>
```

### ResponsiveContainer
반응형 컨테이너를 제공하는 재사용 가능한 컴포넌트입니다.

**Props:**
- `children`: 컨테이너 내용
- `maxWidth`: 최대 너비 클래스 (기본값: 'max-w-7xl')
- `padding`: 패딩 클래스 (기본값: 'px-4 sm:px-6 lg:px-8')
- `className`: 추가 클래스명
- `verticalPadding`: 세로 패딩 클래스 (기본값: 'py-6 sm:py-10')
- `backgroundColor`: 배경색 클래스

**사용 예시:**
```tsx
<ResponsiveContainer>
  <h1>제목</h1>
  <p>내용</p>
</ResponsiveContainer>
```

## 스타일 가이드

모든 공통 컴포넌트는 다음 원칙을 따릅니다:

1. **일관성**: 동일한 패턴과 네이밍 컨벤션 사용
2. **재사용성**: 다양한 상황에서 사용할 수 있도록 유연한 props 제공
3. **접근성**: ARIA 속성과 키보드 네비게이션 지원
4. **반응형**: 모바일, 태블릿, 데스크톱에서 모두 잘 작동
5. **타입 안전성**: TypeScript를 활용한 완전한 타입 지원

## 개발 가이드

새로운 공통 컴포넌트를 추가할 때는 다음 사항을 고려하세요:

1. **Props 인터페이스 정의**: 명확하고 확장 가능한 props 인터페이스 작성
2. **JSDoc 주석**: 모든 props와 함수에 대한 상세한 문서화
3. **기본값 제공**: 가능한 한 모든 props에 적절한 기본값 제공
4. **에러 처리**: 잘못된 props나 데이터에 대한 적절한 처리
5. **테스트 작성**: 컴포넌트의 다양한 사용 사례에 대한 테스트 작성
6. **스토리북 스토리**: 컴포넌트의 다양한 상태를 보여주는 스토리 작성
