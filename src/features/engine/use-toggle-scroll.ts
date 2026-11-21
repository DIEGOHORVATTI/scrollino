import { ScrollEngine } from '@/modules/scroll-engine'
import { useEnableService } from '@/src/features/engine/use-enable-service'
import { useEngineState } from '@/src/hooks/use-engine-state'
import { t } from '@/src/i18n'
import { toast } from '@/src/lib/toast'

export function useToggleScroll() {
  const enableService = useEnableService()
  const engine = useEngineState()

  function toggle() {
    if (engine.running) return ScrollEngine.stop()
    if (!engine.serviceEnabled) {
      toast(t('serviceRequired'))
      return enableService()
    }
    ScrollEngine.start()
  }

  return { engine, toggle }
}
