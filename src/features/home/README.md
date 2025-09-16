# 홈 페이지 기능

이 디렉토리는 홈 페이지와 관련된 모든 기능을 포함합니다.

## 구조

```
src/features/home/
├── components/           # 홈 페이지 전용 컴포넌트들
│   ├── RegionCarousel.tsx      # 지역 캐러셀 컴포넌트
│   ├── BannerCarousel.tsx      # 배너 캐러셀 컴포넌트
│   ├── ProductTabs.tsx         # 제품 탭 컴포넌트
│   ├── SectionCategoryCarousel.tsx  # 섹션별 카테고리 캐러셀
│   └── SectionFourByOne.tsx    # 4x1 제품 섹션
├── HomePageClient.tsx    # 홈 페이지 클라이언트 컴포넌트
├── types.ts             # 홈 페이지 관련 타입 정의
└── README.md           # 이 파일
```

## 주요 컴포넌트

### HomePageClient
홈 페이지의 메인 클라이언트 컴포넌트입니다. 서버에서 받은 데이터를 기반으로 다양한 섹션을 렌더링합니다.

**Props:**
- `banners`: 배너 데이터 배열
- `regions`: 지역 데이터 배열
- `categories`: 카테고리 데이터 배열
- `sections`: 섹션 데이터 배열 (선택사항)

**주요 기능:**
- 섹션별 데이터 추출 및 정규화
- 지역 선택 상태 관리
- 캐러셀 API 상태 관리
- 각 템플릿에 따른 적절한 컴포넌트 렌더링

### RegionCarousel
지역 목록을 캐러셀로 표시하는 컴포넌트입니다.

**특징:**
- 호버 효과와 선택 상태 관리
- 반응형 디자인 지원
- 접근성 고려 (ARIA 속성, 키보드 네비게이션)
- 부드러운 애니메이션 효과

### BannerCarousel
배너 목록을 캐러셀로 표시하는 컴포넌트입니다.

**특징:**
- 자동 슬라이드 기능
- 인디케이터 표시
- 반응형 이미지 처리
- 링크 기능 지원

### ProductTabs
제품을 탭 형태로 표시하는 컴포넌트입니다.

**특징:**
- 드래그 가능한 탭
- 이모지 지원
- 그리드 레이아웃
- 반응형 디자인

## 데이터 타입

### Banner
```typescript
interface Banner {
  id: string
  image: string
  title: string
  subtitle?: string
  href?: string
}
```

### Region
```typescript
interface Region {
  id: string
  name: string
  subtitle?: string
  image: string
}
```

### Category
```typescript
interface Category {
  title: string
  items: ProductItem[]
}
```

### Section
```typescript
type Section =
  | { templateId: 'TV_TM_CAROUSEL'; regions: Region[] }
  | { templateId: 'TV_TAB_BSTP'; categories: Category[]; title?: string }
  | { templateId: 'TV_PC_IV_LINE_BANNER_A'; banners: Banner[] }
  | { templateId: 'TV_PC_TM_PRODUCT_4X1'; category: Category }
  | { templateId: 'TV_TAB_TWOGRID'; categories: Category[]; title?: string }
```

## 템플릿 시스템

홈 페이지는 템플릿 기반 시스템을 사용하여 다양한 섹션을 렌더링합니다.

### 지원하는 템플릿

1. **TV_TM_CAROUSEL**: 지역 캐러셀
2. **TV_TAB_BSTP**: 베스트 상품 탭
3. **TV_PC_IV_LINE_BANNER_A**: 라인 배너
4. **TV_PC_TM_PRODUCT_4X1**: 4x1 제품 섹션
5. **TV_TAB_TWOGRID**: 2그리드 탭

### 템플릿 추가 방법

1. `types.ts`에 새로운 템플릿 타입 추가
2. `HomePageClient.tsx`의 `renderSection` 함수에 케이스 추가
3. 필요시 전용 컴포넌트 생성

## 스타일링

홈 페이지 컴포넌트들은 다음 스타일 시스템을 사용합니다:

- **Tailwind CSS**: 유틸리티 클래스 기반 스타일링
- **컴포넌트 클래스**: `src/styles/components.css`에 정의된 재사용 가능한 클래스
- **반응형 디자인**: 모바일 우선 접근법
- **일관된 간격**: 디자인 시스템에 정의된 간격 사용

## 성능 최적화

- **React.memo**: 불필요한 리렌더링 방지
- **useCallback**: 이벤트 핸들러 메모이제이션
- **useMemo**: 복잡한 계산 결과 메모이제이션
- **지연 로딩**: 필요시에만 컴포넌트 로드

## 접근성

모든 컴포넌트는 다음 접근성 가이드라인을 준수합니다:

- **ARIA 속성**: 스크린 리더 지원
- **키보드 네비게이션**: 모든 인터랙티브 요소에 키보드 접근 가능
- **색상 대비**: WCAG 2.1 AA 수준 준수
- **포커스 관리**: 명확한 포커스 표시

## 테스트

각 컴포넌트는 다음 테스트를 포함해야 합니다:

- **렌더링 테스트**: 기본 props로 정상 렌더링 확인
- **상호작용 테스트**: 사용자 상호작용에 대한 올바른 반응 확인
- **접근성 테스트**: 접근성 가이드라인 준수 확인
- **반응형 테스트**: 다양한 화면 크기에서의 동작 확인
