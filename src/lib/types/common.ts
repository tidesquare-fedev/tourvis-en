// 공통 타입 정의
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  code?: string;
  details?: unknown;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  count: number;
  total?: number;
}

export interface ApiError {
  message: string;
  code: string;
  status: number;
  details?: unknown;
}

// API 요청 기본 설정
export interface ApiRequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  body?: unknown;
  timeout?: number;
}

// 캐시 설정
export interface CacheConfig {
  ttl: number; // Time to live in milliseconds
  key: string;
  tags?: string[];
}

// 에러 타입
export type ErrorType =
  | 'NETWORK'
  | 'VALIDATION'
  | 'AUTHENTICATION'
  | 'AUTHORIZATION'
  | 'NOT_FOUND'
  | 'SERVER'
  | 'UNKNOWN';

export interface AppError extends Error {
  type: ErrorType;
  code: string;
  status: number;
  details?: unknown;
}
