import { useRouter } from 'expo-router'
import { Settings } from 'lucide-react-native'
import { Image, Pressable, ScrollView, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Button } from '@/src/components/ui/button'
import { ScreenFooter } from '@/src/components/ui/screen-footer'
import { useToggleScroll } from '@/src/features/engine/use-toggle-scroll'
import { AppsRow } from '@/src/features/home/components/apps-row'
import { ServiceCard } from '@/src/features/home/components/service-card'
import { SpeedCard } from '@/src/features/home/components/speed-card'
import { t } from '@/src/i18n'
import { useThemeColors } from '@/src/theme/colors'

export default function HomeScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const colors = useThemeColors()
  const { engine, toggle } = useToggleScroll()

  return (
    <View className="flex-1 bg-bg-primary" style={{ paddingTop: insets.top }}>
      <ScrollView contentContainerClassName="gap-4 p-4 pb-8">
        <View className="flex-row items-center gap-3 py-2">
          <Image source={require('@/assets/images/icon.png')} className="h-11 w-11 rounded-xl" />
          <View className="flex-1">
            <Text className="text-3xl font-black tracking-tight text-text-primary">Rolo</Text>
            <Text className="text-sm text-text-secondary">{t('tagline')}</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('settings')}
            onPress={() => router.push('/settings')}
            className="h-11 w-11 items-center justify-center rounded-xl active:opacity-70"
          >
            <Settings size={22} color={colors.text} />
          </Pressable>
        </View>
        <ServiceCard enabled={engine.serviceEnabled} />
        <SpeedCard secs={engine.secondsPerScreen} />
        <AppsRow />
        <Text className="px-1 text-sm leading-5 text-text-muted">{t('tip')}</Text>
      </ScrollView>
      <ScreenFooter>
        <Button
          title={engine.running ? t('pause') : t('start')}
          variant={engine.running ? 'danger' : 'primary'}
          onPress={toggle}
        />
        <Pressable onPress={() => router.push('/preview')} className="items-center py-1">
          <Text className="text-sm font-semibold text-primary">{t('tryPreview')}</Text>
        </Pressable>
      </ScreenFooter>
    </View>
  )
}
