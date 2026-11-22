import Constants from 'expo-constants'
import { Linking, Pressable, ScrollView, Text, View } from 'react-native'

import { Section } from '@/src/components/ui/section'
import { LanguageField, ThemeField } from '@/src/features/preferences/components/preference-fields'
import { t } from '@/src/i18n'

const PRIVACY_URL = 'https://github.com/DIEGOHORVATTI/scrollino/blob/main/PRIVACY.md'
const SOURCE_URL = 'https://github.com/DIEGOHORVATTI/scrollino'

export default function SettingsScreen() {
  return (
    <ScrollView className="flex-1 bg-paper" contentContainerClassName="gap-8 px-6 pb-12 pt-2">
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
        <Pressable accessibilityRole="link" onPress={() => Linking.openURL(SOURCE_URL)}>
          <Text className="text-base text-ink underline">{t('license')}</Text>
        </Pressable>
      </Section>
    </ScrollView>
  )
}
