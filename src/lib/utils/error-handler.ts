import { AppError, ErrorType } from '../types/common';

/**
 * 에러 처리 유틸리티
 */
export class ErrorHandler {
  /**
   * 에러를 사용자 친화적인 메시지로 변환
   */
  static getUserFriendlyMessage(error: AppError | Error): string {
    if (error instanceof Error && 'type' in error) {
      const appError = error as AppError;

      switch (appError.type) {
        case 'NETWORK':
          return '네트워크 연결을 확인해주세요.';
        case 'AUTHENTICATION':
          return '로그인이 필요합니다.';
        case 'AUTHORIZATION':
          return '접근 권한이 없습니다.';
        case 'NOT_FOUND':
          return '요청한 데이터를 찾을 수 없습니다.';
        case 'VALIDATION':
          return '입력한 정보를 확인해주세요.';
        case 'SERVER':
          return '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
        case 'UNKNOWN':
        default:
          return '알 수 없는 오류가 발생했습니다.';
      }
    }

    return error.message || '알 수 없는 오류가 발생했습니다.';
  }

  /**
   * 에러 로깅
   */
  static logError(error: AppError | Error, context?: string): void {
    const timestamp = new Date().toISOString();
    const contextInfo = context ? `[${context}]` : '';

    console.error(`${timestamp} ${contextInfo} Error:`, {
      message: error.message,
      type: 'type' in error ? (error as AppError).type : 'UNKNOWN',
      code: 'code' in error ? (error as AppError).code : 'UNKNOWN',
      status: 'status' in error ? (error as AppError).status : 500,
      details: 'details' in error ? (error as AppError).details : undefined,
      stack: error.stack,
    });
  }

  /**
   * 에러를 AppError로 변환
   */
  static toAppError(error: unknown, type: ErrorType = 'UNKNOWN'): AppError {
    if (error instanceof Error && 'type' in error) {
      return error as AppError;
    }

    const appError = new Error(
      error instanceof Error ? error.message : 'Unknown error occurred',
    ) as AppError;

    appError.type = type;
    appError.code = 'UNKNOWN_ERROR';
    appError.status = 500;
    appError.details = error;

    return appError;
  }

  /**
   * 에러가 특정 타입인지 확인
   */
  static isErrorType(error: unknown, type: ErrorType): boolean {
    return (
      error instanceof Error &&
      'type' in error &&
      (error as AppError).type === type
    );
  }

  /**
   * 재시도 가능한 에러인지 확인
   */
  static isRetryableError(error: AppError | Error): boolean {
    if (error instanceof Error && 'type' in error) {
      const appError = error as AppError;
      return (
        ['NETWORK', 'SERVER'].includes(appError.type) && appError.status >= 500
      );
    }
    return false;
  }
}

/**
 * React 컴포넌트용 에러 바운더리
 */
export class ComponentErrorBoundary extends Error {
  constructor(
    message: string,
    public componentName: string,
    public originalError: Error,
  ) {
    super(message);
    this.name = 'ComponentErrorBoundary';
  }
}

/**
 * API 에러 처리 데코레이터
 */
export function withErrorHandling<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  context?: string,
) {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args);
    } catch (error) {
      ErrorHandler.logError(ErrorHandler.toAppError(error), context || fn.name);
      throw error;
    }
  };
}
