import { NextRequest } from 'next/server';
import { getProductPriceDateTypeV2 } from '@/lib/api/tna-v2';

export const dynamic = 'force-dynamic';

export async function POST(
  req: NextRequest,
  { params }: { params: { productId: string } },
) {
  try {
    const rawBody = await req.json().catch(() => ({}));
    const data = await getProductPriceDateTypeV2(params.productId, rawBody);
    return Response.json({ success: true, data });
  } catch (e: unknown) {
    console.error('TNA API 오류:', e);
    const status = e instanceof Error && e.message.includes('404') ? 404 : 500;
    return Response.json(
      {
        success: false,
        error: 'Failed to load price (date-type)',
        code: 'PRICE_DATE_FAILED',
      },
      { status },
    );
  }
}
