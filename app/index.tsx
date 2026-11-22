import { useRouter } from 'expo-router'
import { Settings } from 'lucide-react-native'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Button } from '@/src/components/ui/button'
import { RowLink } from '@/src/components/ui/row-link'
import { ScreenFooter } from '@/src/components/ui/screen-footer'
import { useToggleScroll } from '@/src/features/engine/use-toggle-scroll'
import { ServiceNotice } from '@/src/features/home/components/service-notice'
import { SpeedControl } from '@/src/features/home/components/speed-control'
import { Serif } from '@/src/components/ui/serif'
import { t, tn } from '@/src/i18n'
import { useSettings } from '@/src/stores/settings-store'
import { useThemeColors } from '@/src/theme/colors'

export default function HomeScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const colors = useThemeColors()
  const { engine, toggle } = useToggleScroll()
  const allowedCount = useSettings((state) => state.allowedPackages.length)

  return (
    <View className="flex-1 bg-paper" style={{ paddingTop: insets.top }}>
      <ScrollView contentContainerClassName="gap-7 px-6 pb-8 pt-4">
        <View className="flex-row items-center justify-between">
          <Serif weight="bold" className="text-[30px] text-ink">
            Scrollino
          </Serif>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('settings')}
            onPress={() => router.push('/settings')}
            className="-mr-2 h-11 w-11 items-center justify-center rounded-full active:opacity-60"
          >
            <Settings size={22} color={colors.pencil} />
          </Pressable>
        </View>
        {engine.serviceEnabled ? null : <ServiceNotice />}
        <SpeedControl secs={engine.secondsPerScreen} />
        <View>
          <RowLink
            label={t('scrollsIn')}
            value={allowedCount ? tn('appsSome', allowedCount) : t('appsAll')}
            onPress={() => router.push('/apps')}
          />
          <View className="border-t border-rule" />
        </View>
        <Text className="text-[15px] leading-6 text-pencil">{t('controlsHint')}</Text>
      </ScrollView>
      <ScreenFooter>
        <Button
          title={engine.running ? t('pause') : t('start')}
          variant={engine.running ? 'marker' : 'ink'}
          onPress={toggle}
        />
        <Button title={t('tryPreview')} variant="quiet" onPress={() => router.push('/preview')} />
      </ScreenFooter>
    </View>
  )
}
