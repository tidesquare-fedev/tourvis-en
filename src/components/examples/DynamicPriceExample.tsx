'use client';

import {
  useTnaOptions,
  type DynamicPriceRequest,
  type TnaRequestPayload,
} from '@/hooks/useTnaOptions';
import { useEffect, useState } from 'react';

interface DynamicPriceExampleProps {
  productId: string;
  selectedDate: Date;
}

// 옵션 타입 정의
interface Option {
  id: string;
  title?: string;
  name?: string;
  dynamic_price?: boolean;
  labels?: Array<{ id: string; [key: string]: unknown }>;
  timeslots?: Timeslot[];
  label_code?: string;
  [key: string]: unknown;
}

// 타임슬롯 타입 정의
interface Timeslot {
  id: string;
  title?: string;
  name?: string;
  [key: string]: unknown;
}

// 동적 가격 결과 타입 정의
interface DynamicPriceResult {
  success: boolean;
  data?: {
    price?: number;
    labels?: Array<{
      id: string;
      unit_price?: number;
      quantity?: number;
      total_price?: number;
      [key: string]: unknown;
    }>;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export function DynamicPriceExample({
  productId,
  selectedDate,
}: DynamicPriceExampleProps) {
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const [selectedTimeslot, setSelectedTimeslot] = useState<Timeslot | null>(
    null,
  );
  const [count, setCount] = useState(1);
  const [requestPayload, setRequestPayload] =
    useState<TnaRequestPayload | null>(null);
  const [dynamicPricePayload, setDynamicPricePayload] =
    useState<DynamicPriceRequest | null>(null);
  const [priceResult, setPriceResult] = useState<DynamicPriceResult | null>(
    null,
  );

  const {
    optionsQuery,
    dynamicPrice,
    createRequestPayload,
    createDynamicPricePayload,
    fetchDynamicPrice,
  } = useTnaOptions(productId, {
    calendarType: 'DATE',
    selectedDate,
  });

  // 옵션과 타임슬롯이 선택되면 payload 생성
  useEffect(() => {
    if (selectedOption && selectedTimeslot) {
      const reqPayload = createRequestPayload(
        selectedOption,
        selectedTimeslot,
        count,
      );
      const dynPayload = createDynamicPricePayload(
        selectedOption,
        selectedTimeslot,
        count,
      );

      setRequestPayload(reqPayload);
      setDynamicPricePayload(dynPayload);

      console.log('📦 생성된 요청 payload:', reqPayload);
      console.log('💰 생성된 동적 가격 payload:', dynPayload);
    }
  }, [
    selectedOption,
    selectedTimeslot,
    count,
    createRequestPayload,
    createDynamicPricePayload,
  ]);

  // 수량 변경 시 동적 가격 조회
  const handleCountChange = async (newCount: number) => {
    setCount(newCount);

    if (
      selectedOption &&
      selectedTimeslot &&
      selectedOption.dynamic_price === true
    ) {
      try {
        console.log('🔄 수량 변경으로 인한 동적 가격 조회:', {
          option: selectedOption.id,
          timeslot: selectedTimeslot.id,
          count: newCount,
        });

        // 첫 번째 라벨 ID 사용
        const firstLabelId = selectedOption.labels?.[0]?.id;
        const result = await fetchDynamicPrice(
          selectedOption,
          selectedTimeslot,
          newCount,
          firstLabelId,
        );
        setPriceResult(result);

        if (result?.success) {
          console.log('✅ 동적 가격 조회 성공:', result.data);
          // 동적 가격 결과에서 price 값 표시
          if (result.data?.price) {
            console.log('💰 동적 가격:', result.data.price);
          }
        } else {
          console.error('❌ 동적 가격 조회 실패:', result);
        }
      } catch (error) {
        console.error('❌ 동적 가격 조회 에러:', error);
      }
    }
  };

  const options = optionsQuery.data?.options || [];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">동적 가격 조회 예시</h2>

      {/* 옵션 선택 */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">옵션 선택</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {options.map((option: Option) => (
            <div
              key={option.id}
              className={`p-4 border rounded-lg cursor-pointer ${selectedOption?.id === option.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
              onClick={() => setSelectedOption(option)}
            >
              <h4 className="font-medium">{option.title || option.name}</h4>
              <p className="text-sm text-gray-600">ID: {option.id}</p>
              <p className="text-sm text-gray-600">
                동적 가격: {option.dynamic_price ? '예' : '아니오'}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 타임슬롯 선택 */}
      {selectedOption && selectedOption.timeslots && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">회차/시간 선택</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {selectedOption.timeslots.map((timeslot: Timeslot) => (
              <div
                key={timeslot.id}
                className={`p-4 border rounded-lg cursor-pointer ${selectedTimeslot?.id === timeslot.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                onClick={() => setSelectedTimeslot(timeslot)}
              >
                <h4 className="font-medium">
                  {timeslot.title || timeslot.name}
                </h4>
                <p className="text-sm text-gray-600">ID: {timeslot.id}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 수량 선택 */}
      {selectedOption && selectedTimeslot && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">수량 선택</h3>
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleCountChange(Math.max(1, count - 1))}
              className="px-3 py-1 border rounded"
            >
              -
            </button>
            <span className="text-lg font-medium">{count}</span>
            <button
              onClick={() => handleCountChange(count + 1)}
              className="px-3 py-1 border rounded"
            >
              +
            </button>
          </div>
        </div>
      )}

      {/* 요청 Payload 표시 */}
      {requestPayload && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">요청 Payload</h3>
          <div className="bg-gray-100 p-4 rounded-lg">
            <pre className="text-sm overflow-x-auto">
              {JSON.stringify(requestPayload, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* 동적 가격 Payload 표시 */}
      {dynamicPricePayload && selectedOption?.dynamic_price === true && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">동적 가격 요청 Payload</h3>
          <div className="bg-blue-100 p-4 rounded-lg">
            <pre className="text-sm overflow-x-auto">
              {JSON.stringify(dynamicPricePayload, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* 가격 결과 표시 */}
      {priceResult && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">가격 조회 결과</h3>
          {priceResult.success && priceResult.data ? (
            <div className="space-y-4">
              {/* 총 가격 표시 */}
              <div className="bg-green-100 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">총 가격:</span>
                  <span className="text-2xl font-bold text-green-600">
                    {priceResult.data.price?.toLocaleString()}원
                  </span>
                </div>
              </div>

              {/* 라벨별 가격 표시 */}
              {priceResult.data.labels &&
                priceResult.data.labels.length > 0 && (
                  <div className="bg-blue-100 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">라벨별 가격:</h4>
                    {priceResult.data.labels.map((label, index: number) => (
                      <div
                        key={index}
                        className="flex justify-between items-center py-1"
                      >
                        <span className="text-sm">{label.id}</span>
                        <div className="text-right">
                          <div className="text-sm text-gray-600">
                            단가: {label.unit_price?.toLocaleString()}원 ×{' '}
                            {label.quantity}개
                          </div>
                          <div className="font-semibold">
                            소계: {label.total_price?.toLocaleString()}원
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              {/* 전체 응답 데이터 */}
              <details className="bg-gray-100 p-4 rounded-lg">
                <summary className="cursor-pointer font-semibold">
                  전체 응답 데이터
                </summary>
                <pre className="text-sm overflow-x-auto mt-2">
                  {JSON.stringify(priceResult, null, 2)}
                </pre>
              </details>
            </div>
          ) : (
            <div className="bg-red-100 p-4 rounded-lg">
              <pre className="text-sm overflow-x-auto">
                {JSON.stringify(priceResult, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* 로딩 상태 */}
      {dynamicPrice.isPending && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-600">가격 조회 중...</p>
        </div>
      )}

      {/* 에러 상태 */}
      {dynamicPrice.error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-medium">가격 조회 실패</p>
          <p className="text-sm">{dynamicPrice.error.message}</p>
        </div>
      )}
    </div>
  );
}
