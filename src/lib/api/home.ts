import type { Section } from '@/features/home/types';
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

export const homeApi = {
  getSectionProducts(body: {
    templateId: Section['templateId'];
    title?: string;
    index?: number;
    limit?: number;
  }) {
    const url = `${BASE_PATH}/api/home/section-products`;
    return postJson<{ items: unknown[] }>(url, { body });
  },
};
