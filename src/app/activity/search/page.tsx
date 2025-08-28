import SearchPageClient from '@/features/activity/SearchPageClient'
import { fetchProducts } from '@/features/activity/lib/searchApi'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

type SearchParams = {
  q?: string
  page?: string
  size?: string
  channel_id?: string
}

export default async function ActivitySearchPage({ searchParams }: { searchParams: SearchParams }) {
  const keyword = String(searchParams?.q ?? '')

  const providerIds = 'PRV2001310556'

  let items: any[] = []
  let error: string | null = null

  try {
    const res = await fetchProducts(providerIds)
    if (!res.ok) {
      const status = res.status || 500
      if (process.env.NODE_ENV !== 'production') {
        console.error('[activity/search] fetch error', { status, url: res.url, body: res.errorBody?.slice(0, 500) })
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
    items = res.items as any[]
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


