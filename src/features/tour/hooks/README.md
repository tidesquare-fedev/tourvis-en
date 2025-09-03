# Tour Hooks

이 디렉토리는 투어 관련 커스텀 훅들을 포함합니다.

## useTourDetailState

상품 상세 페이지의 모든 상태를 관리하는 훅입니다.

### 기능
- 섹션 간 스크롤 추적
- 선택된 날짜 관리
- 수량 관리 및 검증
- 모달 상태 관리
- 섹션 간 부드러운 스크롤

### Parameters
```typescript
sections: Array<{
  id: string
  label: string
  ref: React.RefObject<HTMLDivElement>
}>
```

### Returns
```typescript
{
  // State
  selectedDate: Date | undefined
  quantity: number
  activeSection: string
  showFullDescription: boolean
  showAllReviews: boolean
  infoModal: { title: string; content: string } | null
  
  // Actions
  setSelectedDate: (date: Date | undefined) => void
  setQuantity: (quantity: number) => void
  setActiveSection: (section: string) => void
  setShowFullDescription: (show: boolean) => void
  setShowAllReviews: (show: boolean) => void
  setInfoModal: (modal: { title: string; content: string } | null) => void
  scrollToSection: (sectionId: string) => void
  handleQuantityChange: (newQuantity: number) => void
}
```

### 사용 예시
```typescript
import { useTourDetailState } from '@/features/tour/hooks/useTourDetailState'

function TourDetailPage() {
  const sections = [
    { id: 'options', label: 'Options', ref: optionsRef },
    { id: 'description', label: 'Description', ref: descriptionRef },
    { id: 'reviews', label: 'Reviews', ref: reviewsRef },
  ]

  const {
    selectedDate,
    quantity,
    activeSection,
    setSelectedDate,
    handleQuantityChange,
    scrollToSection,
  } = useTourDetailState(sections)

  return (
    <div>
      <TourDatePicker 
        selectedDate={selectedDate} 
        onSelect={setSelectedDate} 
      />
      <TourOptions 
        quantity={quantity} 
        onQuantityChange={handleQuantityChange} 
      />
      <button onClick={() => scrollToSection('reviews')}>
        리뷰로 이동
      </button>
    </div>
  )
}
```

### 주요 기능

#### 1. 섹션 추적
Intersection Observer를 사용하여 현재 보이는 섹션을 자동으로 추적합니다.

#### 2. 수량 검증
`handleQuantityChange` 함수는 수량이 유효한 범위(0 ~ maxGroup) 내에 있는지 검증합니다.

#### 3. 부드러운 스크롤
`scrollToSection` 함수는 지정된 섹션으로 부드럽게 스크롤합니다.

#### 4. 모달 관리
정보 모달의 표시/숨김 상태를 관리합니다.

### 주의사항
- `sections` 배열의 `ref`는 실제 DOM 요소를 참조해야 합니다.
- `handleQuantityChange`에서 사용하는 `maxGroup` 값은 실제 투어 데이터에서 가져와야 합니다.
- Intersection Observer는 컴포넌트 언마운트 시 자동으로 정리됩니다.
