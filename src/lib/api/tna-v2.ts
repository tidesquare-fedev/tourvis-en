import { buildApiBase } from '@/features/activity/lib/searchApi'

type HeadersMap = Record<string, string>

const getHeaders = (): HeadersMap => {
  const headers: HeadersMap = { accept: 'application/json' }
  if (process.env.TNA_API_TOKEN) {
    const raw = process.env.TNA_API_TOKEN
    const normalized = raw.replace(/^Bearer\s+/i, '').replace(/^\s+|\s+$/g, '').replace(/^"+|"+$/g, '').replace(/^'+|'+$/g, '')
    headers.Authorization = `Bearer ${normalized}`
  }
  return headers
}

const apiBaseV2 = () => {
  const base = process.env.TNA_API_BASE || process.env.NEXT_PUBLIC_TNA_API_BASE || buildApiBase(process.env.TNA_API_TOKEN)
  // ensure /tna-api-v2/rest/v2 prefix
  return `${base}/tna-api-v2/rest/v2`
}

export async function getProductDetailV2(productId: string) {
  const url = `${apiBaseV2()}/product/${encodeURIComponent(productId)}`
  const res = await fetch(url, { cache: 'no-store', headers: getHeaders() })
  if (!res.ok) throw new Error(`detail ${res.status}`)
  return res.json() as Promise<any>
}

export async function getProductDetailV2Cached(productId: string, revalidateSeconds = 300) {
  const url = `${apiBaseV2()}/product/${encodeURIComponent(productId)}`
  const res = await fetch(url, { next: { revalidate: revalidateSeconds }, headers: getHeaders() })
  if (!res.ok) throw new Error(`detail ${res.status}`)
  return res.json() as Promise<any>
}

export async function getProductDatesV2(productId: string, startDate?: string) {
  const url = new URL(`${apiBaseV2()}/product/${encodeURIComponent(productId)}/dates`)
  if (startDate) url.searchParams.set('start_date', startDate)
  const res = await fetch(url.toString(), { cache: 'no-store', headers: getHeaders() })
  if (!res.ok) throw new Error(`dates ${res.status}`)
  return res.json() as Promise<string[] | any>
}

export async function getProductOptionsDateTypeV2(productId: string, date: string) {
  const url = `${apiBaseV2()}/product/${encodeURIComponent(productId)}/${encodeURIComponent(date)}/options`
  const res = await fetch(url, { cache: 'no-store', headers: getHeaders() })
  if (!res.ok) throw new Error(`options-date ${res.status}`)
  return res.json() as Promise<any>
}

export async function getProductOptionsPeriodTypeV2(productId: string) {
  const url = `${apiBaseV2()}/product/${encodeURIComponent(productId)}/options`
  const res = await fetch(url, { cache: 'no-store', headers: getHeaders() })
  if (!res.ok) throw new Error(`options-period ${res.status}`)
  return res.json() as Promise<any>
}

export async function getProductPriceDateTypeV2(productId: string, body: unknown) {
  const base = `${apiBaseV2()}/product/${encodeURIComponent(productId)}/price/data-type`
  // Try POST first
  let res = await fetch(base, { method: 'POST', cache: 'no-store', headers: { ...getHeaders(), 'content-type': 'application/json' }, body: JSON.stringify(body) })
  if (res.ok) return res.json() as Promise<any>
  // Fallback: GET with query params
  try {
    const anyBody: any = body || {}
    const url = new URL(base)
    if (anyBody?.product_option_code) url.searchParams.set('product_option_code', String(anyBody.product_option_code))
    if (anyBody?.start_date) url.searchParams.set('start_date', String(anyBody.start_date))
    if (anyBody?.end_date) url.searchParams.set('end_date', String(anyBody.end_date))
    res = await fetch(url.toString(), { cache: 'no-store', headers: getHeaders() })
    if (!res.ok) throw new Error(`price-date ${res.status}`)
    return res.json() as Promise<any>
  } catch (e) {
    throw new Error(`price-date ${res.status}`)
  }
}

export async function getProductPricePeriodTypeV2(productId: string, body: unknown) {
  const base = `${apiBaseV2()}/product/${encodeURIComponent(productId)}/price/period-type`
  // Try POST first
  let res = await fetch(base, { method: 'POST', cache: 'no-store', headers: { ...getHeaders(), 'content-type': 'application/json' }, body: JSON.stringify(body) })
  if (res.ok) return res.json() as Promise<any>
  // Fallback: GET with query params
  try {
    const anyBody: any = body || {}
    const url = new URL(base)
    if (anyBody?.product_option_code) url.searchParams.set('product_option_code', String(anyBody.product_option_code))
    if (anyBody?.start_date) url.searchParams.set('start_date', String(anyBody.start_date))
    if (anyBody?.end_date) url.searchParams.set('end_date', String(anyBody.end_date))
    res = await fetch(url.toString(), { cache: 'no-store', headers: getHeaders() })
    if (!res.ok) throw new Error(`price-period ${res.status}`)
    return res.json() as Promise<any>
  } catch (e) {
    throw new Error(`price-period ${res.status}`)
  }
}


