import HomePageClient from '@/features/home/HomePageClient'
import { HomeDataSchema, type HomeData, type Section } from '@/features/home/types'
import { fetchTourvisHome } from '@/lib/api/tourvis'

export default async function HomePage() {
  const { ok, data, error } = await fetchTourvisHome<any>({
    brand: 'TOURVIS',
    platform: 'A',
    productDetailYn: 'Y',
    showType: 'ETC',
    svcDivn: 'COMMON',
  })

  let mapped: HomeData = { banners: [], regions: [], categories: [] }
  let sections: Section[] = []
  if (ok && data) {
    const root: any = data

    const normalizeImage = (u: unknown): string => {
      const s = typeof u === 'string' ? u : ''
      if (!s) return ''
      if (s.startsWith('http://') || s.startsWith('https://')) return s
      if (s.startsWith('//')) return `https:${s}`
      return s
    }

    const categories: any[] = []
    const categoryList: any[] = Array.isArray(root.categoryList) ? root.categoryList : []
    for (const cat of categoryList) {
      const d = cat?.data || {}
      const catTitle = String(d.title ?? cat?.categoryId ?? '')
      const productList: any[] = Array.isArray(d.productList) ? d.productList : []
      if (productList.length > 0) {
        const items = productList.map((p: any) => {
          const detail = p?.productDetail || {}
          const imageCandidate = detail.imageUrl || detail.imageUrlWide || detail.imageUrlSquare || detail.imageCommon || detail.imageCover
          const price = detail.discountPrice ?? detail.price ?? ''
          const discountRate = detail.discountRate ?? ''
          const location = [detail.nationName, detail.stateName, detail.cityName].filter(Boolean).join(' / ')
          const rating = Number(detail.tntReviewRating ?? detail?.review?.reviewScore ?? 0) || undefined
          const reviewCount = Number(detail.tntReviewCount ?? detail?.review?.reviewCount ?? 0) || undefined
          return {
            id: String(p.productId ?? detail.id ?? ''),
            title: String(p.productName ?? detail.name ?? ''),
            image: normalizeImage(imageCandidate),
            category: detail.category ?? null,
            location: location || null,
            rating,
            reviewCount,
            originalPrice: typeof detail.price === 'string' ? Number(detail.price) : detail.price ?? null,
            discountRate: typeof discountRate === 'string' ? Number(discountRate) : discountRate ?? null,
            price: typeof price === 'string' ? Number(price) : price ?? null,
          }
        })
        categories.push({ title: catTitle, items })
      }

      const themeList: any[] = Array.isArray(d.themeList) ? d.themeList : []
      for (const theme of themeList) {
        const tTitle = String(theme.title ?? catTitle ?? '')
        const tProducts: any[] = Array.isArray(theme.productList) ? theme.productList : []
        if (tProducts.length > 0) {
          const items = tProducts.map((p: any) => {
            const detail = p?.productDetail || {}
            const imageCandidate = detail.imageUrl || detail.imageUrlWide || detail.imageUrlSquare || detail.imageCommon || detail.imageCover
            const price = detail.discountPrice ?? detail.price ?? ''
            const discountRate = detail.discountRate ?? ''
            const location = [detail.nationName, detail.stateName, detail.cityName].filter(Boolean).join(' / ')
            const rating = Number(detail.tntReviewRating ?? detail?.review?.reviewScore ?? 0) || undefined
            const reviewCount = Number(detail.tntReviewCount ?? detail?.review?.reviewCount ?? 0) || undefined
            return {
              id: String(p.productId ?? detail.id ?? ''),
              title: String(p.productName ?? detail.name ?? ''),
              image: normalizeImage(imageCandidate),
              category: detail.category ?? null,
              location: location || null,
              rating,
              reviewCount,
              originalPrice: typeof detail.price === 'string' ? Number(detail.price) : detail.price ?? null,
              discountRate: typeof discountRate === 'string' ? Number(discountRate) : discountRate ?? null,
              price: typeof price === 'string' ? Number(price) : price ?? null,
            }
          })
          categories.push({ title: tTitle, items })
        }
      }
    }

    // Regions: CITY theme products → regions
    const firstCityCat = categoryList.find((c: any) => c?.data?.themeType === 'CITY' && Array.isArray(c?.data?.productList))
    const regions = (firstCityCat?.data?.productList || []).map((p: any) => {
      const detail = p?.productDetail || {}
      const name = detail?.cityMast?.nameEn || detail?.cityMast?.nameKr || p?.productName || ''
      const imageCandidate = detail.imageCommon || detail.imageCover || ''
      return {
        id: String(detail.uniqCode ?? detail.cityMasterId ?? p.productId ?? ''),
        name: String(name),
        subtitle: String(detail.description ?? ''),
        image: normalizeImage(imageCandidate),
      }
    })

    // Banners: derive from any category's products (first 5)
    const firstProductsCat = categoryList.find((c: any) => Array.isArray(c?.data?.productList) && c.data.productList.length > 0)
    const banners = (firstProductsCat?.data?.productList || []).slice(0, 5).map((p: any, idx: number) => {
      const detail = p?.productDetail || {}
      const imageCandidate = detail.imageUrlWide || detail.imageUrl || detail.imageCommon || detail.imageCover || ''
      return {
        id: String(p.productId ?? detail.id ?? idx),
        image: normalizeImage(imageCandidate),
        title: String(p.productName ?? detail.name ?? ''),
        subtitle: String(detail.description ?? ''),
      }
    })

    const normalized = { banners, regions, categories }
    const parsed = HomeDataSchema.safeParse(normalized)
    if (parsed.success) {
      mapped = parsed.data
      // Build sections in required order
      sections = []
      sections.push({ templateId: 'TV_TM_CAROUSEL', regions: mapped.regions })
      // Best products as tab (first few categories)
      sections.push({ templateId: 'TV_TAB_BSTP', categories: mapped.categories.slice(0, 4) })
      // Line banner
      sections.push({ templateId: 'TV_PC_IV_LINE_BANNER_A', banners: mapped.banners })
      // Product themes 4x1: map remaining categories
      for (const cat of mapped.categories.slice(0, 3)) {
        sections.push({ templateId: 'TV_PC_TM_PRODUCT_4X1', category: cat })
      }
      // Two-grid tab at the end using first 2 categories as example
      sections.push({ templateId: 'TV_TAB_TWOGRID', categories: mapped.categories.slice(0, 2) })
    }
  }

  return (
    <HomePageClient banners={mapped.banners} regions={mapped.regions} categories={mapped.categories} sections={sections} />
  )
}


