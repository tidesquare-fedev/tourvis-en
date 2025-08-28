import SearchPageClient from '@/features/activity/SearchPageClient'

export const dynamic = 'force-dynamic'

type SearchParams = {
  q?: string
  page?: string
  size?: string
  channel_id?: string
}

export default async function ActivitySearchPage({ searchParams }: { searchParams: SearchParams }) {
  const keyword = String(searchParams?.q ?? '')
  const channelId = typeof searchParams?.channel_id === 'string' ? searchParams.channel_id : '3'
  const deriveApiBaseFromToken = (token: string | undefined): string => {
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
  const apiBase = process.env.TNA_API_BASE || process.env.NEXT_PUBLIC_TNA_API_BASE || deriveApiBaseFromToken(process.env.TNA_API_TOKEN)

  // Primary REST endpoint (supports list/offset/count), fallback to legacy search (page/size)
  const providerIds = 'PRV2001310556'
  const urlPrimary = new URL(`${apiBase}/tna-api-v2/rest/product/_search`)
  urlPrimary.searchParams.set('provider_ids', providerIds)

  const urlFallback = new URL(`${apiBase}/tna-api-v2/search`)
  urlFallback.searchParams.set('provider_ids', providerIds)

  let items: any[] = []
  let error: string | null = null

  try {
    const headers: Record<string, string> = {}
    headers.accept = 'application/json'
    if (process.env.TNA_API_TOKEN) {
      const raw = process.env.TNA_API_TOKEN
      // Remove optional 'Bearer ' prefix, surrounding quotes, and trim spaces
      const normalized = raw
        .replace(/^Bearer\s+/i, '')
        .replace(/^\s+|\s+$/g, '')
        .replace(/^"+|"+$/g, '')
        .replace(/^'+|'+$/g, '')
      headers.Authorization = `Bearer ${normalized}`
    }
    let currentUrl = urlPrimary.toString()
    let res = await fetch(currentUrl, { cache: 'no-store', headers })
    if (res.status === 404) {
      currentUrl = urlFallback.toString()
      res = await fetch(currentUrl, { cache: 'no-store', headers })
    }
    if (!res.ok) {
      const status = res.status
      let body = ''
      try { body = await res.text() } catch {}
      error = `HTTP ${status}`
      if (process.env.NODE_ENV !== 'production') {
        console.error('[activity/search] fetch error', { status, url: currentUrl, body: body?.slice(0, 500) })
      }
      return (
        <div className="min-h-screen bg-white">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <h1 className="text-2xl font-bold mb-2">All Activities</h1>
            <p className="text-red-600">상품 목록을 불러오지 못했습니다. ({`HTTP ${status}`})</p>
          </div>
        </div>
      )
    }
    const data = await res.json()
    // 1) 우선 data.list 스키마 지원
    if (Array.isArray(data?.list)) {
      items = (data.list as any[]).map((p: any) => {
        const primary = p?.primary_image || {}
        const displayImages = Array.isArray(p?.display_images) ? p.display_images : []
        const imageCandidate = primary?.wide || primary?.square || primary?.origin || (displayImages[0]?.wide || displayImages[0]?.square || displayImages[0]?.origin) || ''
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
        const normalized = {
          id: String(p?.product_id ?? p?.id ?? ''),
          title: String(p?.name ?? p?.summaries?.display_name ?? ''),
          image: String(imageCandidate || ''),
          price: Number(displayPrice?.price2 ?? priceObj?.repr ?? priceObj?.disp ?? 0) || undefined,
          originalPrice: Number(displayPrice?.price1 ?? priceObj?.disp ?? 0) || undefined,
          discountRate: Number(displayPrice?.dc_rate ?? priceObj?.dc_value ?? 0) || undefined,
          rating: ratingScore > 0 ? ratingScore : undefined,
          reviewCount: ratingCount > 0 ? ratingCount : undefined,
          location: locationName,
          category: categoryName,
        }
        return normalized
      })
    } else {
      // 2) 기존 다양한 후보 키 지원 (items/content/rows 등)
      const candidates = [
        data?.items,
        data?.content,
        data?.data?.items,
        data?.data?.content,
        data?.result?.items,
        data?.result?.content,
        data?.results,
        data?.rows,
        Array.isArray(data) ? data : undefined,
      ]
      const firstArray = candidates.find((v) => Array.isArray(v))
      items = Array.isArray(firstArray) ? (firstArray as any[]) : []
    }


  } catch (e: any) {
    error = '상품 목록을 불러오지 못했습니다.'
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold mb-2">All Activities</h1>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    )
  }

  return <SearchPageClient items={items as any} />
}


