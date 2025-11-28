import type { ApiResponse } from '@/types/review';

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '/en';

type PostInit = Omit<RequestInit, 'method' | 'body'> & { body?: unknown };

const postJson = async <T>(
  url: string,
  init?: PostInit,
): Promise<ApiResponse<T>> => {
  try {
    const res = await fetch(url, {
      method: 'POST',
      cache: 'no-store',
      headers: { 'content-type': 'application/json', ...(init?.headers || {}) },
      body: JSON.stringify(init?.body ?? {}),
    });
    const json = await res.json().catch(() => null);
    if (!res.ok) {
      return {
        success: false,
        error: 'Request failed',
        code: 'HTTP_ERROR',
        details: { status: res.status, body: json },
      };
    }
    return json as ApiResponse<T>;
  } catch (e: unknown) {
    return {
      success: false,
      error: 'Network error',
      code: 'NETWORK_ERROR',
      details: e,
    };
  }
};

export const nextTnaApi = {
  bundle(body: { product_id: string; date: string; option_codes: string[] }) {
    const url = `${BASE_PATH}/api/tna/bundle`;
    return postJson<{ options: unknown; prices: Record<string, number> }>(url, {
      body,
    });
  },
  optionsDateType(productId: string, date: string) {
    const url = `${BASE_PATH}/api/tna/product/${encodeURIComponent(productId)}/${encodeURIComponent(date)}/options`;
    return fetch(url, { cache: 'no-store' }).then(async res => {
      const json = await res.json().catch(() => null);
      if (!res.ok)
        return {
          success: false,
          error: 'HTTP_ERROR',
          code: 'HTTP_ERROR',
          details: { status: res.status, body: json },
        } as ApiResponse<any>;
      return json as ApiResponse<unknown>;
    });
  },
  optionsPeriodType(productId: string) {
    const url = `${BASE_PATH}/api/tna/product/${encodeURIComponent(productId)}/options`;
    return fetch(url, { cache: 'no-store' }).then(async res => {
      const json = await res.json().catch(() => null);
      if (!res.ok)
        return {
          success: false,
          error: 'HTTP_ERROR',
          code: 'HTTP_ERROR',
          details: { status: res.status, body: json },
        } as ApiResponse<any>;
      return json as ApiResponse<unknown>;
    });
  },
  priceDateType(productId: string, body: unknown) {
    const url = `${BASE_PATH}/api/tna/product/${encodeURIComponent(productId)}/price/data-type`;
    return postJson<any>(url, { body });
  },
  pricePeriodType(productId: string, body: unknown) {
    const url = `${BASE_PATH}/api/tna/product/${encodeURIComponent(productId)}/price/period-type`;
    return postJson<any>(url, { body });
  },
  dynamicPrice(
    productId: string,
    optionId: string,
    body: {
      selected_date: string;
      labels: Array<{ id: string; quantity: number }>;
      timeslot: { id: string };
    },
  ) {
    const url = `${BASE_PATH}/api/tna/product/${encodeURIComponent(productId)}/options/${encodeURIComponent(optionId)}/dynamic-price`;
    return fetch(url, {
      method: 'POST',
      cache: 'no-store',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    }).then(async res => {
      const json = await res.json().catch(() => null);
      if (!res.ok) {
        return {
          success: false,
          error: 'HTTP_ERROR',
          code: 'HTTP_ERROR',
          details: { status: res.status, body: json },
        } as ApiResponse<any>;
      }
      return json as any; // 직접 데이터 반환
    });
  },
};
