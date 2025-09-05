import { NextRequest } from 'next/server'
import { getProductOptionsPeriodTypeV2, getProductOptionsDateTypeV2 } from '@/lib/api/tna-v2'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest, { params }: { params: { productId: string } }) {
  try {
    const date = req.nextUrl.searchParams.get('date')
    if (date) {
      try {
        const data = await getProductOptionsDateTypeV2(params.productId, date)
        return Response.json({ success: true, data })
      } catch (e) {
        // 1) yyyymmdd 포맷 재시도
        try {
          const compact = date.replace(/-/g, '')
          const data2 = await getProductOptionsDateTypeV2(params.productId, compact)
          return Response.json({ success: true, data: data2, meta: { fallback: 'compact-date' } })
        } catch (e2) {
          // 2) 기간형으로 최종 폴백 (일부 상품은 calendar_type 미노출 시 PERIOD로만 응답)
          try {
            const periodData = await getProductOptionsPeriodTypeV2(params.productId)
            return Response.json({ success: true, data: periodData, meta: { fallback: 'period-type' } })
          } catch (e3) {
            return Response.json({ success: false, error: 'Failed to load options (date-type/period-type)' }, { status: 500 })
          }
        }
      }
    }
    const data = await getProductOptionsPeriodTypeV2(params.productId)
    return Response.json({ success: true, data })
  } catch (e: unknown) {
    return Response.json({ success: false, error: 'Failed to load options' }, { status: 500 })
  }
}


