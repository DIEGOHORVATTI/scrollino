import { useRouter } from 'expo-router'
import { EyeOff, Hand, ShieldCheck } from 'lucide-react-native'
import { ScrollView, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import type { LucideIcon } from 'lucide-react-native'

import { ScrollEngine } from '@/modules/scroll-engine'
import { Button } from '@/src/components/ui/button'
import { ScreenFooter } from '@/src/components/ui/screen-footer'
import { t } from '@/src/i18n'
import { useSettings } from '@/src/stores/settings-store'
import { useThemeColors } from '@/src/theme/colors'

type PointProps = {
  icon: LucideIcon
  text: string
}

function Point({ icon: Icon, text }: PointProps) {
  const colors = useThemeColors()

  return (
    <View className="flex-row gap-3">
      <Icon size={22} color={colors.pencil} />
      <Text className="flex-1 text-base leading-6 text-ink">{text}</Text>
    </View>
  )
}

export default function DisclosureScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()

  function agree() {
    useSettings.getState().update({ disclosureAccepted: true })
    router.back()
    ScrollEngine.openAccessibilitySettings()
  }

  return (
    <View className="flex-1 bg-paper" style={{ paddingTop: insets.top }}>
      <ScrollView contentContainerClassName="gap-6 p-6">
        <Text className="font-serif-bold text-[28px] leading-9 text-ink">
          {t('disclosureTitle')}
        </Text>
        <Point icon={ShieldCheck} text={t('disclosureWhy')} />
        <Point icon={Hand} text={t('disclosureDoes')} />
        <Point icon={EyeOff} text={t('disclosureDoesNot')} />
        <Text className="text-sm leading-5 text-faint">{t('disclosureRestricted')}</Text>
      </ScrollView>
      <ScreenFooter>
        <Button title={t('agree')} onPress={agree} />
        <Button title={t('notNow')} variant="quiet" onPress={() => router.back()} />
      </ScreenFooter>
    </View>
  )
}
