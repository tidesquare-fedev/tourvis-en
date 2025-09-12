import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Inquiry, InquiryReply } from '@/types/admin'

export function useRealtimeInquiries() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // 초기 데이터 로드
    fetchInquiries()

    // 실시간 구독 설정
    const channel = supabase
      .channel('inquiries_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'inquiries'
        },
        (payload) => {
          console.log('문의 변경 감지:', payload)
          
          if (payload.eventType === 'INSERT') {
            setInquiries(prev => [payload.new as Inquiry, ...prev])
          } else if (payload.eventType === 'UPDATE') {
            setInquiries(prev => 
              prev.map(inquiry => 
                inquiry.id === payload.new.id ? payload.new as Inquiry : inquiry
              )
            )
          } else if (payload.eventType === 'DELETE') {
            setInquiries(prev => 
              prev.filter(inquiry => inquiry.id !== payload.old.id)
            )
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'inquiry_replies'
        },
        (payload) => {
          console.log('답변 변경 감지:', payload)
          // 답변이 추가되면 해당 문의의 상태를 업데이트
          if (payload.eventType === 'INSERT') {
            const reply = payload.new as InquiryReply
            setInquiries(prev => 
              prev.map(inquiry => 
                inquiry.id === reply.inquiry_id 
                  ? { ...inquiry, status: 'answered' as any }
                  : inquiry
              )
            )
          }
        }
      )
      .subscribe((status) => {
        console.log('실시간 연결 상태:', status)
        setIsConnected(status === 'SUBSCRIBED')
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const fetchInquiries = async () => {
    try {
      const response = await fetch('/en/api/admin/inquiries')
      if (response.ok) {
        const data = await response.json()
        setInquiries(data)
      }
    } catch (error) {
      console.error('문의 목록 가져오기 실패:', error)
    }
  }

  return {
    inquiries,
    isConnected,
    refetch: fetchInquiries
  }
}
