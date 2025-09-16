# 리팩토링 가이드

이 문서는 Tour Ticket Explorer 프로젝트의 리팩토링 과정과 결과를 설명합니다.

## 리팩토링 목표

1. **컴포넌트 구조 명확화**: 공통 컴포넌트와 예외 컴포넌트 분리
2. **스타일 분리**: 전역 스타일과 국지 스타일 분리
3. **상태 관리 분리**: 페이지별, 컴포넌트별 상태 관리 개선
4. **레이아웃 컴포넌트 분리**: 재사용 가능한 레이아웃 시스템 구축
5. **테스트 및 문서화**: 유지보수성 향상
6. **코드 가독성 향상**: 의미 있는 변수명과 함수명 사용
7. **중복 코드 제거**: 공통 로직을 유틸리티 함수로 분리
8. **예외 처리 체계화**: 일관된 에러 처리 및 검증 시스템 구축

## 주요 변경사항

### 1. 컴포넌트 구조 개선

#### Before
```tsx
// 각 페이지에서 직접 AppHeader 사용
<div className="min-h-screen bg-white">
  <AppHeader active="tours" />
  <div className="h-16"></div>
  {/* 페이지 콘텐츠 */}
</div>
```

#### After
```tsx
// LayoutProvider를 통한 자동 레이아웃 선택
<LayoutProvider>
  {/* 페이지 콘텐츠 */}
</LayoutProvider>
```

### 2. 레이아웃 컴포넌트 분리

#### 새로 생성된 컴포넌트
- `PageLayout`: 일반 페이지용 레이아웃
- `TourDetailLayout`: 상세 페이지용 레이아웃 (스티키 네비게이션 포함)
- `LayoutProvider`: 경로별 자동 레이아웃 선택

#### 장점
- 코드 중복 제거
- 일관된 레이아웃 관리
- 유지보수성 향상

### 3. 상태 관리 개선

#### Before
```tsx
// 상세 페이지에서 모든 상태를 직접 관리
const [selectedDate, setSelectedDate] = useState<Date | undefined>()
const [quantity, setQuantity] = useState(0)
const [activeSection, setActiveSection] = useState('options')
// ... 더 많은 상태들
```

#### After
```tsx
// 커스텀 훅으로 상태 관리 분리
const {
  selectedDate,
  quantity,
  activeSection,
  setSelectedDate,
  handleQuantityChange,
  scrollToSection,
} = useTourDetailState(sections)
```

### 4. CSS 변수 및 유틸리티 클래스

#### 추가된 CSS 변수
```css
:root {
  --header-height: 4rem;
  --header-height-mobile: 3rem;
  --sticky-nav-height: 3rem;
  --content-padding: 1rem;
  --content-padding-mobile: 0.75rem;
  --max-content-width: 80rem;
}
```

### 5. 공통 유틸리티 함수

#### 새로 생성된 유틸리티
- `src/lib/utils/product.ts`: 제품 데이터 변환 및 검증
- `src/lib/utils/carousel.ts`: 캐러셀 관련 공통 로직
- `src/lib/utils/string.ts`: 문자열 처리 유틸리티
- `src/lib/error-handling.ts`: 에러 처리 시스템
- `src/lib/validation.ts`: 데이터 검증 시스템

#### 장점
- 중복 코드 제거
- 일관된 데이터 처리
- 타입 안전성 향상
- 재사용성 증대

### 6. 공통 컴포넌트

#### 새로 생성된 컴포넌트
- `ProductCarousel`: 재사용 가능한 제품 캐러셀
- `SectionHeader`: 섹션 헤더 컴포넌트
- `ResponsiveContainer`: 반응형 컨테이너
- `RegionCarousel`: 지역 캐러셀
- `BannerCarousel`: 배너 캐러셀
- `ProductTabs`: 제품 탭 컴포넌트

### 7. 스타일 시스템

#### 컴포넌트 스타일
```css
/* src/styles/components.css */
.carousel-container { @apply w-full; }
.product-card { @apply overflow-hidden hover:shadow-lg transition-shadow duration-300; }
.section-header { @apply flex items-baseline justify-between mb-4 sm:mb-6; }
```

