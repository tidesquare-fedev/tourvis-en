# Layout Components

이 디렉토리는 애플리케이션의 레이아웃 관련 컴포넌트들을 포함합니다.

## 컴포넌트 목록

### PageLayout
기본 페이지 레이아웃 컴포넌트입니다. 모든 일반 페이지에서 사용됩니다.

**Props:**
- `children: ReactNode` - 페이지 콘텐츠
- `active?: 'tours' | 'inquiry' | 'reservation'` - 활성 네비게이션 메뉴
- `mobileTitle?: string` - 모바일에서 표시할 제목
- `className?: string` - 추가 CSS 클래스
- `showStickyNavigation?: boolean` - 스티키 네비게이션 표시 여부
- `stickyNavigationContent?: ReactNode` - 스티키 네비게이션 콘텐츠

**사용 예시:**
```tsx
<PageLayout active="tours" className="min-h-screen bg-white">
  <div>페이지 콘텐츠</div>
</PageLayout>
```

### TourDetailLayout
상품 상세 페이지 전용 레이아웃 컴포넌트입니다. 스크롤 시 메뉴 네비게이션이 나타나는 특별한 기능을 제공합니다.

**Props:**
- `children: ReactNode` - 페이지 콘텐츠
- `title: string` - 상품 제목
- `sections: Section[]` - 섹션 정보 배열
- `activeSection: string` - 현재 활성 섹션
- `onSectionClick: (sectionId: string) => void` - 섹션 클릭 핸들러
- `className?: string` - 추가 CSS 클래스

**사용 예시:**
```tsx
<TourDetailLayout
  title="상품 제목"
  sections={sections}
  activeSection={activeSection}
  onSectionClick={scrollToSection}
>
  <div>상세 페이지 콘텐츠</div>
</TourDetailLayout>
```

### LayoutProvider
경로에 따라 자동으로 적절한 레이아웃을 선택하는 프로바이더 컴포넌트입니다.

**Props:**
- `children: ReactNode` - 페이지 콘텐츠
- `tourTitle?: string` - 상품 제목 (상세 페이지용)
- `sections?: Array<{ id: string; label: string }>` - 섹션 정보 (상세 페이지용)
- `activeSection?: string` - 현재 활성 섹션 (상세 페이지용)
- `onSectionClick?: (sectionId: string) => void` - 섹션 클릭 핸들러 (상세 페이지용)

**자동 레이아웃 선택:**
- `/tour/[id]` 경로: `TourDetailLayout` 사용
- 기타 경로: `PageLayout` 사용
- 경로에 따른 자동 네비게이션 활성화
- 경로에 따른 자동 배경 스타일 적용

**사용 예시:**
```tsx
// 일반 페이지
<LayoutProvider>
  <div>일반 페이지 콘텐츠</div>
</LayoutProvider>

// 상세 페이지
<LayoutProvider
  tourTitle="상품 제목"
  sections={sections}
  activeSection={activeSection}
  onSectionClick={scrollToSection}
>
  <div>상세 페이지 콘텐츠</div>
</LayoutProvider>
```

## CSS 변수

레이아웃 컴포넌트는 다음 CSS 변수들을 사용합니다:

- `--header-height: 4rem` - 헤더 높이
- `--header-height-mobile: 3rem` - 모바일 헤더 높이
- `--sticky-nav-height: 3rem` - 스티키 네비게이션 높이
- `--content-padding: 1rem` - 콘텐츠 패딩
- `--content-padding-mobile: 0.75rem` - 모바일 콘텐츠 패딩
- `--max-content-width: 80rem` - 최대 콘텐츠 너비

## 유틸리티 클래스

- `.content-container` - 표준 콘텐츠 컨테이너
- `.header-spacing` - 헤더 높이만큼의 여백
- `.header-spacing-mobile` - 모바일 헤더 높이만큼의 여백
- `.sticky-nav-spacing` - 스티키 네비게이션 높이만큼의 여백
