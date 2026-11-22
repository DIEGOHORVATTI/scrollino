import Constants from 'expo-constants'
import { useRouter } from 'expo-router'
import { Linking, Pressable, ScrollView, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { ScrollEngine } from '@/modules/scroll-engine'
import { RowLink } from '@/src/components/ui/row-link'
import { Section } from '@/src/components/ui/section'
import { Serif } from '@/src/components/ui/serif'
import { useEnableService } from '@/src/features/engine/use-enable-service'
import { useSetupOnLaunch } from '@/src/features/engine/use-setup-on-launch'
import { Notice } from '@/src/features/home/components/notice'
import { SpeedControl } from '@/src/features/home/components/speed-control'
import { LanguageField, ThemeField } from '@/src/features/preferences/components/preference-fields'
import { useEngineState } from '@/src/hooks/use-engine-state'
import { t, tn } from '@/src/i18n'
import { useSettings } from '@/src/stores/settings-store'

const PRIVACY_URL = 'https://github.com/DIEGOHORVATTI/scrollino/blob/main/PRIVACY.md'

export default function HomeScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const engine = useEngineState()
  const enableService = useEnableService()
  const allowedCount = useSettings((state) => state.allowedPackages.length)
  useSetupOnLaunch(engine)

  return (
    <ScrollView
      className="flex-1 bg-paper"
      contentContainerStyle={{
        gap: 28,
        paddingHorizontal: 24,
        paddingTop: insets.top + 16,
        paddingBottom: insets.bottom + 32,
      }}
    >
      <Serif weight="bold" className="text-[30px] text-ink">
        Scrollino
      </Serif>
      {engine.ready && engine.serviceStuck ? (
        <Notice
          text={t('serviceStuckNotice')}
          action={t('serviceTurnOn')}
          onPress={() => ScrollEngine.openAccessibilitySettings()}
        />
      ) : null}
      {engine.ready && !engine.serviceEnabled && !engine.serviceStuck ? (
        <Notice text={t('serviceOffNotice')} action={t('serviceTurnOn')} onPress={enableService} />
      ) : null}
      {engine.ready && engine.serviceEnabled && !engine.notificationsEnabled ? (
        <Notice
          text={t('notificationsOffNotice')}
          action={t('notificationsTurnOn')}
          onPress={() => ScrollEngine.openNotificationSettings()}
        />
      ) : null}
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
      <Section title={t('appearance')}>
        <LanguageField />
        <ThemeField />
      </Section>
      <Section title={t('about')}>
        <View className="flex-row justify-between">
          <Text className="text-base text-pencil">{t('version')}</Text>
          <Text className="text-base text-ink">{Constants.expoConfig?.version}</Text>
        </View>
        <Pressable accessibilityRole="link" onPress={() => Linking.openURL(PRIVACY_URL)}>
          <Text className="text-base text-ink underline">{t('privacy')}</Text>
        </Pressable>
      </Section>
    </ScrollView>
  )
}
