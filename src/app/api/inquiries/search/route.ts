import { NextRequest } from 'next/server';
import { createApiResponse, createApiError } from '@/lib/utils/api';
import { withErrorHandling } from '@/lib/utils/error-handler';
import { InquiryApi } from '@/lib/api/inquiries';

export const POST = withErrorHandling(async (request: NextRequest) => {
  const body = await request.json();
  const { author, password } = body;

  if (!author || !password) {
    return createApiError(
      'Author and password are required',
      400,
      'BAD_REQUEST',
    );
  }

  try {
    const inquiries = await InquiryApi.searchInquiries(author, password);

    return createApiResponse(
      { inquiries },
      200,
      `Found ${inquiries.length} inquiry(ies)`,
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to search inquiries';
    return createApiError(message, 500, 'INTERNAL_ERROR');
  }
}, 'inquiries-search');
