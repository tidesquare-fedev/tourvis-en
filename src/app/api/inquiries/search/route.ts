import { InquiryApi } from '@/lib/api/inquiries';
import { createApiError, createApiResponse } from '@/lib/utils/api';
import { withErrorHandling } from '@/lib/utils/error-handler';
import { NextRequest } from 'next/server';

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
    const inquiriesArray = Array.isArray(inquiries) ? inquiries : [];

    return createApiResponse(
      { inquiries: inquiriesArray },
      200,
      `Found ${inquiriesArray.length} inquiry(ies)`,
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to search inquiries';
    return createApiError(message, 500, 'INTERNAL_ERROR');
  }
}, 'inquiries-search');
