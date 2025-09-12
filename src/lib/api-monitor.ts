// API 모니터링 및 알림 시스템
interface ApiMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  lastError?: string;
  lastErrorTime?: number;
}

class ApiMonitor {
  private metrics = new Map<string, ApiMetrics>();
  private alertThresholds = {
    errorRate: 0.5,        // 50% 오류율
    responseTime: 5000,    // 5초 응답 시간
    consecutiveErrors: 3   // 연속 3회 오류
  };

  recordRequest(apiName: string, success: boolean, responseTime: number, error?: string): void {
    const current = this.metrics.get(apiName) || {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      averageResponseTime: 0
    };

    current.totalRequests++;
    if (success) {
      current.successfulRequests++;
    } else {
      current.failedRequests++;
      current.lastError = error;
      current.lastErrorTime = Date.now();
    }

    // 평균 응답 시간 업데이트
    current.averageResponseTime = 
      (current.averageResponseTime * (current.totalRequests - 1) + responseTime) / current.totalRequests;

    this.metrics.set(apiName, current);

    // 알림 체크
    this.checkAlerts(apiName, current);
  }

  private checkAlerts(apiName: string, metrics: ApiMetrics): void {
    const errorRate = metrics.failedRequests / metrics.totalRequests;
    
    // 오류율 알림
    if (errorRate > this.alertThresholds.errorRate) {
      console.warn(`🚨 API 알림: ${apiName} 오류율이 ${(errorRate * 100).toFixed(1)}%로 높습니다.`);
    }

    // 응답 시간 알림
    if (metrics.averageResponseTime > this.alertThresholds.responseTime) {
      console.warn(`🚨 API 알림: ${apiName} 평균 응답 시간이 ${metrics.averageResponseTime.toFixed(0)}ms로 느립니다.`);
    }

    // 연속 오류 알림
    if (metrics.failedRequests >= this.alertThresholds.consecutiveErrors) {
      console.warn(`🚨 API 알림: ${apiName}에서 연속 ${metrics.failedRequests}회 오류가 발생했습니다.`);
    }
  }

  getMetrics(apiName: string): ApiMetrics | undefined {
    return this.metrics.get(apiName);
  }

  getAllMetrics(): Map<string, ApiMetrics> {
    return new Map(this.metrics);
  }

  reset(apiName?: string): void {
    if (apiName) {
      this.metrics.delete(apiName);
    } else {
      this.metrics.clear();
    }
  }

  getHealthStatus(apiName: string): 'healthy' | 'degraded' | 'unhealthy' {
    const metrics = this.metrics.get(apiName);
    if (!metrics || metrics.totalRequests < 5) return 'healthy';

    const errorRate = metrics.failedRequests / metrics.totalRequests;
    
    if (errorRate > 0.8) return 'unhealthy';
    if (errorRate > 0.3 || metrics.averageResponseTime > 10000) return 'degraded';
    return 'healthy';
  }
}

export const apiMonitor = new ApiMonitor();

// API 호출 래퍼 함수
export async function monitoredApiCall<T>(
  apiName: string,
  fn: () => Promise<T>
): Promise<T> {
  const startTime = Date.now();
  let success = false;
  let error: string | undefined;

  try {
    const result = await fn();
    success = true;
    return result;
  } catch (err) {
    error = err instanceof Error ? err.message : String(err);
    throw err;
  } finally {
    const responseTime = Date.now() - startTime;
    apiMonitor.recordRequest(apiName, success, responseTime, error);
  }
}
