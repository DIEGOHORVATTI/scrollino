import { useSyncExternalStore } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { systemLanguage } from '@/src/i18n'

export type ThemePreference = 'system' | 'light' | 'dark'

type Preferences = {
  language: string
  theme: ThemePreference
  disclosureAccepted: boolean
  allowedPackages: string[]
}

type SettingsState = Preferences & {
  update: (patch: Partial<Preferences>) => void
  toggleAllowed: (packageName: string) => void
}

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      language: systemLanguage,
      theme: 'system',
      disclosureAccepted: false,
      allowedPackages: [],
      update: (patch) => set(patch),
      toggleAllowed: (packageName) =>
        set(({ allowedPackages }) => ({
          allowedPackages: allowedPackages.includes(packageName)
            ? allowedPackages.filter((name) => name !== packageName)
            : [...allowedPackages, packageName],
        })),
    }),
    { name: 'settings', storage: createJSONStorage(() => AsyncStorage) },
  ),
)

export function useSettingsHydrated() {
  return useSyncExternalStore(
    useSettings.persist.onFinishHydration,
    useSettings.persist.hasHydrated,
  )
}
