import { useEffect, useState } from 'react'

export interface NotificationPermission {
  supported: boolean
  permission: NotificationPermission | 'default' | 'granted' | 'denied'
  requestPermission: () => Promise<NotificationPermission>
}

export function useNotifications() {
  const [notificationSupported, setNotificationSupported] = useState(false)
  const [notificationPermission, setNotificationPermission] = useState<
    'default' | 'granted' | 'denied'
  >('default')

  useEffect(() => {
    // Check if notifications are supported
    if ('Notification' in window) {
      setNotificationSupported(true)
      setNotificationPermission(Notification.permission as any)
    }
  }, [])

  const requestNotificationPermission = async () => {
    if (!notificationSupported) {
      console.warn('[v0] Notifications not supported')
      return 'denied'
    }

    try {
      const permission = await Notification.requestPermission()
      setNotificationPermission(permission)

      // Also request service worker push notifications
      if ('serviceWorker' in navigator && permission === 'granted') {
        try {
          const registration = await navigator.serviceWorker.ready
          // In a real app, you would subscribe to push notifications here
          // For now, just log it
          console.log('[v0] Service Worker ready for push notifications')
        } catch (error) {
          console.error('[v0] Service Worker error:', error)
        }
      }

      return permission
    } catch (error) {
      console.error('[v0] Permission request error:', error)
      return 'denied'
    }
  }

  const sendNotification = (title: string, options?: NotificationOptions) => {
    if (!notificationSupported) {
      console.warn('[v0] Notifications not supported')
      return
    }

    if (notificationPermission !== 'granted') {
      console.warn('[v0] Notification permission not granted')
      return
    }

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification(title, {
          icon: '/icon-192x192.png',
          badge: '/icon-96x96.png',
          ...options,
        })
      })
    } else {
      new Notification(title, {
        icon: '/icon-192x192.png',
        badge: '/icon-96x96.png',
        ...options,
      })
    }
  }

  return {
    notificationSupported,
    notificationPermission,
    requestNotificationPermission,
    sendNotification,
  }
}
