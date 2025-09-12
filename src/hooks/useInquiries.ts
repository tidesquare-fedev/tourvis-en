import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { InquiryApi } from '@/lib/api/inquiries'
import { useNotificationStore } from '@/store/notification-store'
import { useInquiryStore } from '@/store/inquiry-store'

// Query Keys
export const inquiryKeys = {
  all: ['inquiries'] as const,
  lists: () => [...inquiryKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...inquiryKeys.lists(), filters] as const,
  details: () => [...inquiryKeys.all, 'detail'] as const,
  detail: (id: string) => [...inquiryKeys.details(), id] as const,
  replies: (id: string) => [...inquiryKeys.detail(id), 'replies'] as const,
  stats: () => [...inquiryKeys.all, 'stats'] as const,
}

/**
 * 모든 문의 조회 (관리자용)
 */
export function useInquiries() {
  const { setInquiries, setLoading, setConnected } = useInquiryStore()

  const query = useQuery({
    queryKey: inquiryKeys.lists(),
    queryFn: async () => {
      const inquiries = await InquiryApi.getAllInquiries()
      setInquiries(inquiries)
      return inquiries
    },
    staleTime: 30 * 1000, // 30초
    gcTime: 5 * 60 * 1000, // 5분
    refetchOnWindowFocus: false,
  })

  useEffect(() => {
    if (query.isSuccess) {
      setLoading(false)
      setConnected(true)
    } else if (query.isError) {
      setLoading(false)
      setConnected(false)
    }
  }, [query.isSuccess, query.isError, setLoading, setConnected])

  return query
}

/**
 * 문의 검색 (사용자용)
 */
export function useSearchInquiries(author: string, password: string, enabled: boolean = false) {
  return useQuery({
    queryKey: inquiryKeys.list({ author, password }),
    queryFn: () => InquiryApi.searchInquiries(author, password),
    enabled: enabled && !!author && !!password,
    staleTime: 60 * 1000, // 1분
    gcTime: 10 * 60 * 1000, // 10분
    refetchOnWindowFocus: false,
  })
}

/**
 * 문의 상세 조회
 */
export function useInquiry(id: string, enabled: boolean = true) {
  return useQuery({
    queryKey: inquiryKeys.detail(id),
    queryFn: () => InquiryApi.getInquiry(id),
    enabled: enabled && !!id,
    staleTime: 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

/**
 * 문의 답변 조회 (관리자용)
 */
export function useInquiryRepliesWithAdmin(inquiryId: string, enabled: boolean = true) {
  const { setReplies } = useInquiryStore()

  return useQuery({
    queryKey: inquiryKeys.replies(inquiryId),
    queryFn: async () => {
      const replies = await InquiryApi.getRepliesWithAdmin(inquiryId)
      setReplies(inquiryId, replies)
      return replies
    },
    enabled: enabled && !!inquiryId,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  })
}

/**
 * 문의 답변 조회 (사용자용)
 */
export function useInquiryReplies(inquiryId: string, enabled: boolean = true) {
  return useQuery({
    queryKey: inquiryKeys.replies(inquiryId),
    queryFn: () => InquiryApi.getReplies(inquiryId),
    enabled: enabled && !!inquiryId,
    staleTime: 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

/**
 * 문의 통계 조회
 */
export function useInquiryStats() {
  return useQuery({
    queryKey: inquiryKeys.stats(),
    queryFn: InquiryApi.getInquiryStats,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchInterval: 30 * 1000, // 30초마다 자동 갱신
  })
}

/**
 * 문의 생성
 */
export function useCreateInquiry() {
  const queryClient = useQueryClient()
  const { success, error } = useNotificationStore()

  return useMutation({
    mutationFn: InquiryApi.createInquiry,
    onSuccess: () => {
      // 문의 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: inquiryKeys.lists() })
      queryClient.invalidateQueries({ queryKey: inquiryKeys.stats() })
      
      success(
        '문의가 성공적으로 제출되었습니다',
        '빠른 시일 내에 답변드리겠습니다.'
      )
    },
    onError: (err) => {
      error(
        '문의 제출 실패',
        err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.'
      )
    },
  })
}

/**
 * 답변 생성
 */
export function useCreateReply() {
  const queryClient = useQueryClient()
  const { success, error } = useNotificationStore()
  const { addReply } = useInquiryStore()

  return useMutation({
    mutationFn: ({ inquiryId, adminId, content }: {
      inquiryId: string
      adminId: string
      content: string
    }) => InquiryApi.createReply(inquiryId, adminId, content),
    onSuccess: (reply, variables) => {
      // 관련 쿼리들 무효화
      queryClient.invalidateQueries({ queryKey: inquiryKeys.detail(variables.inquiryId) })
      queryClient.invalidateQueries({ queryKey: inquiryKeys.replies(variables.inquiryId) })
      queryClient.invalidateQueries({ queryKey: inquiryKeys.lists() })
      queryClient.invalidateQueries({ queryKey: inquiryKeys.stats() })

      // 로컬 상태 업데이트
      addReply(variables.inquiryId, reply as any)

      success(
        '답변이 성공적으로 등록되었습니다',
        '사용자에게 답변이 전달되었습니다.'
      )
    },
    onError: (err) => {
      error(
        '답변 등록 실패',
        err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.'
      )
    },
  })
}

/**
 * 문의 상태 업데이트
 */
export function useUpdateInquiryStatus() {
  const queryClient = useQueryClient()
  const { success, error } = useNotificationStore()
  const { updateInquiry } = useInquiryStore()

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'pending' | 'answered' | 'closed' }) =>
      InquiryApi.updateInquiryStatus(id, status),
    onSuccess: (inquiry) => {
      // 관련 쿼리들 무효화
      queryClient.invalidateQueries({ queryKey: inquiryKeys.detail(inquiry.id) })
      queryClient.invalidateQueries({ queryKey: inquiryKeys.lists() })
      queryClient.invalidateQueries({ queryKey: inquiryKeys.stats() })

      // 로컬 상태 업데이트
      updateInquiry(inquiry.id, { status: inquiry.status })

      success(
        '문의 상태가 업데이트되었습니다',
        `상태가 ${inquiry.status}로 변경되었습니다.`
      )
    },
    onError: (err) => {
      error(
        '상태 업데이트 실패',
        err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.'
      )
    },
  })
}
