import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as any;
    const brand =
      typeof body?.brand === 'string' && body.brand ? body.brand : 'TOURVIS';
    const prodCat =
      typeof body?.prodCat === 'string' && body.prodCat ? body.prodCat : 'TNT';
    const prodCd =
      typeof body?.prodCd === 'string' && body.prodCd ? body.prodCd : '';
    const limitNum = Number(body?.limit ?? 10) || 10;
    const pageNum = Number(body?.page ?? 1) || 1;

    if (!prodCd) {
      return NextResponse.json(
        { success: false, error: 'prodCd is required', code: 'BAD_REQUEST' },
        { status: 400 },
      );
    }

    const url = 'https://dapi.tourvis.com/fe/review/reviewList';
    const upstreamRes = await fetch(url, {
      method: 'POST',
      cache: 'no-store',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        brand,
        prodCat,
        prodCd,
        limit: limitNum,
        page: pageNum,
      }),
    });

    const json = await upstreamRes.json().catch(() => null);
    if (!upstreamRes.ok) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to fetch reviews',
          code: 'UPSTREAM_ERROR',
          details: { status: upstreamRes.status, body: json },
        },
        { status: upstreamRes.status },
      );
    }

    // Normalize items array best-effort
    let items: unknown[] = [];
    if (Array.isArray((json as any)?.list)) items = (json as any).list;
    else if (Array.isArray((json as any)?.data?.list))
      items = (json as any).data.list;
    else if (Array.isArray((json as any)?.data)) items = (json as any).data;
    else if (Array.isArray(json)) items = json as unknown[];

    return NextResponse.json(
      {
        success: true,
        data: { items, raw: json },
        meta: {
          page: pageNum,
          pageSize: limitNum,
          count: Array.isArray(items) ? items.length : 0,
        },
      },
      { status: 200 },
    );
  } catch (e: unknown) {
    return NextResponse.json(
      {
        success: false,
        error: 'Unexpected error while fetching reviews',
        code: 'INTERNAL_ERROR',
      },
      { status: 500 },
    );
  }
}
