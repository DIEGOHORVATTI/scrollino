import { ChevronRight } from 'lucide-react-native'
import { Pressable, Text, View } from 'react-native'

import { useEnableService } from '@/src/features/engine/use-enable-service'
import { t } from '@/src/i18n'
import { useThemeColors } from '@/src/theme/colors'

type ServiceCardProps = {
  enabled: boolean
}

export function ServiceCard({ enabled }: ServiceCardProps) {
  const enableService = useEnableService()
  const colors = useThemeColors()

  return (
    <Pressable
      accessibilityRole="button"
      disabled={enabled}
      onPress={enableService}
      className="flex-row items-center gap-3 rounded-2xl border border-border bg-bg-card p-4 active:opacity-70"
    >
      <View className={`h-3 w-3 rounded-full ${enabled ? 'bg-primary' : 'bg-danger'}`} />
      <View className="flex-1 gap-0.5">
        <Text className="text-base font-semibold text-text-primary">{t('serviceTitle')}</Text>
        <Text className="text-sm text-text-secondary">
          {enabled ? t('serviceOn') : t('serviceEnable')}
        </Text>
      </View>
      {enabled ? null : <ChevronRight size={20} color={colors.muted} />}
    </Pressable>
  )
}
