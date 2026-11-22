import { useEffect } from 'react'
import { Appearance } from 'react-native'

import { ScrollEngine } from '@/modules/scroll-engine'
import { setLanguage, t } from '@/src/i18n'
import { useSettings } from '@/src/stores/settings-store'

export function useAppPreferences() {
  const language = useSettings((state) => state.language)
  const theme = useSettings((state) => state.theme)
  const allowedPackages = useSettings((state) => state.allowedPackages)
  setLanguage(language)

  useEffect(() => {
    Appearance.setColorScheme(theme === 'system' ? 'unspecified' : theme)
  }, [theme])

  useEffect(() => {
    ScrollEngine.setLabels({
      autoStopped: t('autoStopped'),
      controlsChannel: t('controlsChannel'),
      notifScrolling: t('notifScrolling'),
      notifPaused: t('notifPaused'),
      actionStart: t('actionStart'),
      actionPause: t('pause'),
      actionSlower: t('actionSlower'),
      actionFaster: t('actionFaster'),
    })
  }, [language])

  useEffect(() => {
    ScrollEngine.setAllowedPackages(allowedPackages)
  }, [allowedPackages])

  return language
}
