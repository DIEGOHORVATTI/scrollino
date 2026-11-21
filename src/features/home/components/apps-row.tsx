import { useRouter } from 'expo-router'
import { ChevronRight } from 'lucide-react-native'
import { Pressable, Text, View } from 'react-native'

import { t, tn } from '@/src/i18n'
import { useSettings } from '@/src/stores/settings-store'
import { useThemeColors } from '@/src/theme/colors'

export function AppsRow() {
  const router = useRouter()
  const colors = useThemeColors()
  const count = useSettings((state) => state.allowedPackages.length)

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => router.push('/apps')}
      className="flex-row items-center gap-3 rounded-2xl border border-border bg-bg-card p-4 active:opacity-70"
    >
      <View className="flex-1 gap-0.5">
        <Text className="text-base font-semibold text-text-primary">{t('apps')}</Text>
        <Text className="text-sm text-text-secondary">
          {count ? tn('appsSome', count) : t('appsAll')}
        </Text>
      </View>
      <ChevronRight size={20} color={colors.muted} />
    </Pressable>
  )
}
