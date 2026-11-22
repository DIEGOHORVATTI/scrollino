import { useEffect, useRef } from 'react'
import { useRouter } from 'expo-router'

import { ScrollEngine } from '@/modules/scroll-engine'
import { requestNotifications } from '@/src/lib/notifications'

type Setup = {
  ready: boolean
  serviceEnabled: boolean
  serviceStuck: boolean
  notificationsEnabled: boolean
}

export function useSetupOnLaunch({
  ready,
  serviceEnabled,
  serviceStuck,
  notificationsEnabled,
}: Setup) {
  const router = useRouter()
  const asked = useRef(false)

  useEffect(() => {
    if (!ready || asked.current) return
    asked.current = true
    if (!serviceEnabled && !serviceStuck) return router.push('/disclosure')
    if (!notificationsEnabled) {
      void requestNotifications().then(() => ScrollEngine.refreshControls())
    }
  }, [router, ready, serviceEnabled, serviceStuck, notificationsEnabled])
}
