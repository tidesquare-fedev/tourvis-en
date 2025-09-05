import { NextRequest } from 'next/server'
import { getProductOptionsDateTypeV2 } from '@/lib/api/tna-v2'

export const dynamic = 'force-dynamic'

export async function GET(_req: NextRequest, { params }: { params: { productId: string; date: string } }) {
  try {
    let data: any
    try {
      data = await getProductOptionsDateTypeV2(params.productId, params.date)
    } catch (e) {
      // 일부 API는 yyyymmdd 포맷을 요구할 수 있어 재시도
      const compact = params.date.replace(/-/g, '')
      if (compact !== params.date) {
        data = await getProductOptionsDateTypeV2(params.productId, compact)
      } else {
        throw e
      }
    }
    return Response.json({ success: true, data })
  } catch (e: unknown) {
    return Response.json({ success: false, error: 'Failed to load options (date-type)' }, { status: 500 })
  }
}


