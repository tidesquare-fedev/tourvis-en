import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { AdminSession } from '@/types/admin'

interface AuthState {
  // 인증 상태
  isAuthenticated: boolean
  admin: AdminSession | null
  
  // UI 상태
  isLoading: boolean
  
  // 액션
  login: (admin: AdminSession) => void
  logout: () => void
  setLoading: (loading: boolean) => void
  
  // 권한 확인
  hasRole: (role: string) => boolean
  isSuperAdmin: () => boolean
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        // 초기 상태
        isAuthenticated: false,
        admin: null,
        isLoading: false,

        // 인증 액션
        login: (admin) => set({
          isAuthenticated: true,
          admin,
          isLoading: false,
        }),

        logout: () => set({
          isAuthenticated: false,
          admin: null,
          isLoading: false,
        }),

        setLoading: (loading) => set({ isLoading: loading }),

        // 권한 확인
        hasRole: (role) => {
          const { admin } = get()
          return admin?.role === role
        },

        isSuperAdmin: () => {
          const { admin } = get()
          return admin?.role === 'super_admin'
        },
      }),
      {
        name: 'auth-store',
        partialize: (state) => ({
          // 인증 정보만 persist (보안상 민감한 정보는 제외)
          isAuthenticated: state.isAuthenticated,
          admin: state.admin ? {
            id: state.admin.id,
            username: state.admin.username,
            role: state.admin.role,
          } : null,
        }),
      }
    ),
    {
      name: 'auth-store',
    }
  )
)
