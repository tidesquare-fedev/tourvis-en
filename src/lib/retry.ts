// Exponential backoff retry logic
interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
}

const defaultRetryConfig: RetryConfig = {
  maxRetries: 3,
  baseDelay: 1000, // 1초
  maxDelay: 10000, // 10초
  backoffMultiplier: 2
};

export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  config: Partial<RetryConfig> = {}
): Promise<T> {
  const finalConfig = { ...defaultRetryConfig, ...config };
  let lastError: Error;

  for (let attempt = 0; attempt <= finalConfig.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      // 마지막 시도이거나 재시도할 수 없는 오류인 경우
      if (attempt === finalConfig.maxRetries || !shouldRetry(error as Error)) {
        throw lastError;
      }

      // 지수 백오프로 대기 시간 계산
      const delay = Math.min(
        finalConfig.baseDelay * Math.pow(finalConfig.backoffMultiplier, attempt),
        finalConfig.maxDelay
      );

      console.log(`API 호출 실패 (시도 ${attempt + 1}/${finalConfig.maxRetries + 1}), ${delay}ms 후 재시도...`);
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
}

function shouldRetry(error: Error): boolean {
  // 503, 502, 504, 429 오류는 재시도 가능
  const retryableStatusCodes = [502, 503, 504, 429];
  
  if (error.message.includes('503')) return true;
  if (error.message.includes('502')) return true;
  if (error.message.includes('504')) return true;
  if (error.message.includes('429')) return true;
  
  // 네트워크 오류도 재시도 가능
  if (error.message.includes('fetch')) return true;
  if (error.message.includes('network')) return true;
  
  return false;
}
