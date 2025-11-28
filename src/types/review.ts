export type ApiSuccess<T> = {
  success: true;
  data: T;
  meta?: Record<string, unknown>;
};

export type ApiError = {
  success: false;
  error: string;
  code?: string;
  details?: unknown;
};

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export interface ReviewItem {
  name: string;
  rating: number;
  date: string;
  comment: string;
  helpful?: number;
  tags?: string[];
}

export interface ReviewCountResult {
  count: number;
}

export interface ReviewListResultRaw {
  items: unknown[];
  raw?: unknown;
}

export const mapRawToReviewItem = (raw: unknown): ReviewItem => {
  const r = raw as Record<string, unknown>;
  return {
    name: String(r?.writer ?? r?.name ?? 'Guest'),
    rating: Number(r?.score ?? r?.rating ?? 0) || 0,
    date: String(r?.regDate ?? r?.writeDate ?? r?.date ?? ''),
    comment: String(r?.reviewCont ?? r?.content ?? r?.comment ?? ''),
    helpful: typeof r?.likeCnt === 'number' ? Number(r.likeCnt) : undefined,
    tags: Array.isArray(r?.tags)
      ? (r.tags as unknown[]).map((t: unknown) => String(t))
      : undefined,
  };
};
