import { ScrollEngine } from '@/modules/scroll-engine'
import { useEnableService } from '@/src/features/engine/use-enable-service'
import { useEngineState } from '@/src/hooks/use-engine-state'
import { t } from '@/src/i18n'
import { requestNotifications } from '@/src/lib/notifications'
import { toast } from '@/src/lib/toast'

export function useToggleScroll() {
  const enableService = useEnableService()
  const engine = useEngineState()

  async function toggle() {
    if (engine.running) return ScrollEngine.stop()
    if (!engine.serviceEnabled) {
      toast(t('serviceRequired'))
      return enableService()
    }
    await requestNotifications()
    ScrollEngine.refreshControls()
    ScrollEngine.start()
  }

  return { engine, toggle }
}
