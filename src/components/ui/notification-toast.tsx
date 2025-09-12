'use client'

import { useEffect } from 'react'
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react'
import { useNotificationStore, Notification } from '@/store/notification-store'
import { Button } from './button'
import { cn } from '@/lib/utils'

interface NotificationToastProps {
  notification: Notification
  onRemove: (id: string) => void
}

const iconMap = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
}

const colorMap = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
}

export function NotificationToast({ notification, onRemove }: NotificationToastProps) {
  const Icon = iconMap[notification.type]

  useEffect(() => {
    if (notification.duration !== 0) {
      const timer = setTimeout(() => {
        onRemove(notification.id)
      }, notification.duration || 5000)

      return () => clearTimeout(timer)
    }
  }, [notification.id, notification.duration, onRemove])

  return (
    <div
      className={cn(
        'fixed bottom-4 right-4 max-w-sm w-full bg-white rounded-lg shadow-lg border p-4 z-50 animate-slide-in-right',
        colorMap[notification.type]
      )}
    >
      <div className="flex items-start space-x-3">
        <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium">{notification.title}</h4>
          <p className="text-sm mt-1">{notification.message}</p>
          {notification.actions && notification.actions.length > 0 && (
            <div className="mt-3 space-x-2">
              {notification.actions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={action.action}
                  className="text-xs"
                >
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(notification.id)}
          className="h-6 w-6 p-0 flex-shrink-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export function NotificationContainer() {
  const { notifications, removeNotification } = useNotificationStore()

  return (
    <div className="fixed bottom-4 right-4 space-y-2 z-50">
      {notifications.map((notification) => (
        <NotificationToast
          key={notification.id}
          notification={notification}
          onRemove={removeNotification}
        />
      ))}
    </div>
  )
}
