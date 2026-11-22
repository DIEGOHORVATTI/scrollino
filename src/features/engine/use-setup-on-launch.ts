import { useEffect, useRef } from 'react'
import { useRouter } from 'expo-router'

import { ScrollEngine } from '@/modules/scroll-engine'
import { requestNotifications } from '@/src/lib/notifications'

type Setup = { serviceEnabled: boolean; notificationsEnabled: boolean }

const NAVIGATION_READY_MS = 300

export function useSetupOnLaunch({ serviceEnabled, notificationsEnabled }: Setup) {
  const router = useRouter()
  const asked = useRef(false)

  useEffect(() => {
    if (asked.current) return
    asked.current = true
    if (!serviceEnabled) {
      const timer = setTimeout(() => router.push('/disclosure'), NAVIGATION_READY_MS)
      return () => clearTimeout(timer)
    }
    if (!notificationsEnabled) {
      void requestNotifications().then(() => ScrollEngine.refreshControls())
    }
  }, [router, serviceEnabled, notificationsEnabled])
}
