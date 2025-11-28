import { NextRequest } from 'next/server';
import {
  getProductOptionsDateTypeV2,
  getProductOptionsPeriodTypeV2,
} from '@/lib/api/tna-v2';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const productId =
      req.nextUrl.searchParams.get('product_id') || 'PRD2001379417';
    const date = req.nextUrl.searchParams.get('date');
    if (date) {
      try {
        const data = await getProductOptionsDateTypeV2(productId, date);
        return Response.json({ success: true, data });
      } catch (e) {
        const compact = date.replace(/-/g, '');
        const data2 = await getProductOptionsDateTypeV2(productId, compact);
        return Response.json({ success: true, data: data2 });
      }
    }
    const data = await getProductOptionsPeriodTypeV2(productId);
    return Response.json({ success: true, data });
  } catch (e) {
    return Response.json(
      { success: false, error: 'options proxy failed' },
      { status: 500 },
    );
  }
}
