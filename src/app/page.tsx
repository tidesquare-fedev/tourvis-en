import HomePageClient from '@/features/home/HomePageClient';
import {
  HomeDataSchema,
  type HomeData,
  type Section,
} from '@/features/home/types';
import { fetchTourvisHome } from '@/lib/api/tourvis';

export default async function HomePage() {
  const { ok, data, error } = await fetchTourvisHome<unknown>({
    brand: 'TOURVIS',
    platform: 'A',
    productDetailYn: 'Y',
    showType: 'ETC',
    svcDivn: 'COMMON',
  });

  let mapped: HomeData = { banners: [], regions: [], categories: [] };
  let sections: Section[] = [];
  if (ok && data) {
    const root = data as Record<string, unknown>;

    const normalizeImage = (u: unknown): string => {
      const s = typeof u === 'string' ? u : '';
      if (!s) return '';
      // 모든 템플릿에서 https://로 강제
      const withProto =
        s.startsWith('http://') || s.startsWith('https://')
          ? s
          : s.startsWith('//')
            ? `https:${s}`
            : `https://${s.replace(/^\/+/, '')}`;
      const https = withProto.replace(/^http:\/\//i, 'https://');
      return https;
    };

    const absolutize = (u: unknown): string | null => {
      const s = typeof u === 'string' ? u.trim() : '';
      if (!s) return null;
      try {
        // already absolute
        if (/^https?:\/\//i.test(s)) return s;
        // treat as path
        const url = new URL(s, 'https://tourvis.com');
        return url.toString();
      } catch {
        return null;
      }
    };

    const mapProductsToItems = (list: unknown[]): unknown[] => {
      return (Array.isArray(list) ? list : []).map((p: unknown) => {
        const pRecord = p as Record<string, unknown>;
        const detail =
          (pRecord?.productDetail as Record<string, unknown>) || {};
        // PRODUCT 이미지 규칙: 메인 썸네일은 imageUrl만 사용
        const imageCandidate = detail.imageUrl || '';

        // 이미지 배열 생성: 썸네일 네비게이션은 imageUrl 다중일 때만 동작하도록 imageUrl만 포함
        const images: string[] = [];
        if (detail.imageUrl) images.push(normalizeImage(detail.imageUrl));

        const price = detail.discountPrice ?? detail.price ?? '';
        const discountRate = detail.discountRate ?? '';
        const cityMast = detail?.cityMast as
          | Record<string, unknown>
          | undefined;
        const location = String(
          (detail.cityName as string) ??
            (cityMast?.nameEn as string) ??
            (cityMast?.nameKr as string) ??
            (detail.stateName as string) ??
            (detail.nationName as string) ??
            '',
        );
        const review = detail?.review as Record<string, unknown> | undefined;
        const rating =
          Number(
            (detail.tntReviewRating as number) ??
              (review?.reviewScore as number) ??
              0,
          ) || undefined;
        const reviewCount =
          Number(
            (detail.tntReviewCount as number) ??
              (review?.reviewCount as number) ??
              0,
          ) || undefined;
        return {
          id: String(pRecord.productId ?? detail.id ?? ''),
          title: String(pRecord.productName ?? detail.name ?? ''),
          image: normalizeImage(imageCandidate),
          images: images.length > 0 ? images : undefined,
          category: detail.category ?? null,
          location: location || null,
          href: absolutize(
            pRecord?.productLink ??
              detail?.productLink ??
              detail?.linkUrl ??
              pRecord?.linkUrl ??
              '',
          ),
          rating,
          reviewCount,
          originalPrice:
            typeof detail.price === 'string'
              ? Number(detail.price)
              : detail.price ?? null,
          discountRate:
            typeof discountRate === 'string'
              ? Number(discountRate)
              : discountRate ?? null,
          price: typeof price === 'string' ? Number(price) : price ?? null,
        };
      });
    };

    const categoryList: unknown[] = Array.isArray(root.categoryList)
      ? (root.categoryList as unknown[]).slice().sort((a, b) => {
          const aRecord = a as Record<string, unknown>;
          const bRecord = b as Record<string, unknown>;
          return (
            ((aRecord?.orderSeq as number) ?? 0) -
            ((bRecord?.orderSeq as number) ?? 0)
          );
        })
      : [];

    const tmpBanners: unknown[] = [];
    const tmpRegions: unknown[] = [];
    const tmpCategories: unknown[] = [];
    const tmpSections: Section[] = [];

    for (const entry of categoryList) {
      const entryRecord = entry as Record<string, unknown>;
      const templateId: string = String(entryRecord?.templateId ?? '');
      const type: string = String(entryRecord?.type ?? '');
      const d = (entryRecord?.data as Record<string, unknown>) || {};

      // Explicit line banner template
      if (templateId === 'TV_PC_IV_LINE_BANNER_A') {
        let banners: unknown[] = [];
        const asArray = Array.isArray(d) ? d : undefined;
        if (asArray) {
          const sorted = [...asArray].sort((a, b) => {
            const aRecord = a as Record<string, unknown>;
            const bRecord = b as Record<string, unknown>;
            return (
              ((aRecord?.orderSeq as number) ?? 0) -
              ((bRecord?.orderSeq as number) ?? 0)
            );
          });
          banners = sorted.map((b: unknown, i: number) => {
            const bRecord = b as Record<string, unknown>;
            return {
              id: String(
                bRecord?.id ??
                  bRecord?.key ??
                  `${entryRecord?.categoryId ?? 'banner'}-${i}`,
              ),
              image: normalizeImage(
                (bRecord?.imageUrl as string) ||
                  (bRecord?.image as string) ||
                  (bRecord?.imageUrlWide as string) ||
                  (bRecord?.listImg as string) ||
                  (bRecord?.moImg as string) ||
                  (bRecord?.tabImg as string) ||
                  '',
              ),
              title: String(
                bRecord?.title ?? d?.title ?? entryRecord?.name ?? '',
              ),
              subtitle: String(bRecord?.subTitle ?? ''),
              href: absolutize(
                (bRecord?.linkUrl as string) ?? (bRecord?.link as string) ?? '',
              ),
            };
          });
        } else if (Array.isArray(d.bannerList)) {
          const list = (d.bannerList as unknown[])
            .slice()
            .sort((a: unknown, b: unknown) => {
              const aRecord = a as Record<string, unknown>;
              const bRecord = b as Record<string, unknown>;
              return (
                ((aRecord?.orderSeq as number) ?? 0) -
                ((bRecord?.orderSeq as number) ?? 0)
              );
            });
          banners = list.map((b: unknown, i: number) => {
            const bRecord = b as Record<string, unknown>;
            return {
              id: String(
                bRecord.id ??
                  bRecord.key ??
                  `${entryRecord?.categoryId ?? 'banner'}-${i}`,
              ),
              image: normalizeImage(
                (bRecord.image as string) ||
                  (bRecord.imageUrl as string) ||
                  (bRecord.imageUrlWide as string) ||
                  (bRecord.listImg as string) ||
                  (bRecord.moImg as string) ||
                  (bRecord.tabImg as string) ||
                  '',
              ),
              title: String(
                bRecord.title ?? d?.title ?? entryRecord?.name ?? '',
              ),
              subtitle: String(bRecord.subTitle ?? ''),
              href: absolutize(
                (bRecord?.linkUrl as string) ?? (bRecord?.link as string) ?? '',
              ),
            };
          });
        } else if (Array.isArray(d.productList)) {
          const list = (d.productList as unknown[])
            .slice()
            .sort((a: unknown, b: unknown) => {
              const aRecord = a as Record<string, unknown>;
              const bRecord = b as Record<string, unknown>;
              return (
                ((aRecord?.orderSeq as number) ?? 0) -
                ((bRecord?.orderSeq as number) ?? 0)
              );
            });
          banners = list.map((p: unknown, i: number) => {
            const pRecord = p as Record<string, unknown>;
            const detail =
              (pRecord?.productDetail as Record<string, unknown>) || {};
            const img =
              (detail.imageUrlWide as string) ||
              (detail.imageUrl as string) ||
              (detail.imageCommon as string) ||
              (detail.imageCover as string) ||
              '';
            return {
              id: String(
                pRecord.productId ??
                  detail.id ??
                  `${entryRecord?.categoryId ?? 'banner'}-${i}`,
              ),
              image: normalizeImage(img),
              title: String(pRecord.productName ?? detail.name ?? ''),
              subtitle: String(detail.description ?? ''),
              href: absolutize(
                (pRecord?.productLink as string) ??
                  (detail?.productLink as string) ??
                  (detail?.linkUrl as string) ??
                  (pRecord?.linkUrl as string) ??
                  '',
              ),
            };
          });
        } else {
          const img =
            (d.listImg as string) ||
            (d.moImg as string) ||
            (d.tabImg as string) ||
            (d.image as string) ||
            '';
          if (img) {
            banners = [
              {
                id: String(entryRecord?.categoryId ?? 'banner'),
                image: normalizeImage(img),
                title: String((d.title as string) ?? entryRecord?.name ?? ''),
                subtitle: String((d.subTitle as string) ?? ''),
                href: absolutize(
                  (d?.linkUrl as string) ?? (d?.link as string) ?? '',
                ),
              },
            ];
          }
        }
        if (banners.length > 0) {
          tmpBanners.push(...banners);
          tmpSections.push({ templateId: 'TV_PC_IV_LINE_BANNER_A', banners });
        }
        continue;
      }

      // Explicit Best Products tab template
      if (templateId === 'TV_TAB_BSTP') {
        if (Array.isArray(d?.themeList)) {
          const categories = (d.themeList as unknown[]).map((t: unknown) => {
            const tRecord = t as Record<string, unknown>;
            return {
              title: String(
                tRecord?.tabTitle ??
                  tRecord?.title ??
                  d?.title ??
                  entryRecord?.name ??
                  'Best Products',
              ),
              items: mapProductsToItems(
                (tRecord?.productList as unknown[]) || [],
              ),
            };
          });
          tmpCategories.push(...categories);
          tmpSections.push({
            templateId: 'TV_TAB_BSTP',
            categories,
            title: String(
              d?.name ?? entryRecord?.name ?? d?.title ?? 'Best Products',
            ),
          });
        } else if (Array.isArray(d?.productList)) {
          const items = mapProductsToItems(d.productList as unknown[]);
          const title = String(
            d?.title ?? d?.name ?? entryRecord?.name ?? 'Best Products',
          );
          const categories = [{ title, items }];
          tmpCategories.push(...categories);
          tmpSections.push({
            templateId: 'TV_TAB_BSTP',
            categories,
            title: String(d?.name ?? entryRecord?.name ?? 'Best Products'),
          });
        } else {
          const fallback = tmpCategories.slice(0, 4);
          if (fallback.length > 0) {
            tmpSections.push({
              templateId: 'TV_TAB_BSTP',
              categories: fallback,
              title: String(d?.name ?? entryRecord?.name ?? 'Best Products'),
            });
          }
        }
        continue;
      }

      if (type === 'theme') {
        const themeType: string = String(d?.themeType ?? '');
        if (themeType === 'CITY' && Array.isArray(d?.productList)) {
          const regions = (d.productList as unknown[]).map((p: unknown) => {
            const pRecord = p as Record<string, unknown>;
            const detail =
              (pRecord?.productDetail as Record<string, unknown>) || {};
            const cityMast = detail?.cityMast as
              | Record<string, unknown>
              | undefined;
            const name =
              (cityMast?.nameEn as string) ||
              (cityMast?.nameKr as string) ||
              (pRecord?.productName as string) ||
              '';
            // CITY 이미지 규칙: imageCover 사용
            const imageCandidate = (detail.imageCover as string) || '';
            return {
              id: String(
                detail.uniqCode ??
                  detail.cityMasterId ??
                  pRecord.productId ??
                  '',
              ),
              name: String(name),
              subtitle: String(detail.description ?? ''),
              image: normalizeImage(imageCandidate),
            };
          });
          tmpRegions.push(...regions);
          tmpSections.push({ templateId: 'TV_TM_CAROUSEL', regions });
        } else if (Array.isArray(d?.productList)) {
          const items = mapProductsToItems(d.productList as unknown[]);
          const catTitle = String(d.title ?? entryRecord?.categoryId ?? '');
          const category = { title: catTitle, items };
          tmpCategories.push(category);
          tmpSections.push({ templateId: 'TV_PC_TM_PRODUCT_4X1', category });
        }
      } else if (type === 'themeTab') {
        const themeList: unknown[] = Array.isArray(d?.themeList)
          ? (d.themeList as unknown[])
          : [];
        const categories = themeList.map((t: unknown) => {
          const tRecord = t as Record<string, unknown>;
          const items = mapProductsToItems(
            (tRecord?.productList as unknown[]) || [],
          );
          const title = String(tRecord?.tabTitle ?? tRecord?.title ?? '');
          return { title, items };
        });
        tmpCategories.push(...categories);
        tmpSections.push({
          templateId: 'TV_TAB_TWOGRID',
          categories,
          title: String(d?.name ?? entryRecord?.name ?? d?.title ?? ''),
        });
      } else if (type === 'inventory') {
        const imageCandidate =
          (d.listImg as string) ||
          (d.moImg as string) ||
          (d.tabImg as string) ||
          (d.image as string) ||
          '';
        const title =
          (d.title as string) || (entryRecord?.name as string) || '';
        if (imageCandidate) {
          const banners = [
            {
              id: String(entryRecord?.categoryId ?? 'banner'),
              image: normalizeImage(imageCandidate),
              title: String(title),
              subtitle: String(d.subTitle ?? ''),
            },
          ];
          tmpBanners.push(...banners);
          tmpSections.push({ templateId: 'TV_PC_IV_LINE_BANNER_A', banners });
        }
      } else {
        // Fallback by templateId hint
        if (/IV_/.test(templateId)) {
          const imageCandidate =
            (d.listImg as string) ||
            (d.moImg as string) ||
            (d.tabImg as string) ||
            (d.image as string) ||
            '';
          const title =
            (d.title as string) || (entryRecord?.name as string) || '';
          if (imageCandidate) {
            const banners = [
              {
                id: String(entryRecord?.categoryId ?? 'banner'),
                image: normalizeImage(imageCandidate),
                title: String(title),
                subtitle: String(d.subTitle ?? ''),
              },
            ];
            tmpBanners.push(...banners);
            tmpSections.push({ templateId: 'TV_PC_IV_LINE_BANNER_A', banners });
          }
        } else if (
          /PLACE|CITY|CAROUSEL/.test(templateId) &&
          Array.isArray(d?.productList)
        ) {
          const regions = (d.productList as unknown[]).map((p: unknown) => {
            const pRecord = p as Record<string, unknown>;
            const detail =
              (pRecord?.productDetail as Record<string, unknown>) || {};
            const cityMast = detail?.cityMast as
              | Record<string, unknown>
              | undefined;
            const name =
              (cityMast?.nameEn as string) ||
              (cityMast?.nameKr as string) ||
              (pRecord?.productName as string) ||
              '';
            // CITY 유사 템플릿: imageCover 사용
            const imageCandidate = (detail.imageCover as string) || '';
            return {
              id: String(
                detail.uniqCode ??
                  detail.cityMasterId ??
                  pRecord.productId ??
                  '',
              ),
              name: String(name),
              subtitle: String(detail.description ?? ''),
              image: normalizeImage(imageCandidate),
            };
          });
          tmpRegions.push(...regions);
          tmpSections.push({ templateId: 'TV_TM_CAROUSEL', regions });
        } else if (Array.isArray(d?.productList)) {
          const items = mapProductsToItems(d.productList as unknown[]);
          const catTitle = String(d.title ?? entryRecord?.categoryId ?? '');
          const category = { title: catTitle, items };
          tmpCategories.push(category);
          tmpSections.push({ templateId: 'TV_PC_TM_PRODUCT_4X1', category });
        }
      }
    }

    const normalized = {
      banners: tmpBanners,
      regions: tmpRegions,
      categories: tmpCategories,
    };
    const parsed = HomeDataSchema.safeParse(normalized);
    if (parsed.success) {
      mapped = parsed.data;
      sections = tmpSections;
    }
  }

  return (
    <HomePageClient
      banners={mapped.banners}
      regions={mapped.regions}
      categories={mapped.categories}
      sections={sections}
    />
  );
}
