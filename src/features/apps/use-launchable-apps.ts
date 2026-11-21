import { useEffect, useState } from 'react'

import { type LaunchableApp, ScrollEngine } from '@/modules/scroll-engine'

export function useLaunchableApps() {
  const [apps, setApps] = useState<LaunchableApp[] | null>(null)

  useEffect(() => {
    let active = true
    void ScrollEngine.listLaunchableApps().then((list) => {
      if (active) setApps(list)
    })
    return () => {
      active = false
    }
  }, [])

  return apps
}
