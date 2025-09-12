// Request Deduplication - 동일한 요청이 진행 중일 때 중복 실행 방지
class RequestDeduplicator {
  private pendingRequests = new Map<string, Promise<any>>();

  async deduplicate<T>(key: string, fn: () => Promise<T>): Promise<T> {
    // 이미 진행 중인 요청이 있으면 해당 Promise 반환
    if (this.pendingRequests.has(key)) {
      console.log(`중복 요청 방지: ${key}`);
      return this.pendingRequests.get(key)!;
    }

    // 새로운 요청 시작
    const promise = fn().finally(() => {
      // 요청 완료 후 Map에서 제거
      this.pendingRequests.delete(key);
    });

    this.pendingRequests.set(key, promise);
    return promise;
  }

  // 특정 키의 요청이 진행 중인지 확인
  isPending(key: string): boolean {
    return this.pendingRequests.has(key);
  }

  // 모든 진행 중인 요청 취소
  clear(): void {
    this.pendingRequests.clear();
  }
}

export const requestDeduplicator = new RequestDeduplicator();

// 요청 키 생성 헬퍼
export const createRequestKey = (prefix: string, ...parts: (string | number)[]): string => {
  return `${prefix}:${parts.join(':')}`;
};
