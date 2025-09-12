'use client'

import { Badge } from '@/components/ui/badge'
import { Wifi, WifiOff } from 'lucide-react'

interface RealtimeIndicatorProps {
  isConnected: boolean
}

export function RealtimeIndicator({ isConnected }: RealtimeIndicatorProps) {
  return (
    <div className="flex items-center space-x-2">
      {isConnected ? (
        <>
          <Wifi className="h-4 w-4 text-green-500" />
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            실시간 연결됨
          </Badge>
        </>
      ) : (
        <>
          <WifiOff className="h-4 w-4 text-red-500" />
          <Badge variant="secondary" className="bg-red-100 text-red-800">
            연결 끊김
          </Badge>
        </>
      )}
    </div>
  )
}
