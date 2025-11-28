import { NextRequest } from 'next/server';
import {
  getProductDetailV2,
  getProductDatesV2,
  getProductOptionsDateTypeV2,
  getProductPriceDateTypeV2,
} from '@/lib/api/tna-v2';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const productId =
      req.nextUrl.searchParams.get('product_id') || 'PRD2001379417';
    const startDate =
      req.nextUrl.searchParams.get('start_date') ||
      new Date().toISOString().slice(0, 10);
    const parallel: Promise<any>[] = [];
    parallel.push(getProductDetailV2(productId));
    parallel.push(getProductDatesV2(productId, startDate));
    const [detail, dates] = await Promise.all(parallel);
    return Response.json({ success: true, data: { detail, dates } });
  } catch (e) {
    return Response.json(
      { success: false, error: 'bundle failed' },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const productId: string = body?.product_id || 'PRD2001379417';
    const date: string = body?.date;
    const optionCodes: string[] = Array.isArray(body?.option_codes)
      ? body.option_codes
      : [];
    if (!date)
      return Response.json(
        { success: false, error: 'date required' },
        { status: 400 },
      );
    const [options] = await Promise.all([
      getProductOptionsDateTypeV2(productId, date),
    ]);
    // 가격 일괄 조회
    const prices: Record<string, number> = {};
    await Promise.all(
      optionCodes.map(async code => {
        const p = await getProductPriceDateTypeV2(productId, {
          product_option_code: code,
          start_date: date,
          end_date: date,
        });
        const val = Number(p?.price ?? p?.data?.price ?? p?.amount ?? 0);
        prices[code] = val;
      }),
    );
    return Response.json({ success: true, data: { options, prices } });
  } catch (e) {
    return Response.json(
      { success: false, error: 'bundle post failed' },
      { status: 500 },
    );
  }
}
