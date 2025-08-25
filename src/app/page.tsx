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
      // 모든 템플릿에서 https://로 강제
      const withProto = s.startsWith('http://') || s.startsWith('https://') ? s : (s.startsWith('//') ? `https:${s}` : `https://${s.replace(/^\/+/, '')}`)
      const https = withProto.replace(/^http:\/\//i, 'https://')
      return https
    }

    const mapProductsToItems = (list: any[]): any[] => {
      return (Array.isArray(list) ? list : []).map((p: any) => {
        const detail = p?.productDetail || {}
        // PRODUCT 이미지 규칙: imageUrl 우선 사용 (없을 때 최소한의 폴백)
        const imageCandidate = detail.imageUrl || detail.imageUrlWide || ''
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
    }

    const categoryList: any[] = Array.isArray(root.categoryList) ? root.categoryList.slice().sort((a, b) => (a?.orderSeq ?? 0) - (b?.orderSeq ?? 0)) : []

    const tmpBanners: any[] = []
    const tmpRegions: any[] = []
    const tmpCategories: any[] = []
    const tmpSections: Section[] = []

    for (const entry of categoryList) {
      const templateId: string = String(entry?.templateId ?? '')
      const type: string = String(entry?.type ?? '')
      const d = entry?.data || {}

      // Explicit line banner template
      if (templateId === 'TV_PC_IV_LINE_BANNER_A') {
        let banners: any[] = []
        const asArray = Array.isArray(d) ? d : undefined
        if (asArray) {
          const sorted = [...asArray].sort((a, b) => (a?.orderSeq ?? 0) - (b?.orderSeq ?? 0))
          banners = sorted.map((b: any, i: number) => ({
            id: String(b?.id ?? b?.key ?? `${entry?.categoryId ?? 'banner'}-${i}`),
            image: normalizeImage(b?.imageUrl || b?.image || b?.imageUrlWide || b?.listImg || b?.moImg || b?.tabImg || ''),
            title: String(b?.title ?? d?.title ?? entry?.name ?? ''),
            subtitle: String(b?.subTitle ?? ''),
            href: typeof b?.linkUrl === 'string' ? b.linkUrl : null,
          }))
        } else if (Array.isArray((d as any).bannerList)) {
          const list = (d as any).bannerList.slice().sort((a: any, b: any) => (a?.orderSeq ?? 0) - (b?.orderSeq ?? 0))
          banners = list.map((b: any, i: number) => ({
            id: String(b.id ?? b.key ?? `${entry?.categoryId ?? 'banner'}-${i}`),
            image: normalizeImage(b.image || b.imageUrl || b.imageUrlWide || b.listImg || b.moImg || b.tabImg || ''),
            title: String(b.title ?? d?.title ?? entry?.name ?? ''),
            subtitle: String(b.subTitle ?? ''),
            href: typeof b?.linkUrl === 'string' ? b.linkUrl : null,
          }))
        } else if (Array.isArray((d as any).productList)) {
          const list = (d as any).productList.slice().sort((a: any, b: any) => (a?.orderSeq ?? 0) - (b?.orderSeq ?? 0))
          banners = list.map((p: any, i: number) => {
            const detail = p?.productDetail || {}
            const img = detail.imageUrlWide || detail.imageUrl || detail.imageCommon || detail.imageCover || ''
            return {
              id: String(p.productId ?? detail.id ?? `${entry?.categoryId ?? 'banner'}-${i}`),
              image: normalizeImage(img),
              title: String(p.productName ?? detail.name ?? ''),
              subtitle: String(detail.description ?? ''),
              href: typeof p?.productLink === 'string' ? p.productLink : null,
            }
          })
        } else {
          const img = (d as any).listImg || (d as any).moImg || (d as any).tabImg || (d as any).image || ''
          if (img) {
            banners = [{
              id: String(entry?.categoryId ?? 'banner'),
              image: normalizeImage(img),
              title: String((d as any).title ?? entry?.name ?? ''),
              subtitle: String((d as any).subTitle ?? ''),
              href: typeof (d as any)?.linkUrl === 'string' ? (d as any).linkUrl : null,
            }]
          }
        }
        if (banners.length > 0) {
          tmpBanners.push(...banners)
          tmpSections.push({ templateId: 'TV_PC_IV_LINE_BANNER_A', banners })
        }
        continue
      }

      // Explicit Best Products tab template
      if (templateId === 'TV_TAB_BSTP') {
        if (Array.isArray(d?.themeList)) {
          const categories = (d.themeList as any[]).map((t: any) => ({
            title: String(t?.tabTitle ?? t?.title ?? d?.title ?? entry?.name ?? 'Best Products'),
            items: mapProductsToItems(t?.productList || []),
          }))
          tmpCategories.push(...categories)
          tmpSections.push({ templateId: 'TV_TAB_BSTP', categories })
        } else if (Array.isArray(d?.productList)) {
          const items = mapProductsToItems(d.productList)
          const title = String(d?.title ?? entry?.name ?? 'Best Products')
          const categories = [{ title, items }]
          tmpCategories.push(...categories)
          tmpSections.push({ templateId: 'TV_TAB_BSTP', categories })
        } else {
          const fallback = tmpCategories.slice(0, 4)
          if (fallback.length > 0) {
            tmpSections.push({ templateId: 'TV_TAB_BSTP', categories: fallback })
          }
        }
        continue
      }

      if (type === 'theme') {
        const themeType: string = String(d?.themeType ?? '')
        if (themeType === 'CITY' && Array.isArray(d?.productList)) {
          const regions = d.productList.map((p: any) => {
            const detail = p?.productDetail || {}
            const name = detail?.cityMast?.nameEn || detail?.cityMast?.nameKr || p?.productName || ''
            // CITY 이미지 규칙: imageCover 사용
            const imageCandidate = detail.imageCover || ''
            return {
              id: String(detail.uniqCode ?? detail.cityMasterId ?? p.productId ?? ''),
              name: String(name),
              subtitle: String(detail.description ?? ''),
              image: normalizeImage(imageCandidate),
            }
          })
          tmpRegions.push(...regions)
          tmpSections.push({ templateId: 'TV_TM_CAROUSEL', regions })
        } else if (Array.isArray(d?.productList)) {
          const items = mapProductsToItems(d.productList)
          const catTitle = String(d.title ?? entry?.categoryId ?? '')
          const category = { title: catTitle, items }
          tmpCategories.push(category)
          tmpSections.push({ templateId: 'TV_PC_TM_PRODUCT_4X1', category })
        }
      } else if (type === 'themeTab') {
        const themeList: any[] = Array.isArray(d?.themeList) ? d.themeList : []
        const categories = themeList.map((t: any) => {
          const items = mapProductsToItems(t?.productList || [])
          const title = String(t?.tabTitle ?? t?.title ?? '')
          return { title, items }
        })
        tmpCategories.push(...categories)
        tmpSections.push({ templateId: 'TV_TAB_TWOGRID', categories })
      } else if (type === 'inventory') {
        const imageCandidate = d.listImg || d.moImg || d.tabImg || d.image || ''
        const title = d.title || entry?.name || ''
        if (imageCandidate) {
          const banners = [{ id: String(entry?.categoryId ?? 'banner'), image: normalizeImage(imageCandidate), title: String(title), subtitle: String(d.subTitle ?? '') }]
          tmpBanners.push(...banners)
          tmpSections.push({ templateId: 'TV_PC_IV_LINE_BANNER_A', banners })
        }
      } else {
        // Fallback by templateId hint
        if (/IV_/.test(templateId)) {
          const imageCandidate = d.listImg || d.moImg || d.tabImg || d.image || ''
          const title = d.title || entry?.name || ''
          if (imageCandidate) {
            const banners = [{ id: String(entry?.categoryId ?? 'banner'), image: normalizeImage(imageCandidate), title: String(title), subtitle: String(d.subTitle ?? '') }]
            tmpBanners.push(...banners)
            tmpSections.push({ templateId: 'TV_PC_IV_LINE_BANNER_A', banners })
          }
        } else if (/PLACE|CITY|CAROUSEL/.test(templateId) && Array.isArray(d?.productList)) {
          const regions = d.productList.map((p: any) => {
            const detail = p?.productDetail || {}
            const name = detail?.cityMast?.nameEn || detail?.cityMast?.nameKr || p?.productName || ''
            // CITY 유사 템플릿: imageCover 사용
            const imageCandidate = detail.imageCover || ''
            return {
              id: String(detail.uniqCode ?? detail.cityMasterId ?? p.productId ?? ''),
              name: String(name),
              subtitle: String(detail.description ?? ''),
              image: normalizeImage(imageCandidate),
            }
          })
          tmpRegions.push(...regions)
          tmpSections.push({ templateId: 'TV_TM_CAROUSEL', regions })
        } else if (Array.isArray(d?.productList)) {
          const items = mapProductsToItems(d.productList)
          const catTitle = String(d.title ?? entry?.categoryId ?? '')
          const category = { title: catTitle, items }
          tmpCategories.push(category)
          tmpSections.push({ templateId: 'TV_PC_TM_PRODUCT_4X1', category })
        }
      }
    }

    const normalized = { banners: tmpBanners, regions: tmpRegions, categories: tmpCategories }
    const parsed = HomeDataSchema.safeParse(normalized)
    if (parsed.success) {
      mapped = parsed.data
      sections = tmpSections
    }
  }

  return (
    <HomePageClient banners={mapped.banners} regions={mapped.regions} categories={mapped.categories} sections={sections} />
  )
}


