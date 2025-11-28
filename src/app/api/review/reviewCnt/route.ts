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
    if (!prodCd) {
      return NextResponse.json(
        { success: false, error: 'prodCd is required', code: 'BAD_REQUEST' },
        { status: 400 },
      );
    }
    const url = 'https://dapi.tourvis.com/fe/review/reviewCnt';
    const upstreamRes = await fetch(url, {
      method: 'POST',
      cache: 'no-store',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ brand, prodCat, prodCd }),
    });
    const json = await upstreamRes.json().catch(() => null);
    if (!upstreamRes.ok) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to fetch review count',
          code: 'UPSTREAM_ERROR',
          details: { status: upstreamRes.status, body: json },
        },
        { status: upstreamRes.status },
      );
    }
    // normalize to number count (supports totCnt)
    const raw: any = json as any;
    const count =
      Number(
        raw?.totCnt ??
          raw?.totalCnt ??
          raw?.count ??
          raw?.total ??
          raw?.data?.count ??
          raw?.data?.total ??
          0,
      ) || 0;
    return NextResponse.json(
      { success: true, data: { count }, meta: { count } },
      { status: 200 },
    );
  } catch (_e) {
    return NextResponse.json(
      {
        success: false,
        error: 'Unexpected error while fetching review count',
        code: 'INTERNAL_ERROR',
      },
      { status: 500 },
    );
  }
}
