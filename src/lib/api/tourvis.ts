export type TourvisHomePayload = {
  brand: string
  platform: string
  productDetailYn: string
  showType: string
  svcDivn: string
}

export interface FetchResult<T> {
  ok: boolean
  data: T | null
  error?: string
}

// Server-only fetch for Tourvis page info
export async function fetchTourvisHome<T = unknown>(
  payload: TourvisHomePayload,
): Promise<FetchResult<T>> {
  try {
    const res = await fetch('https://dapi.tourvis.com/api/page/getPageInfo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // Dynamic content → no-store per team policy
      cache: 'no-store',
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      return { ok: false, data: null, error: `HTTP ${res.status}` }
    }

    const json = (await res.json()) as T
    return { ok: true, data: json }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'unknown error'
    return { ok: false, data: null, error: message }
  }
}


