'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AdminSession } from '@/types/admin'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: 'admin' | 'super_admin'
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const [admin, setAdmin] = useState<AdminSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch('/en/api/admin/auth/me')
      if (response.ok) {
        const data = await response.json()
        const adminData = data.admin

        // 권한 확인
        if (requiredRole && adminData.role !== requiredRole && adminData.role !== 'super_admin') {
          router.push('/en/admin/login?error=insufficient_permissions')
          return
        }

        setAdmin(adminData)
      } else {
        router.push('/en/admin/login')
      }
    } catch (error) {
      router.push('/en/admin/login')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!admin) {
    return null
  }

  return <>{children}</>
}
