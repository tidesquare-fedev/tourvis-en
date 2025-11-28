// Rate Limiter for API calls
interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

interface RequestRecord {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private requests = new Map<string, RequestRecord>();
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
  }

  isAllowed(key: string): boolean {
    const now = Date.now();
    const record = this.requests.get(key);

    if (!record || now > record.resetTime) {
      // 새로운 윈도우 시작
      this.requests.set(key, {
        count: 1,
        resetTime: now + this.config.windowMs,
      });
      return true;
    }

    if (record.count >= this.config.maxRequests) {
      return false;
    }

    record.count++;
    return true;
  }

  getRemainingTime(key: string): number {
    const record = this.requests.get(key);
    if (!record) return 0;

    const now = Date.now();
    return Math.max(0, record.resetTime - now);
  }
}

// TNA API용 Rate Limiter (분당 30회 제한)
export const tnaRateLimiter = new RateLimiter({
  maxRequests: 30,
  windowMs: 60 * 1000, // 1분
});

// 일반 API용 Rate Limiter (분당 100회 제한)
export const generalRateLimiter = new RateLimiter({
  maxRequests: 100,
  windowMs: 60 * 1000, // 1분
});
