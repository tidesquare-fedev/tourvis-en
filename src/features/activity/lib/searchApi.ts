import type { ProductItem, ProductSearchResponse } from '@/features/activity/types'

const normalizeImage = (p: any): string => {
  const primary = p?.primary_image || {}
  const displayImages = Array.isArray(p?.display_images) ? p.display_images : []
  const candidate = primary?.wide || primary?.square || primary?.origin || (displayImages[0]?.wide || displayImages[0]?.square || displayImages[0]?.origin) || ''
  return String(candidate || '')
}

const normalizeImages = (p: any): string[] => {
  const primary = p?.primary_image || {}
  const displayImages = Array.isArray(p?.display_images) ? p.display_images : []
  const images: string[] = []
  
  // Primary image 추가
  if (primary?.wide) images.push(String(primary.wide))
  else if (primary?.square) images.push(String(primary.square))
  else if (primary?.origin) images.push(String(primary.origin))
  
  // Display images 추가 (중복 제거)
  displayImages.forEach((img: any) => {
    const imgUrl = img?.wide || img?.square || img?.origin
    if (imgUrl && !images.includes(String(imgUrl))) {
      images.push(String(imgUrl))
    }
  })
  
  return images
}

export const mapToProductItems = (data: unknown): ProductItem[] => {
  const root = data as any
  if (!Array.isArray(root?.list)) return []
  return root.list.map((p: any) => {
    const displayPrice = p?.display_price || {}
    const priceObj = p?.price || {}
    const ratingScore = Number(p?.review?.review_score ?? 0)
    const ratingCount = Number(p?.review?.review_count ?? 0)
    const areas = Array.isArray(p?.areas) ? p.areas : []
    const cityArea = areas.find((a: any) => String(a?.scope).toLowerCase() === 'city') || areas[0] || null
    const locationName = cityArea?.name ? String(cityArea.name) : null
    const categories = Array.isArray(p?.categories) ? p.categories : []
    const firstCategory = categories[0] || null
    const categoryName = firstCategory?.name ? String(firstCategory.name) : null
    return {
      id: String(p?.product_id ?? p?.id ?? ''),
      title: String(p?.name ?? p?.summaries?.display_name ?? ''),
      image: normalizeImage(p),
      images: normalizeImages(p),
      price: Number(displayPrice?.price2 ?? priceObj?.repr ?? priceObj?.disp ?? 0) || undefined,
      originalPrice: Number(displayPrice?.price1 ?? priceObj?.disp ?? 0) || undefined,
      discountRate: Number(displayPrice?.dc_rate ?? priceObj?.dc_value ?? 0) || undefined,
      rating: ratingScore > 0 ? ratingScore : undefined,
      reviewCount: ratingCount > 0 ? ratingCount : undefined,
      location: locationName,
      category: categoryName,
    }
  })
}

export const buildApiBase = (token: string | undefined): string => {
  const devBase = 'https://dev-apollo-api.tidesquare.com'
  const prodBase = 'https://apollo-api.tidesquare.com'
  if (!token) return devBase
  try {
    const parts = token.split('.')
    if (parts.length < 2) return devBase
    const base64url = parts[1]
    const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((base64url.length + 3) % 4)
    const json = Buffer.from(base64, 'base64').toString('utf8')
    const payload = JSON.parse(json) as { stage?: string }
    const stage = String(payload?.stage || '').toLowerCase()
    if (stage === 'prod' || stage === 'production') return prodBase
    return devBase
  } catch {
    return devBase
  }
}

export async function fetchProducts(providerIds: string): Promise<{ ok: boolean; items: ProductItem[]; status?: number; url?: string; errorBody?: string }> {
  const apiBase = process.env.TNA_API_BASE || process.env.NEXT_PUBLIC_TNA_API_BASE || buildApiBase(process.env.TNA_API_TOKEN)
  const url = new URL(`${apiBase}/tna-api-v2/rest/product/_search`)
  url.searchParams.set('provider_ids', providerIds)
  // 기본 페이지 크기 확장: 필요한 전체 수량 노출(예: 156개) 보장을 위해 여유 있게 요청
  url.searchParams.set('count', '200')
  url.searchParams.set('offset', '0')

  const headers: Record<string, string> = { accept: 'application/json' }
  if (process.env.TNA_API_TOKEN) {
    const raw = process.env.TNA_API_TOKEN
    const normalized = raw.replace(/^Bearer\s+/i, '').replace(/^\s+|\s+$/g, '').replace(/^"+|"+$/g, '').replace(/^'+|'+$/g, '')
    headers.Authorization = `Bearer ${normalized}`
  }
  const res = await fetch(url.toString(), { cache: 'no-store', headers })
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    return { ok: false, items: [], status: res.status, url: url.toString(), errorBody: body }
  }
  const json = (await res.json()) as ProductSearchResponse
  return { ok: true, items: mapToProductItems(json) }
}


