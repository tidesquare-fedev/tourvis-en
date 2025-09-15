import { NextRequest, NextResponse } from 'next/server'
import { getProductDynamicPriceV2 } from '@/lib/api/tna-v2'

export async function POST(
  request: NextRequest,
  { params }: { params: { productId: string; optionId: string } }
) {
  try {
    const { productId, optionId } = params
    const body = await request.json()

    console.log('동적 가격 API 요청:', { productId, optionId, body })

    const result = await getProductDynamicPriceV2(productId, optionId, body)

    // TNA API가 직접 데이터를 반환하므로 success 래핑 없이 직접 반환
    return NextResponse.json(result)
  } catch (error) {
    console.error('동적 가격 API 에러:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        code: 'DYNAMIC_PRICE_ERROR'
      },
      { status: 500 }
    )
  }
}
