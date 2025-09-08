import type { ApiResponse, ReviewCountResult, ReviewItem, ReviewListResultRaw } from '@/types/review'

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '/en'

type PostInit = Omit<RequestInit, 'method' | 'body'> & { body?: unknown }

const postJson = async <T>(url: string, init?: PostInit): Promise<ApiResponse<T>> => {
  try {
    const res = await fetch(url, {
      method: 'POST',
      cache: 'no-store',
      headers: { 'content-type': 'application/json', ...(init?.headers || {}) },
      body: JSON.stringify(init?.body ?? {}),
    })
    const json = await res.json().catch(() => null)
    if (!res.ok) {
      return { success: false, error: 'Request failed', code: 'HTTP_ERROR', details: { status: res.status, body: json } }
    }
    return json as ApiResponse<T>
  } catch (e: unknown) {
    return { success: false, error: 'Network error', code: 'NETWORK_ERROR', details: e }
  }
}

export const reviewApi = {
  async getCount(params: { brand: string; prodCat: string; prodCd: string }): Promise<ApiResponse<ReviewCountResult>> {
    const url = `${BASE_PATH}/api/review/reviewCnt`
    return postJson<ReviewCountResult>(url, { body: params })
  },
  async getList(params: { brand: string; prodCat: string; prodCd: string; limit?: number; page?: number }): Promise<ApiResponse<ReviewListResultRaw>> {
    const url = `${BASE_PATH}/api/review/reviewList`
    return postJson<ReviewListResultRaw>(url, { body: params })
  },
}

export const normalizeReviewItems = (items: unknown[]): ReviewItem[] => {
  return (Array.isArray(items) ? items : []).map((r) => {
    const x = r as any
    return {
      name: String(x?.writer ?? x?.name ?? 'Guest'),
      rating: Number(x?.score ?? x?.rating ?? 0) || 0,
      date: String(x?.regDate ?? x?.writeDate ?? x?.date ?? ''),
      comment: String(x?.reviewCont ?? x?.content ?? x?.comment ?? ''),
      helpful: typeof x?.likeCnt === 'number' ? Number(x.likeCnt) : undefined,
      tags: Array.isArray(x?.tags) ? x.tags.map((t: unknown) => String(t)) : undefined,
    }
  })
}


