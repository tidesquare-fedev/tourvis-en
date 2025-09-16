import { NextRequest } from 'next/server'
import { createApiResponse, createApiError } from '@/lib/utils/api'
import { withErrorHandling } from '@/lib/utils/error-handler'
import { InquiryApi } from '@/lib/api/inquiries'

export const POST = withErrorHandling(async (request: NextRequest) => {
  const body = await request.json()
  
  // 디버깅을 위한 로그 추가
  console.log('Inquiry API - Received data:', {
    author: body.author,
    email: body.email,
    category: body.category,
    subject: body.subject,
    messageLength: body.message?.length,
    phone: body.phone
  })
  
  try {
    const inquiry = await InquiryApi.createInquiry(body)
    
    return createApiResponse(
      inquiry,
      201,
      'Inquiry submitted successfully'
    )
  } catch (error) {
    console.error('Inquiry API - Error details:', error)
    const message = error instanceof Error ? error.message : 'Failed to create inquiry'
    return createApiError(message, 400, 'VALIDATION_ERROR')
  }
}, 'inquiries-create')