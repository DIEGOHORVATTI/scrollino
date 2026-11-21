import { useEffect, useState } from 'react'

import { type EngineState, ScrollEngine } from '@/modules/scroll-engine'

export function useEngineState() {
  const [state, setState] = useState<EngineState>(() => ScrollEngine.getState())

  useEffect(() => {
    const subscription = ScrollEngine.addListener('onStateChange', setState)
    return () => subscription.remove()
  }, [])

  return state
}
