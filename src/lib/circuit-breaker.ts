// Circuit Breaker Pattern - 서비스 장애 시 자동으로 요청 차단
enum CircuitState {
  CLOSED = 'CLOSED',     // 정상 상태
  OPEN = 'OPEN',         // 차단 상태
  HALF_OPEN = 'HALF_OPEN' // 반차단 상태 (테스트 중)
}

interface CircuitBreakerConfig {
  failureThreshold: number;    // 실패 임계값
  recoveryTimeout: number;     // 복구 대기 시간 (ms)
  monitoringPeriod: number;    // 모니터링 주기 (ms)
}

class CircuitBreaker {
  private state: CircuitState = CircuitState.CLOSED;
  private failureCount = 0;
  private lastFailureTime = 0;
  private config: CircuitBreakerConfig;

  constructor(config: CircuitBreakerConfig) {
    this.config = config;
  }

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === CircuitState.OPEN) {
      if (Date.now() - this.lastFailureTime > this.config.recoveryTimeout) {
        this.state = CircuitState.HALF_OPEN;
        console.log('Circuit Breaker: HALF_OPEN 상태로 전환 (테스트 모드)');
      } else {
        throw new Error('Circuit Breaker: 서비스가 차단된 상태입니다. 잠시 후 다시 시도해주세요.');
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    this.failureCount = 0;
    if (this.state === CircuitState.HALF_OPEN) {
      this.state = CircuitState.CLOSED;
      console.log('Circuit Breaker: CLOSED 상태로 복구');
    }
  }

  private onFailure(): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();

    if (this.failureCount >= this.config.failureThreshold) {
      this.state = CircuitState.OPEN;
      console.log(`Circuit Breaker: OPEN 상태로 전환 (실패 ${this.failureCount}회)`);
    }
  }

  getState(): CircuitState {
    return this.state;
  }

  getFailureCount(): number {
    return this.failureCount;
  }

  reset(): void {
    this.state = CircuitState.CLOSED;
    this.failureCount = 0;
    this.lastFailureTime = 0;
  }
}

// TNA API용 Circuit Breaker
export const tnaCircuitBreaker = new CircuitBreaker({
  failureThreshold: 5,        // 5회 연속 실패 시 차단
  recoveryTimeout: 30000,     // 30초 후 복구 시도
  monitoringPeriod: 60000     // 1분마다 상태 확인
});
