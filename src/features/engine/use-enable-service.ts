import { useRouter } from 'expo-router'

import { ScrollEngine } from '@/modules/scroll-engine'
import { useSettings } from '@/src/stores/settings-store'

export function useEnableService() {
  const router = useRouter()

  return () => {
    if (useSettings.getState().disclosureAccepted) return ScrollEngine.openAccessibilitySettings()
    router.push('/disclosure')
  }
}
