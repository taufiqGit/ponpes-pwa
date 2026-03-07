'use client'

import { useEffect, useState } from 'react'
import { Bell, BellOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNotifications } from '@/hooks/use-notifications'

export function NotificationButton() {
  const { notificationSupported, notificationPermission, requestNotificationPermission } = useNotifications()
  const [isGranted, setIsGranted] = useState(false)

  useEffect(() => {
    setIsGranted(notificationPermission === 'granted')
  }, [notificationPermission])

  if (!notificationSupported) {
    return null
  }

  const handleToggleNotifications = async () => {
    if (!isGranted) {
      const result = await requestNotificationPermission()
      if (result === 'granted') {
        setIsGranted(true)
      }
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggleNotifications}
      className="rounded-full"
      title={isGranted ? 'Notifications enabled' : 'Enable notifications'}
    >
      {isGranted ? (
        <Bell className="w-4 h-4" />
      ) : (
        <BellOff className="w-4 h-4 opacity-50" />
      )}
    </Button>
  )
}
