import { NextResponse } from 'next/server'
import { fetchTourvisHome } from '@/lib/api/tourvis'
import type { Section } from '@/features/home/types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const normalizeImage = (u: unknown): string => {
  const s = typeof u === 'string' ? u : ''
  if (!s) return ''
  const withProto = s.startsWith('http://') || s.startsWith('https://') ? s : (s.startsWith('//') ? `https:${s}` : `https://${s.replace(/^\/+/, '')}`)
  const https = withProto.replace(/^http:\/\//i, 'https://')
  return https
}

const absolutize = (u: unknown): string | null => {
  const s = typeof u === 'string' ? u.trim() : ''
  if (!s) return null
  try {
    if (/^https?:\/\//i.test(s)) return s
    const url = new URL(s, 'https://tourvis.com')
    return url.toString()
  } catch {
    return null
  }
}

const mapProductsToItems = (list: any[]): any[] => {
  return (Array.isArray(list) ? list : []).map((p: any) => {
    const detail = p?.productDetail || {}
    const imageCandidate = detail.imageUrl || detail.imageUrlWide || ''
    const images: string[] = []
    if (detail.imageUrl) images.push(normalizeImage(detail.imageUrl))
    if (detail.imageUrlWide && detail.imageUrlWide !== detail.imageUrl) images.push(normalizeImage(detail.imageUrlWide))
    if (detail.imageCommon && detail.imageCommon !== detail.imageUrl && detail.imageCommon !== detail.imageUrlWide) images.push(normalizeImage(detail.imageCommon))
    if (detail.imageCover && detail.imageCover !== detail.imageUrl && detail.imageCover !== detail.imageUrlWide && detail.imageCover !== detail.imageCommon) images.push(normalizeImage(detail.imageCover))

    const price = detail.discountPrice ?? detail.price ?? ''
    const discountRate = detail.discountRate ?? ''
    const location = String(
      detail.cityName
      ?? detail?.cityMast?.nameEn
      ?? detail?.cityMast?.nameKr
      ?? detail.stateName
      ?? detail.nationName
      ?? ''
    )
    const rating = Number(detail.tntReviewRating ?? detail?.review?.reviewScore ?? 0) || undefined
    const reviewCount = Number(detail.tntReviewCount ?? detail?.review?.reviewCount ?? 0) || undefined
    return {
      id: String(p.productId ?? detail.id ?? ''),
      title: String(p.productName ?? detail.name ?? ''),
      image: normalizeImage(imageCandidate),
      images: images.length > 0 ? images : undefined,
      category: detail.category ?? null,
      location: location || null,
      href: absolutize(p?.productLink ?? detail?.productLink ?? detail?.linkUrl ?? p?.linkUrl ?? ''),
      rating,
      reviewCount,
      originalPrice: typeof detail.price === 'string' ? Number(detail.price) : detail.price ?? null,
      discountRate: typeof discountRate === 'string' ? Number(discountRate) : discountRate ?? null,
      price: typeof price === 'string' ? Number(price) : price ?? null,
    }
  })
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({})) as any
    const templateId = String(body?.templateId || body?.template_id || '')
    const title = typeof body?.title === 'string' ? body.title : undefined
    const index = Number(body?.index ?? -1)
    const limit = Number(body?.limit ?? 0)

    if (!templateId) {
      return NextResponse.json({ success: false, error: 'templateId is required', code: 'BAD_REQUEST' }, { status: 400 })
    }

    const { ok, data } = await fetchTourvisHome<any>({
      brand: 'TOURVIS',
      platform: 'A',
      productDetailYn: 'Y',
      showType: 'ETC',
      svcDivn: 'COMMON',
    })
    if (!ok || !data) {
      return NextResponse.json({ success: false, error: 'Failed to load home data', code: 'UPSTREAM_ERROR' }, { status: 502 })
    }

    const root: any = data
    const categoryList: any[] = Array.isArray(root.categoryList) ? root.categoryList.slice().sort((a, b) => (a?.orderSeq ?? 0) - (b?.orderSeq ?? 0)) : []

    const sections: Section[] = []

    for (const entry of categoryList) {
      const tpl: string = String(entry?.templateId ?? '')
      const type: string = String(entry?.type ?? '')
      const d = entry?.data || {}

      if (tpl === 'TV_TAB_BSTP') {
        if (Array.isArray(d?.themeList)) {
          const categories = (d.themeList as any[]).map((t: any) => ({
            title: String(t?.tabTitle ?? t?.title ?? d?.title ?? entry?.name ?? 'Best Products'),
            items: mapProductsToItems(t?.productList || []),
          }))
          sections.push({ templateId: 'TV_TAB_BSTP', categories, title: String(d?.name ?? entry?.name ?? d?.title ?? 'Best Products') })
        } else if (Array.isArray(d?.productList)) {
          const items = mapProductsToItems(d.productList)
          const catTitle = String(d?.title ?? d?.name ?? entry?.name ?? 'Best Products')
          sections.push({ templateId: 'TV_TAB_BSTP', categories: [{ title: catTitle, items }], title: String(d?.name ?? entry?.name ?? 'Best Products') })
        }
        continue
      }

      if (tpl === 'TV_PC_TM_PRODUCT_4X1') {
        if (Array.isArray(d?.productList)) {
          const items = mapProductsToItems(d.productList)
          const catTitle = String(d.title ?? entry?.categoryId ?? '')
          sections.push({ templateId: 'TV_PC_TM_PRODUCT_4X1', category: { title: catTitle, items } })
        }
        continue
      }

      if (tpl === 'TV_TAB_TWOGRID') {
        const themeList: any[] = Array.isArray(d?.themeList) ? d.themeList : []
        const categories = themeList.map((t: any) => ({
          items: mapProductsToItems(t?.productList || []),
          title: String(t?.tabTitle ?? t?.title ?? ''),
        }))
        sections.push({ templateId: 'TV_TAB_TWOGRID', categories, title: String(d?.name ?? entry?.name ?? d?.title ?? '') })
        continue
      }

      if (type === 'theme') {
        if (Array.isArray(d?.productList)) {
          const items = mapProductsToItems(d.productList)
          const catTitle = String(d.title ?? entry?.categoryId ?? '')
          sections.push({ templateId: 'TV_PC_TM_PRODUCT_4X1', category: { title: catTitle, items } })
        }
      }
    }

    const candidates = sections.filter((s) => s.templateId === templateId)
    if (candidates.length === 0) {
      return NextResponse.json({ success: true, data: { items: [] }, meta: { count: 0 } }, { status: 200 })
    }

    let chosen: Section | undefined
    if (typeof title === 'string') {
      chosen = candidates.find((s) => {
        if (s.templateId === 'TV_PC_TM_PRODUCT_4X1') return s.category.title === title
        if (s.templateId === 'TV_TAB_BSTP' || s.templateId === 'TV_TAB_TWOGRID') return s.categories.some((c) => c.title === title)
        return false
      })
    }
    if (!chosen) {
      chosen = candidates[Math.max(0, Math.min(candidates.length - 1, index >= 0 ? index : 0))]
    }

    let items: any[] = []
    if (chosen.templateId === 'TV_PC_TM_PRODUCT_4X1') {
      items = chosen.category.items
    } else if (chosen.templateId === 'TV_TAB_BSTP' || chosen.templateId === 'TV_TAB_TWOGRID') {
      const cat = typeof title === 'string' ? chosen.categories.find((c) => c.title === title) : chosen.categories[0]
      items = cat?.items || []
    }

    if (limit && Array.isArray(items)) items = items.slice(0, limit)

    return NextResponse.json({ success: true, data: { items }, meta: { count: Array.isArray(items) ? items.length : 0 } }, { status: 200 })
  } catch (e: unknown) {
    return NextResponse.json({ success: false, error: 'Unexpected error while fetching section products', code: 'INTERNAL_ERROR' }, { status: 500 })
  }
}


