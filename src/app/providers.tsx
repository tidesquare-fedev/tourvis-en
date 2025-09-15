'use client'

import { ReactNode, useState } from 'react'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { API_CONFIG } from '@/lib/constants/api'

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        // 기본 staleTime 설정
        staleTime: API_CONFIG.DEFAULT_STALE_TIME,
        // 기본 gcTime 설정
        gcTime: API_CONFIG.DEFAULT_GC_TIME,
        // 윈도우 포커스 시 자동 리페치 비활성화
        refetchOnWindowFocus: false,
        // 네트워크 재연결 시 자동 리페치 활성화
        refetchOnReconnect: true,
        // 재시도 횟수 제한
        retry: (failureCount, error) => {
          // 4xx 에러는 재시도하지 않음
          if (error instanceof Error && 'status' in error && typeof error.status === 'number') {
            if (error.status >= 400 && error.status < 500) {
              return false
            }
          }
          // 최대 재시도 횟수 제한
          return failureCount < API_CONFIG.RETRY_ATTEMPTS
        },
        // 재시도 지연 시간 (지수 백오프)
        retryDelay: (attemptIndex) => Math.min(
          API_CONFIG.RETRY_DELAY_BASE * 2 ** attemptIndex, 
          API_CONFIG.RETRY_DELAY_MAX
        )
      },
      mutations: {
        // 뮤테이션 재시도 설정
        retry: 1,
        retryDelay: API_CONFIG.RETRY_DELAY_BASE
      }
    }
  }))

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {children}
      </TooltipProvider>
    </QueryClientProvider>
  )
}


