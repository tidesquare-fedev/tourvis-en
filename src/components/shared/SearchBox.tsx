'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

type SearchBoxProps = {
  channelId?: number
  host?: string
  placeholder?: string
  className?: string
}

declare global {
  interface Window {
    __$search_main?: (keyword: string, callback: (result: unknown) => void) => void
  }
}

export default function SearchBox({ channelId = 3, host, placeholder = 'Search tours, regions, categories', className }: SearchBoxProps) {
  const router = useRouter()
  const [keyword, setKeyword] = useState('')
  const scriptLoadedRef = useRef(false)

  const resolvedHost = useMemo(() => {
    if (host) return host
    if (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_SEARCH_HOST) return String(process.env.NEXT_PUBLIC_SEARCH_HOST)
    if (typeof window !== 'undefined' && window.location?.host) return window.location.host
    return 'cdns.tourvis.com'
  }, [host])

  useEffect(() => {
    if (scriptLoadedRef.current) return
    const id = '__search_main_loader__'
    if (document.getElementById(id)) {
      scriptLoadedRef.current = true
      return
    }
    const s = document.createElement('script')
    s.id = id
    s.async = true
    s.src = `https://${resolvedHost}/script/search-main.js?channel_id=${channelId}`
    s.onload = () => {
      scriptLoadedRef.current = true
    }
    document.body.appendChild(s)
    return () => {
      // keep script cached; no cleanup
    }
  }, [channelId, resolvedHost])

  const onSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    const q = keyword.trim()
    if (!q) return
    router.push(`/activity/search?q=${encodeURIComponent(q)}&channel_id=${channelId}`)
  }

  return (
    <form onSubmit={onSubmit} className={className} role="search" aria-label="Global search">
      <div className="flex items-center gap-2">
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') onSubmit() }}
          placeholder={placeholder}
          aria-label="Search keyword"
          className="w-full sm:w-64 md:w-72 lg:w-80 h-9 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </form>
  )
}


