import { NextRequest } from 'next/server'
import { getProductPriceDateTypeV2 } from '@/lib/api/tna-v2'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest, { params }: { params: { productId: string } }) {
  const getStatusFromError = (err: unknown): number => {
    const msg = err instanceof Error ? err.message : String(err)
    const m = msg.match(/(\d{3})$/)
    const status = m ? Number(m[1]) : 500
    return Number.isFinite(status) && status >= 400 && status <= 599 ? status : 500
  }
  try {
    const rawBody = await req.json().catch(() => ({}))
    try {
      const data = await getProductPriceDateTypeV2(params.productId, rawBody)
      return Response.json({ success: true, data })
    } catch (e1: unknown) {
      // Fallback: compact date format (YYYYMMDD)
      const compact = (v: unknown) => (typeof v === 'string' ? v.replace(/-/g, '') : v)
      const fallbackBody = {
        ...rawBody,
        start_date: compact((rawBody as any)?.start_date),
        end_date: compact((rawBody as any)?.end_date),
      }
      const changed = JSON.stringify(fallbackBody) !== JSON.stringify(rawBody)
      if (changed) {
        try {
          const data2 = await getProductPriceDateTypeV2(params.productId, fallbackBody)
          return Response.json({ success: true, data: data2, meta: { fallback: 'compact-date' } })
        } catch (e2: unknown) {
          const status = getStatusFromError(e2)
          return Response.json({ success: false, error: 'Failed to load price (date-type)', code: 'PRICE_DATE_FAILED' }, { status })
        }
      }
      const status = getStatusFromError(e1)
      return Response.json({ success: false, error: 'Failed to load price (date-type)', code: 'PRICE_DATE_FAILED' }, { status })
    }
  } catch (e: unknown) {
    return Response.json({ success: false, error: 'Failed to load price (date-type)' }, { status: 500 })
  }
}


