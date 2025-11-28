/**
 * 에러 처리 유틸리티
 * 애플리케이션 전반에서 일관된 에러 처리를 위한 유틸리티 함수들
 */

export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
}

export interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  metadata?: Record<string, any>;
}

/**
 * 애플리케이션 에러 클래스
 * 표준화된 에러 처리를 위한 커스텀 에러 클래스
 */
export class AppErrorClass extends Error {
  public readonly code: string;
  public readonly details?: any;
  public readonly timestamp: Date;
  public readonly context?: ErrorContext;

  constructor(
    code: string,
    message: string,
    details?: any,
    context?: ErrorContext,
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.details = details;
    this.timestamp = new Date();
    this.context = context;
  }
}

/**
 * 에러 코드 상수
 * 애플리케이션에서 사용하는 모든 에러 코드를 중앙 관리
 */
export const ERROR_CODES = {
  // 네트워크 관련 에러
  NETWORK_ERROR: 'NETWORK_ERROR',
  API_TIMEOUT: 'API_TIMEOUT',
  API_RATE_LIMIT: 'API_RATE_LIMIT',

  // 데이터 관련 에러
  DATA_VALIDATION_ERROR: 'DATA_VALIDATION_ERROR',
  DATA_NOT_FOUND: 'DATA_NOT_FOUND',
  DATA_PARSE_ERROR: 'DATA_PARSE_ERROR',

  // 인증/권한 관련 에러
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
  SESSION_EXPIRED: 'SESSION_EXPIRED',

  // UI 관련 에러
  COMPONENT_RENDER_ERROR: 'COMPONENT_RENDER_ERROR',
  USER_INTERACTION_ERROR: 'USER_INTERACTION_ERROR',

  // 시스템 관련 에러
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  CONFIGURATION_ERROR: 'CONFIGURATION_ERROR',
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

/**
 * 에러 메시지 매핑
 * 에러 코드에 따른 사용자 친화적인 메시지 제공
 */
export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  [ERROR_CODES.NETWORK_ERROR]: '네트워크 연결을 확인해주세요.',
  [ERROR_CODES.API_TIMEOUT]: '요청 시간이 초과되었습니다. 다시 시도해주세요.',
  [ERROR_CODES.API_RATE_LIMIT]:
    '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.',
  [ERROR_CODES.DATA_VALIDATION_ERROR]: '입력 데이터가 올바르지 않습니다.',
  [ERROR_CODES.DATA_NOT_FOUND]: '요청하신 데이터를 찾을 수 없습니다.',
  [ERROR_CODES.DATA_PARSE_ERROR]: '데이터를 처리하는 중 오류가 발생했습니다.',
  [ERROR_CODES.AUTHENTICATION_ERROR]: '로그인이 필요합니다.',
  [ERROR_CODES.AUTHORIZATION_ERROR]: '접근 권한이 없습니다.',
  [ERROR_CODES.SESSION_EXPIRED]: '세션이 만료되었습니다. 다시 로그인해주세요.',
  [ERROR_CODES.COMPONENT_RENDER_ERROR]:
    '화면을 불러오는 중 오류가 발생했습니다.',
  [ERROR_CODES.USER_INTERACTION_ERROR]: '사용자 작업 중 오류가 발생했습니다.',
  [ERROR_CODES.UNKNOWN_ERROR]: '알 수 없는 오류가 발생했습니다.',
  [ERROR_CODES.CONFIGURATION_ERROR]: '시스템 설정에 문제가 있습니다.',
};

/**
 * 에러 생성 헬퍼 함수
 * @param code - 에러 코드
 * @param message - 에러 메시지 (선택사항, 기본값은 ERROR_MESSAGES에서 가져옴)
 * @param details - 추가 상세 정보
 * @param context - 에러 컨텍스트
 * @returns AppErrorClass 인스턴스
 */
export function createError(
  code: ErrorCode,
  message?: string,
  details?: any,
  context?: ErrorContext,
): AppErrorClass {
  return new AppErrorClass(
    code,
    message || ERROR_MESSAGES[code],
    details,
    context,
  );
}

/**
 * 에러 로깅 함수
 * @param error - 로깅할 에러
 * @param additionalContext - 추가 컨텍스트 정보
 */
export function logError(
  error: Error | AppErrorClass,
  additionalContext?: ErrorContext,
): void {
  const errorInfo = {
    name: error.name,
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    ...(error instanceof AppErrorClass && {
      code: error.code,
      details: error.details,
      context: { ...error.context, ...additionalContext },
    }),
  };

  // 개발 환경에서는 콘솔에 출력
  if (process.env.NODE_ENV === 'development') {
    console.error('Error logged:', errorInfo);
  }

  // 프로덕션 환경에서는 에러 로깅 서비스로 전송
  // TODO: 실제 에러 로깅 서비스 연동 (예: Sentry, LogRocket 등)
}

/**
 * 안전한 함수 실행 래퍼
 * @param fn - 실행할 함수
 * @param errorCode - 에러 발생 시 사용할 에러 코드
 * @param context - 에러 컨텍스트
 * @returns 함수 실행 결과 또는 에러
 */
export async function safeExecute<T>(
  fn: () => Promise<T> | T,
  errorCode: ErrorCode = ERROR_CODES.UNKNOWN_ERROR,
  context?: ErrorContext,
): Promise<{ data?: T; error?: AppErrorClass }> {
  try {
    const data = await fn();
    return { data };
  } catch (error) {
    const appError =
      error instanceof AppErrorClass
        ? error
        : createError(
            errorCode,
            error instanceof Error ? error.message : 'Unknown error',
            error,
            context,
          );

    logError(appError, context);
    return { error: appError };
  }
}

/**
 * API 에러 처리 헬퍼
 * @param response - API 응답
 * @param context - 에러 컨텍스트
 * @returns 처리된 에러 또는 null
 */
export function handleApiError(
  response: Response,
  context?: ErrorContext,
): AppErrorClass | null {
  if (response.ok) return null;

  let errorCode: ErrorCode = ERROR_CODES.UNKNOWN_ERROR;
  let message = 'API 요청 중 오류가 발생했습니다.';

  switch (response.status) {
    case 400:
      errorCode = ERROR_CODES.DATA_VALIDATION_ERROR;
      message = '잘못된 요청입니다.';
      break;
    case 401:
      errorCode = ERROR_CODES.AUTHENTICATION_ERROR;
      message = '인증이 필요합니다.';
      break;
    case 403:
      errorCode = ERROR_CODES.AUTHORIZATION_ERROR;
      message = '접근 권한이 없습니다.';
      break;
    case 404:
      errorCode = ERROR_CODES.DATA_NOT_FOUND;
      message = '요청하신 리소스를 찾을 수 없습니다.';
      break;
    case 408:
      errorCode = ERROR_CODES.API_TIMEOUT;
      message = '요청 시간이 초과되었습니다.';
      break;
    case 429:
      errorCode = ERROR_CODES.API_RATE_LIMIT;
      message = '요청이 너무 많습니다.';
      break;
    case 500:
    case 502:
    case 503:
    case 504:
      errorCode = ERROR_CODES.UNKNOWN_ERROR;
      message = '서버 오류가 발생했습니다.';
      break;
  }

  return createError(
    errorCode,
    message,
    { status: response.status, statusText: response.statusText },
    context,
  );
}
