import { NextRequest } from 'next/server';
import { createApiResponse, createApiError } from '@/lib/utils/api';
import { withErrorHandling } from '@/lib/utils/error-handler';
import { InquiryApi } from '@/lib/api/inquiries';

export const GET = withErrorHandling(
  async (request: NextRequest, { params }: { params: { id: string } }) => {
    try {
      const inquiry = await InquiryApi.getInquiry(params.id);

      return createApiResponse(inquiry);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to get inquiry';
      return createApiError(message, 404, 'NOT_FOUND');
    }
  },
  'inquiry-get',
);
