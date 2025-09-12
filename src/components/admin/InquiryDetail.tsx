'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MessageSquare, 
  Send,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react'
import { Inquiry, InquiryReply } from '@/types/admin'

interface InquiryDetailProps {
  inquiry: Inquiry
  onInquiryUpdate: (inquiry: Inquiry) => void
}

export function InquiryDetail({ inquiry, onInquiryUpdate }: InquiryDetailProps) {
  const [replyContent, setReplyContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [replies, setReplies] = useState<InquiryReply[]>([])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-orange-500" />
      case 'answered':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'closed':
        return <XCircle className="h-4 w-4 text-gray-500" />
      default:
        return <MessageSquare className="h-4 w-4 text-blue-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-orange-100 text-orange-800">대기 중</Badge>
      case 'answered':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">답변 완료</Badge>
      case 'closed':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800">종료</Badge>
      default:
        return <Badge variant="outline">알 수 없음</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">높음</Badge>
      case 'medium':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">보통</Badge>
      case 'low':
        return <Badge variant="outline">낮음</Badge>
      default:
        return <Badge variant="outline">알 수 없음</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleStatusChange = async (newStatus: string) => {
    try {
      const response = await fetch(`/en/api/admin/inquiries/${inquiry.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        const updatedInquiry = { ...inquiry, status: newStatus as any }
        onInquiryUpdate(updatedInquiry)
      }
    } catch (error) {
      console.error('상태 업데이트 실패:', error)
    }
  }

  const handlePriorityChange = async (newPriority: string) => {
    try {
      const response = await fetch(`/en/api/admin/inquiries/${inquiry.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priority: newPriority }),
      })

      if (response.ok) {
        const updatedInquiry = { ...inquiry, priority: newPriority as any }
        onInquiryUpdate(updatedInquiry)
      }
    } catch (error) {
      console.error('우선순위 업데이트 실패:', error)
    }
  }

  const handleReplySubmit = async () => {
    if (!replyContent.trim()) return

    setIsSubmitting(true)
    try {
      const response = await fetch(`/en/api/admin/inquiries/${inquiry.id}/replies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: replyContent }),
      })

      if (response.ok) {
        setReplyContent('')
        // 답변 목록 새로고침
        await fetchReplies()
        // 답변 완료 상태로 업데이트
        const updatedInquiry = { ...inquiry, status: 'answered' as any }
        onInquiryUpdate(updatedInquiry)
      }
    } catch (error) {
      console.error('답변 제출 실패:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const fetchReplies = async () => {
    try {
      console.log('답변 목록 가져오기 시도:', inquiry.id)
      const response = await fetch(`/en/api/admin/inquiries/${inquiry.id}/replies`)
      console.log('답변 API 응답:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('답변 데이터:', data)
        setReplies(data)
      } else {
        const errorData = await response.json()
        console.error('답변 API 오류:', errorData)
      }
    } catch (error) {
      console.error('답변 목록 가져오기 실패:', error)
    }
  }

  // 문의가 변경될 때마다 답변 목록 가져오기
  useEffect(() => {
    if (inquiry.id) {
      fetchReplies()
    }
  }, [inquiry.id])

  // 답변 목록이 변경될 때 문의 상태와 동기화
  useEffect(() => {
    // 답변이 없는데 상태가 answered라면 pending으로 변경
    if (replies.length === 0 && inquiry.status === 'answered') {
      console.log('답변이 없는데 상태가 answered입니다. pending으로 변경합니다.')
      handleStatusChange('pending')
    }
    // 답변이 있는데 상태가 pending이라면 answered로 변경
    else if (replies.length > 0 && inquiry.status === 'pending') {
      console.log('답변이 있는데 상태가 pending입니다. answered로 변경합니다.')
      handleStatusChange('answered')
    }
  }, [replies.length, inquiry.status])

  return (
    <div className="space-y-6">
      {/* 답변 목록 */}
      <Card>
        <CardHeader>
          <CardTitle>답변 목록 ({replies.length}개)</CardTitle>
        </CardHeader>
        <CardContent>
          {replies.length > 0 ? (
            <div className="space-y-4">
              {replies.map((reply) => (
                <div key={reply.id} className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">
                      관리자 답변 {reply.admin_users?.username && `(${reply.admin_users.username})`}
                    </span>
                    <span className="text-xs text-gray-500">{formatDate(reply.created_at)}</span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{reply.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p>아직 답변이 없습니다.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 답변 작성 */}
      <Card>
        <CardHeader>
          <CardTitle>답변 작성</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Textarea
              placeholder="답변을 입력하세요..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              rows={4}
            />
            <Button 
              onClick={handleReplySubmit} 
              disabled={!replyContent.trim() || isSubmitting}
              className="w-full"
            >
              <Send className="h-4 w-4 mr-2" />
              {isSubmitting ? '답변 중...' : '답변 전송'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
