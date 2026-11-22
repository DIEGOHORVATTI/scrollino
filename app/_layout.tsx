import '../global.css'

import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

import { useAppPreferences } from '@/src/hooks/use-app-preferences'
import { useSplashGate } from '@/src/hooks/use-splash-gate'
import { t } from '@/src/i18n'
import { useThemeColors } from '@/src/theme/colors'

export default function RootLayout() {
  const colors = useThemeColors()
  const language = useAppPreferences()
  useSplashGate()

  return (
    <>
      <StatusBar style="auto" />
      <Stack
        key={language}
        screenOptions={{
          headerStyle: { backgroundColor: colors.paper },
          headerTintColor: colors.ink,
          headerTitleStyle: { fontFamily: 'Literata_600SemiBold' },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.paper },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="disclosure" options={{ headerShown: false, presentation: 'modal' }} />
        <Stack.Screen name="apps" options={{ title: t('apps') }} />
      </Stack>
    </>
  )
}
