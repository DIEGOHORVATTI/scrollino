import Constants from 'expo-constants'
import { Linking, Pressable, ScrollView, Text, View } from 'react-native'

import { Card } from '@/src/components/ui/card'
import { LanguageField, ThemeField } from '@/src/features/preferences/components/preference-fields'
import { t } from '@/src/i18n'

const PRIVACY_URL = 'https://github.com/DIEGOHORVATTI/scrollino/blob/main/PRIVACY.md'
const SOURCE_URL = 'https://github.com/DIEGOHORVATTI/scrollino'

export default function SettingsScreen() {
  return (
    <ScrollView className="flex-1 bg-bg-primary" contentContainerClassName="gap-4 p-4 pb-12">
      <Card title={t('appearance')}>
        <LanguageField />
        <ThemeField />
      </Card>
      <Card title={t('about')}>
        <View className="flex-row justify-between">
          <Text className="text-sm text-text-secondary">{t('version')}</Text>
          <Text className="text-sm text-text-primary">{Constants.expoConfig?.version}</Text>
        </View>
        <Pressable onPress={() => Linking.openURL(PRIVACY_URL)}>
          <Text className="text-sm font-semibold text-primary">{t('privacy')}</Text>
        </Pressable>
        <Pressable onPress={() => Linking.openURL(SOURCE_URL)}>
          <Text className="text-sm leading-5 text-text-secondary">{t('license')}</Text>
        </Pressable>
        <Text className="text-xs leading-5 text-text-muted">{t('credits')}</Text>
      </Card>
    </ScrollView>
  )
}
