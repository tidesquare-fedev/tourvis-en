import { NextRequest } from 'next/server'
import { createApiResponse, createApiError } from '@/lib/utils/api'
import { withErrorHandling } from '@/lib/utils/error-handler'
import { InquiryApi } from '@/lib/api/inquiries'

export const POST = withErrorHandling(async (request: NextRequest) => {
  const body = await request.json()
  
  try {
    const inquiry = await InquiryApi.createInquiry(body)
    
    return createApiResponse(
      inquiry,
      201,
      'Inquiry submitted successfully'
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create inquiry'
    return createApiError(message, 400, 'VALIDATION_ERROR')
  }
}, 'inquiries-create')