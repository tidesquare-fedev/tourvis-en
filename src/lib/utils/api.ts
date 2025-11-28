import {
  ApiResponse,
  ApiRequestConfig,
  AppError,
  ErrorType,
} from '../types/common';

/**
 * 통합 API 클라이언트
 * 모든 API 호출을 표준화하고 에러 처리를 통합
 */
export class ApiClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  /**
   * HTTP 요청 실행
   */
  async request<T = any>(
    endpoint: string,
    config: ApiRequestConfig = {},
  ): Promise<ApiResponse<T>> {
    const { method = 'GET', headers = {}, body, timeout = 10000 } = config;

    const url = `${this.baseUrl}${endpoint}`;
    const requestHeaders = { ...this.defaultHeaders, ...headers };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        method,
        headers: requestHeaders,
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw this.createError(
          response.status,
          data?.error || 'Request failed',
          data,
        );
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw this.createError(408, 'Request timeout', { timeout });
        }
        throw this.createError(500, error.message, error);
      }
      throw this.createError(500, 'Unknown error occurred', error);
    }
  }

  /**
   * GET 요청
   */
  async get<T = any>(
    endpoint: string,
    config?: Omit<ApiRequestConfig, 'method' | 'body'>,
  ) {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  /**
   * POST 요청
   */
  async post<T = any>(
    endpoint: string,
    body?: any,
    config?: Omit<ApiRequestConfig, 'method'>,
  ) {
    return this.request<T>(endpoint, { ...config, method: 'POST', body });
  }

  /**
   * PUT 요청
   */
  async put<T = any>(
    endpoint: string,
    body?: any,
    config?: Omit<ApiRequestConfig, 'method'>,
  ) {
    return this.request<T>(endpoint, { ...config, method: 'PUT', body });
  }

  /**
   * PATCH 요청
   */
  async patch<T = any>(
    endpoint: string,
    body?: any,
    config?: Omit<ApiRequestConfig, 'method'>,
  ) {
    return this.request<T>(endpoint, { ...config, method: 'PATCH', body });
  }

  /**
   * DELETE 요청
   */
  async delete<T = any>(
    endpoint: string,
    config?: Omit<ApiRequestConfig, 'method' | 'body'>,
  ) {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }

  /**
   * 에러 생성
   */
  private createError(
    status: number,
    message: string,
    details?: any,
  ): AppError {
    const error = new Error(message) as AppError;
    error.type = this.getErrorType(status);
    error.code = this.getErrorCode(status);
    error.status = status;
    error.details = details;
    return error;
  }

  /**
   * HTTP 상태 코드에 따른 에러 타입 결정
   */
  private getErrorType(status: number): ErrorType {
    if (status >= 400 && status < 500) {
      if (status === 401) return 'AUTHENTICATION';
      if (status === 403) return 'AUTHORIZATION';
      if (status === 404) return 'NOT_FOUND';
      if (status === 422) return 'VALIDATION';
      return 'NETWORK';
    }
    if (status >= 500) return 'SERVER';
    return 'UNKNOWN';
  }

  /**
   * HTTP 상태 코드에 따른 에러 코드 결정
   */
  private getErrorCode(status: number): string {
    const codes: Record<number, string> = {
      400: 'BAD_REQUEST',
      401: 'UNAUTHORIZED',
      403: 'FORBIDDEN',
      404: 'NOT_FOUND',
      408: 'TIMEOUT',
      422: 'VALIDATION_ERROR',
      429: 'RATE_LIMITED',
      500: 'INTERNAL_ERROR',
      502: 'BAD_GATEWAY',
      503: 'SERVICE_UNAVAILABLE',
    };
    return codes[status] || 'UNKNOWN_ERROR';
  }
}

// 기본 API 클라이언트 인스턴스
export const apiClient = new ApiClient();

// Next.js API 라우트용 헬퍼 함수들
export function createApiResponse<T = any>(
  data: T,
  status: number = 200,
  message?: string,
): Response {
  return new Response(
    JSON.stringify({
      success: true,
      data,
      message,
    }),
    {
      status,
      headers: { 'Content-Type': 'application/json' },
    },
  );
}

export function createApiError(
  error: string,
  status: number = 500,
  code?: string,
  details?: any,
): Response {
  return new Response(
    JSON.stringify({
      success: false,
      error,
      code,
      details,
    }),
    {
      status,
      headers: { 'Content-Type': 'application/json' },
    },
  );
}

// 요청 검증 헬퍼
export function validateRequiredFields(
  body: Record<string, any>,
  requiredFields: string[],
): { isValid: boolean; missingFields: string[] } {
  const missingFields = requiredFields.filter(field => !body[field]);
  return {
    isValid: missingFields.length === 0,
    missingFields,
  };
}

// 이메일 검증
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// 전화번호 검증 (한국 형식)
export function validatePhone(phone: string): boolean {
  const phoneRegex = /^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}
