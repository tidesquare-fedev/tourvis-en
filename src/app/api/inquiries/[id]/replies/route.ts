import { NextRequest } from 'next/server'
import { createApiResponse, createApiError } from '@/lib/utils/api'
import { withErrorHandling } from '@/lib/utils/error-handler'
import { InquiryApi } from '@/lib/api/inquiries'

export const GET = withErrorHandling(async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const replies = await InquiryApi.getReplies(params.id)
    
    return createApiResponse(replies)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to get replies'
    return createApiError(message, 500, 'INTERNAL_ERROR')
  }
}, 'inquiry-replies-get')