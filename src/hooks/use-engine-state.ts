import { useEffect, useState } from 'react'

import { type EngineState, ScrollEngine } from '@/modules/scroll-engine'

export function useEngineState() {
  const [state, setState] = useState<EngineState>(() => ScrollEngine.getState())
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const subscription = ScrollEngine.addListener('onStateChange', setState)
    void ScrollEngine.requestState().then((current) => {
      setState(current)
      setReady(true)
    })
    return () => subscription.remove()
  }, [])

  return { ...state, ready }
}
