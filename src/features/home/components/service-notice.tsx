import { Pressable, Text, View } from 'react-native'

import { useEnableService } from '@/src/features/engine/use-enable-service'
import { t } from '@/src/i18n'

export function ServiceNotice() {
  const enableService = useEnableService()

  return (
    <View className="flex-row items-center gap-4 rounded-2xl bg-marker px-5 py-4">
      <Text className="flex-1 text-[15px] leading-5 text-on-marker">{t('serviceOffNotice')}</Text>
      <Pressable
        accessibilityRole="button"
        onPress={enableService}
        className="rounded-full bg-ink px-4 py-2 active:opacity-80"
      >
        <Text className="text-sm font-semibold text-paper">{t('serviceTurnOn')}</Text>
      </Pressable>
    </View>
  )
}
