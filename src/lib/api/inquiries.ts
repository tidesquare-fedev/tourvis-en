import { apiClient, createApiResponse, createApiError, validateRequiredFields, validateEmail } from '../utils/api'
import { supabaseAdmin } from '../supabase'
import { Inquiry, InquiryReplyWithAdmin } from '@/types/admin'

/**
 * 문의 관련 API 클라이언트
 */
export class InquiryApi {
  /**
   * 문의 생성
   */
  static async createInquiry(data: {
    author: string
    password: string
    name: string
    email: string
    phone?: string
    category: string
    subject: string
    message: string
  }) {
    // 필수 필드 검증
    const requiredFields = ['author', 'password', 'name', 'email', 'category', 'subject', 'message']
    const validation = validateRequiredFields(data, requiredFields)
    
    if (!validation.isValid) {
      throw new Error(`Missing required fields: ${validation.missingFields.join(', ')}`)
    }

    // 이메일 형식 검증
    if (!validateEmail(data.email)) {
      throw new Error('Invalid email format')
    }

    const { data: inquiry, error } = await supabaseAdmin
      .from('inquiries')
      .insert([{
        ...data,
        phone: data.phone || null,
        status: 'pending',
        created_at: new Date().toISOString(),
      }])
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create inquiry: ${error.message}`)
    }

    return inquiry
  }

  /**
   * 문의 검색 (사용자용)
   */
  static async searchInquiries(author: string, password: string) {
    const { data: inquiries, error } = await supabaseAdmin
      .from('inquiries')
      .select('*')
      .eq('author', author)
      .eq('password', password)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to search inquiries: ${error.message}`)
    }

    return inquiries || []
  }

  /**
   * 문의 상세 조회
   */
  static async getInquiry(id: string) {
    const { data: inquiry, error } = await supabaseAdmin
      .from('inquiries')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      throw new Error(`Failed to get inquiry: ${error.message}`)
    }

    return inquiry
  }

  /**
   * 문의 답변 조회 (관리자용 - 관리자 이름 포함)
   */
  static async getRepliesWithAdmin(inquiryId: string) {
    const { data: replies, error } = await supabaseAdmin
      .from('inquiry_replies')
      .select(`
        *,
        admin_users!inner(username)
      `)
      .eq('inquiry_id', inquiryId)
      .order('created_at', { ascending: true })

    if (error) {
      throw new Error(`Failed to get replies: ${error.message}`)
    }

    return replies as InquiryReplyWithAdmin[]
  }

  /**
   * 문의 답변 조회 (사용자용 - 관리자 이름 제외)
   */
  static async getReplies(inquiryId: string) {
    const { data: replies, error } = await supabaseAdmin
      .from('inquiry_replies')
      .select(`
        id,
        inquiry_id,
        content,
        created_at
      `)
      .eq('inquiry_id', inquiryId)
      .order('created_at', { ascending: true })

    if (error) {
      throw new Error(`Failed to get replies: ${error.message}`)
    }

    return replies
  }

  /**
   * 답변 생성
   */
  static async createReply(inquiryId: string, adminId: string, content: string) {
    const { data: reply, error } = await supabaseAdmin
      .from('inquiry_replies')
      .insert({
        inquiry_id: inquiryId,
        admin_id: adminId,
        content: content.trim(),
      })
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create reply: ${error.message}`)
    }

    // 문의 상태를 답변 완료로 업데이트
    await supabaseAdmin
      .from('inquiries')
      .update({ status: 'answered' })
      .eq('id', inquiryId)

    return reply
  }

  /**
   * 문의 상태 업데이트
   */
  static async updateInquiryStatus(id: string, status: 'pending' | 'answered' | 'closed') {
    const { data: inquiry, error } = await supabaseAdmin
      .from('inquiries')
      .update({ status })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update inquiry status: ${error.message}`)
    }

    return inquiry
  }

  /**
   * 모든 문의 조회 (관리자용)
   */
  static async getAllInquiries() {
    const { data: inquiries, error } = await supabaseAdmin
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to get inquiries: ${error.message}`)
    }

    return inquiries || []
  }

  /**
   * 문의 통계 조회
   */
  static async getInquiryStats() {
    const { data: stats, error } = await supabaseAdmin
      .from('inquiries')
      .select('status, created_at')

    if (error) {
      throw new Error(`Failed to get inquiry stats: ${error.message}`)
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const todayInquiries = stats?.filter(inquiry => 
      new Date(inquiry.created_at) >= today
    ).length || 0

    const statusCounts = stats?.reduce((acc, inquiry) => {
      acc[inquiry.status] = (acc[inquiry.status] || 0) + 1
      return acc
    }, {} as Record<string, number>) || {}

    return {
      total_inquiries: stats?.length || 0,
      pending_inquiries: statusCounts.pending || 0,
      answered_inquiries: statusCounts.answered || 0,
      closed_inquiries: statusCounts.closed || 0,
      today_inquiries: todayInquiries,
    }
  }
}
