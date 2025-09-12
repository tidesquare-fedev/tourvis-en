import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  timestamp: Date
  duration?: number // 자동 제거 시간 (ms), 0이면 수동으로만 제거
  actions?: Array<{
    label: string
    action: () => void
  }>
}

interface NotificationState {
  notifications: Notification[]
  
  // 액션
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => string
  removeNotification: (id: string) => void
  clearAll: () => void
  
  // 헬퍼 메서드
  success: (title: string, message: string, options?: Partial<Notification>) => string
  error: (title: string, message: string, options?: Partial<Notification>) => string
  warning: (title: string, message: string, options?: Partial<Notification>) => string
  info: (title: string, message: string, options?: Partial<Notification>) => string
}

export const useNotificationStore = create<NotificationState>()(
  devtools(
    (set, get) => ({
      notifications: [],

      addNotification: (notification) => {
        const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        const newNotification: Notification = {
          ...notification,
          id,
          timestamp: new Date(),
        }

        set((state) => ({
          notifications: [...state.notifications, newNotification],
        }))

        // 자동 제거 설정
        if (newNotification.duration !== 0) {
          const duration = newNotification.duration || 5000
          setTimeout(() => {
            get().removeNotification(id)
          }, duration)
        }

        return id
      },

      removeNotification: (id) => set((state) => ({
        notifications: state.notifications.filter(n => n.id !== id),
      })),

      clearAll: () => set({ notifications: [] }),

      // 헬퍼 메서드들
      success: (title, message, options = {}) => {
        return get().addNotification({
          type: 'success',
          title,
          message,
          ...options,
        })
      },

      error: (title, message, options = {}) => {
        return get().addNotification({
          type: 'error',
          title,
          message,
          duration: 0, // 에러는 수동으로 제거
          ...options,
        })
      },

      warning: (title, message, options = {}) => {
        return get().addNotification({
          type: 'warning',
          title,
          message,
          ...options,
        })
      },

      info: (title, message, options = {}) => {
        return get().addNotification({
          type: 'info',
          title,
          message,
          ...options,
        })
      },
    }),
    {
      name: 'notification-store',
    }
  )
)
