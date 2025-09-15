# 동적 가격 조회 기능 사용법

## 개요

이 기능은 TNA API의 동적 가격 조회 기능을 구현한 것입니다. 날짜 선택 후 옵션에서 회차/시간을 선택하면 요청 payload가 생성되고, `dynamic_price`가 `true`인 옵션의 경우 수량 변경 시마다 동적 가격을 조회합니다.

## 주요 기능

### 1. 요청 Payload 생성
날짜, 옵션, 회차/시간, 수량을 선택하면 다음과 같은 payload가 생성됩니다:

```json
{
  "startDate": "2025-09-19",
  "labelId": "LAB2001377593",
  "count": 1,
  "timeslotId": "TSL2001377596",
  "productId": "PRD2001377591",
  "optionId": "OPT2001377592"
}
```

### 2. 동적 가격 조회
`dynamic_price`가 `true`인 옵션의 경우, 수량 변경 시마다 다음 API를 호출합니다:

**엔드포인트:** `POST /api/tna/product/{productId}/options/{optionId}/dynamic-price`

**요청 Body:**
```json
{
  "selected_date": "2025-09-19",
  "labels": [
    {
      "id": "LAB2001377593",
      "quantity": 1
    }
  ],
  "timeslot": {
    "id": "TSL2001377596"
  }
}
```

## 사용법

### 1. useTnaOptions 훅 사용

```tsx
import { useTnaOptions } from '@/hooks/useTnaOptions'

const {
  optionsQuery,
  dynamicPrice,
  createRequestPayload,
  createDynamicPricePayload,
  fetchDynamicPrice
} = useTnaOptions(productId, {
  calendarType: 'DATE',
  selectedDate
})
```

### 2. 요청 Payload 생성

```tsx
// 기본 요청 payload 생성
const requestPayload = createRequestPayload(selectedOption, selectedTimeslot, count)

// 동적 가격 요청 payload 생성
const dynamicPricePayload = createDynamicPricePayload(selectedOption, selectedTimeslot, count)
```

### 3. 동적 가격 조회

```tsx
// 수량 변경 시 동적 가격 조회
const handleCountChange = async (newCount: number) => {
  if (selectedOption?.dynamic_price === true) {
    const result = await fetchDynamicPrice(selectedOption, selectedTimeslot, newCount)
    if (result?.success) {
      // 가격 정보 업데이트
      console.log('가격 조회 성공:', result.data)
    }
  }
}
```

### 4. TourDetailClient에서의 사용

기존 `TourDetailClient.tsx`에서는 수량 변경 시 자동으로 동적 가격을 조회합니다:

```tsx
// 수량 변경 시 동적 가격 조회
useEffect(() => {
  if (selectedOptionCode && selectedTimeslotId && quantity > 0) {
    const selectedOption = optionData?.options?.find((o: any) => o.id === selectedOptionCode)
    const selectedTimeslot = selectedOption?.timeslots?.find((t: any) => t.id === selectedTimeslotId)
    
    if (selectedOption && selectedTimeslot && selectedOption.dynamic_price === true) {
      handleDynamicPriceFetch(selectedOption, selectedTimeslot, quantity)
    }
  }
}, [quantity, selectedOptionCode, selectedTimeslotId, optionData])
```

## 예시 컴포넌트

`DynamicPriceExample.tsx` 컴포넌트를 참고하여 동적 가격 조회 기능을 테스트할 수 있습니다.

## API 엔드포인트

- **동적 가격 조회:** `POST /api/tna/product/{productId}/options/{optionId}/dynamic-price`
- **실제 TNA API:** `POST https://dev-apollo-api.tidesquare.com/tna-api-v2/rest/v2/product/{productId}/options/{optionId}/dynamic-price`

## 주의사항

1. `dynamic_price`가 `true`인 옵션에서만 동적 가격 조회가 실행됩니다.
2. 수량 변경 시마다 API 호출이 발생하므로 적절한 디바운싱을 고려해야 합니다.
3. 에러 처리를 적절히 구현해야 합니다.
4. 로딩 상태를 사용자에게 표시해야 합니다.