#### 유틸리티 클래스
```css
/* src/styles/utilities.css */
.hover-lift { @apply transition-transform duration-300 hover:-translate-y-1; }
.focus-ring { @apply focus:outline-none focus:ring-2 focus:ring-blue-500; }
.responsive-container { @apply mx-auto max-w-7xl px-4 sm:px-6 lg:px-8; }
```

### 8. 테스트 시스템

#### 테스트 설정
- Jest + React Testing Library
- 커버리지 임계값 설정 (70%)
- Next.js 환경 최적화
- Mock 설정 완료

#### 테스트 파일
- `src/__tests__/components/common/`: 공통 컴포넌트 테스트
- `src/__tests__/lib/utils/`: 유틸리티 함수 테스트
  --sticky-nav-height: 3rem;
  --content-padding: 1rem;
  --content-padding-mobile: 0.75rem;
  --max-content-width: 80rem;
}
```

#### 유틸리티 클래스
```css
.content-container {
  max-width: var(--max-content-width);
  margin: 0 auto;
  padding: 0 var(--content-padding);
}

.header-spacing {
  height: var(--header-height);
}

.sticky-nav-spacing {
  height: var(--sticky-nav-height);
}
```

## 파일 구조

```
src/
├── components/
│   ├── layout/
│   │   ├── PageLayout.tsx
│   │   ├── TourDetailLayout.tsx
│   │   ├── LayoutProvider.tsx
│   │   ├── __tests__/
│   │   │   └── PageLayout.test.tsx
│   │   └── README.md
│   └── shared/
│       └── AppHeader.tsx
├── features/
│   └── tour/
│       └── hooks/
│           ├── useTourDetailState.ts
│           ├── __tests__/
│           │   └── useTourDetailState.test.ts
│           └── README.md
└── app/
    ├── globals.css
    └── [pages]/
```

## 사용법

### 일반 페이지
```tsx
import { LayoutProvider } from '@/components/layout/LayoutProvider'

export default function MyPage() {
  return (
    <LayoutProvider>
      <div>페이지 콘텐츠</div>
    </LayoutProvider>
  )
}
```

### 상세 페이지
```tsx
import { LayoutProvider } from '@/components/layout/LayoutProvider'
import { useTourDetailState } from '@/features/tour/hooks/useTourDetailState'

export default function TourDetailPage() {
  const sections = [
    { id: 'options', label: 'Options', ref: optionsRef },
    { id: 'description', label: 'Description', ref: descriptionRef },
  ]

  const { activeSection, scrollToSection } = useTourDetailState(sections)

  return (
    <LayoutProvider
      tourTitle="상품 제목"
      sections={sections}
      activeSection={activeSection}
      onSectionClick={scrollToSection}
    >
      <div>상세 페이지 콘텐츠</div>
    </LayoutProvider>
  )
}
```

## 테스트

### 레이아웃 컴포넌트 테스트
```bash
npm test src/components/layout/__tests__/PageLayout.test.tsx
```

### 상태 관리 훅 테스트
```bash
npm test src/features/tour/hooks/__tests__/useTourDetailState.test.ts
```

## 장점

1. **코드 재사용성**: 공통 레이아웃 로직을 재사용
2. **유지보수성**: 중앙화된 레이아웃 관리
3. **일관성**: 모든 페이지에서 일관된 레이아웃
4. **확장성**: 새로운 페이지 타입 추가 용이
5. **테스트 가능성**: 컴포넌트별 독립적인 테스트

## 향후 개선사항

1. **다크 모드 지원**: CSS 변수를 활용한 테마 시스템
2. **애니메이션**: 페이지 전환 애니메이션 추가
3. **접근성**: ARIA 속성 및 키보드 네비게이션 개선
4. **성능 최적화**: 레이지 로딩 및 메모이제이션
5. **국제화**: 다국어 지원을 위한 레이아웃 조정
