import { fetchProducts } from '@/features/activity/lib/searchApi';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as Record<
      string,
      unknown
    >;
    const providerIds = String(body?.providerIds ?? body?.provider_ids ?? '');
    const keyword =
      typeof body?.keyword === 'string'
        ? body.keyword
        : typeof body?.q === 'string'
          ? body.q
          : '';
    if (!providerIds) {
      return NextResponse.json(
        {
          success: false,
          error: 'providerIds is required',
          code: 'BAD_REQUEST',
        },
        { status: 400 },
      );
    }

    const res = await fetchProducts(providerIds);
    if (!res.ok) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to fetch products',
          code: 'UPSTREAM_ERROR',
          details: {
            status: res.status,
            url: res.url,
            body: res.errorBody?.slice(0, 500),
          },
        },
        { status: res.status || 502 },
      );
    }
    let items = res.items;
    if (keyword && keyword.trim()) {
      const q = keyword.trim().toLowerCase();
      items = items.filter(it => {
        const title = String(it?.title ?? '').toLowerCase();
        const category = String(it?.category ?? '').toLowerCase();
        const location = String(it?.location ?? '').toLowerCase();
        return (
          title.includes(q) || category.includes(q) || location.includes(q)
        );
      });
    }
    return NextResponse.json(
      { success: true, data: { items }, meta: { count: items.length } },
      { status: 200 },
    );
  } catch (e: unknown) {
    return NextResponse.json(
      {
        success: false,
        error: 'Unexpected error while fetching products',
        code: 'INTERNAL_ERROR',
      },
      { status: 500 },
    );
  }
}
