import type {
  ProductItem,
  ProductSearchResponse,
} from '@/features/activity/types';
import { PRODUCT_FIELDS, API_CONFIG, universalEnv } from '@/lib/constants/api';

const normalizeImage = (p: any): string => {
  const displayImages = Array.isArray(p?.display_images)
    ? p.display_images
    : [];
  const fromDisplay = displayImages.find(
    (img: any) => typeof img?.origin === 'string',
  )?.origin;
  const fallback =
    typeof p?.primary_image?.origin === 'string' ? p.primary_image.origin : '';
  const candidate = fromDisplay || fallback || '';
  return String(candidate || '');
};

const normalizeImages = (p: any): string[] => {
  const displayImages = Array.isArray(p?.display_images)
    ? p.display_images
    : [];
  const images: string[] = [];
  // display_images의 origin만 사용
  displayImages.forEach((img: any) => {
    const origin = typeof img?.origin === 'string' ? String(img.origin) : '';
    if (origin && !images.includes(origin)) {
      images.push(origin);
    }
  });
  return images;
};

export const mapToProductItems = (data: unknown): ProductItem[] => {
  const root = data as any;
  if (!Array.isArray(root?.list)) return [];
  return root.list.map((p: any) => {
    const displayPrice = p?.display_price || {};
    const priceObj = p?.price || {};
    const ratingScore = Number(p?.review?.review_score ?? 0);
    const ratingCount = Number(p?.review?.review_count ?? 0);
    const areas = Array.isArray(p?.areas) ? p.areas : [];
    const cityArea =
      areas.find((a: any) => String(a?.scope).toLowerCase() === 'city') ||
      areas[0] ||
      null;
    const locationName = cityArea?.name ? String(cityArea.name) : null;
    const categories = Array.isArray(p?.categories) ? p.categories : [];
    const firstCategory = categories[0] || null;
    const categoryName = firstCategory?.name
      ? String(firstCategory.name)
      : null;
    return {
      id: String(p?.product_id ?? p?.id ?? ''),
      title: String(p?.name ?? p?.summaries?.display_name ?? ''),
      image: normalizeImage(p),
      images: normalizeImages(p),
      price:
        Number(displayPrice?.price2 ?? priceObj?.repr ?? priceObj?.disp ?? 0) ||
        undefined,
      originalPrice:
        Number(displayPrice?.price1 ?? priceObj?.disp ?? 0) || undefined,
      discountRate:
        Number(displayPrice?.dc_rate ?? priceObj?.dc_value ?? 0) || undefined,
      rating: ratingScore > 0 ? ratingScore : undefined,
      reviewCount: ratingCount > 0 ? ratingCount : undefined,
      location: locationName,
      category: categoryName,
    };
  });
};

export const buildApiBase = (token: string | undefined): string => {
  // universalEnv를 사용하여 환경별 API 주소 사용
  // 토큰이 없거나 파싱 실패 시 현재 환경의 API 주소 사용
  if (!token) {
    return universalEnv.apiBaseUrls.tnt.replace('/tna-api-v2/rest', '');
  }
  try {
    const parts = token.split('.');
    if (parts.length < 2) {
      return universalEnv.apiBaseUrls.tnt.replace('/tna-api-v2/rest', '');
    }
    const base64url = parts[1];
    const base64 =
      base64url.replace(/-/g, '+').replace(/_/g, '/') +
      '==='.slice((base64url.length + 3) % 4);
    const json = Buffer.from(base64, 'base64').toString('utf8');
    const payload = JSON.parse(json) as { stage?: string };
    const stage = String(payload?.stage || '').toLowerCase();

    // 토큰의 stage 정보에 따라 환경별 URL 반환
    if (stage === 'prod' || stage === 'production') {
      return 'https://apollo-api.tidesquare.com';
    } else if (stage === 'stg' || stage === 'stage') {
      return 'https://stg-apollo-api.tidesquare.com';
    }
    // 기본값은 현재 환경의 API 주소
    return universalEnv.apiBaseUrls.tnt.replace('/tna-api-v2/rest', '');
  } catch {
    return universalEnv.apiBaseUrls.tnt.replace('/tna-api-v2/rest', '');
  }
};

export interface ProductSearchOptions {
  count?: number;
  offset?: number;
  fields?: string[];
  keyword?: string;
}

export interface ProductSearchResult {
  ok: boolean;
  items: ProductItem[];
  total?: number;
  hasMore?: boolean;
  status?: number;
  url?: string;
  errorBody?: string;
}

export async function fetchProducts(
  providerIds: string,
  options: ProductSearchOptions = {},
): Promise<ProductSearchResult> {
  const apiBase =
    process.env.TNA_API_BASE ||
    process.env.NEXT_PUBLIC_TNA_API_BASE ||
    buildApiBase(process.env.TNA_API_TOKEN);
  const url = new URL(`${apiBase}/tna-api-v2/rest/product/_search`);
  url.searchParams.set('provider_ids', providerIds);
  url.searchParams.set(
    'count',
    String(options.count ?? API_CONFIG.DEFAULT_PAGE_SIZE),
  );
  url.searchParams.set('offset', String(options.offset ?? 0));

  // 키워드 검색 추가
  if (options.keyword) {
    url.searchParams.set('keyword', options.keyword);
  }

  // 필수 필드만 요청하여 데이터 전송량 최적화
  const requiredFields = options.fields ?? PRODUCT_FIELDS.ALL;
  url.searchParams.set('fields', requiredFields.join(','));

  const headers: Record<string, string> = { accept: 'application/json' };
  if (process.env.TNA_API_TOKEN) {
    const raw = process.env.TNA_API_TOKEN;
    const normalized = raw
      .replace(/^Bearer\s+/i, '')
      .replace(/^\s+|\s+$/g, '')
      .replace(/^"+|"+$/g, '')
      .replace(/^'+|'+$/g, '');
    headers.Authorization = `Bearer ${normalized}`;
  }

  const res = await fetch(url.toString(), {
    cache: 'no-store',
    headers,
    // HTTP 캐싱 헤더 추가
    next: { revalidate: 300 }, // 5분 캐시
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    return {
      ok: false,
      items: [],
      status: res.status,
      url: url.toString(),
      errorBody: body,
    };
  }

  const json = (await res.json()) as ProductSearchResponse;
  const items = mapToProductItems(json);
  const total = json.total ?? json.list?.length ?? 0;
  const currentOffset = options.offset ?? 0;
  const currentCount = options.count ?? 20;

  return {
    ok: true,
    items,
    total,
    hasMore: currentOffset + currentCount < total,
  };
}

// 무한 스크롤을 위한 함수
export async function fetchProductsInfinite(
  providerIds: string,
  page: number = 0,
  pageSize: number = API_CONFIG.DEFAULT_PAGE_SIZE,
  keyword?: string,
): Promise<ProductSearchResult> {
  return fetchProducts(providerIds, {
    count: pageSize,
    offset: page * pageSize,
    keyword,
  });
}
