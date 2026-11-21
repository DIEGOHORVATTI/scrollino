import { useCallback } from 'react'
import { useFocusEffect } from 'expo-router'
import { ScrollView, Text } from 'react-native'

import { ScrollEngine } from '@/modules/scroll-engine'
import { Button } from '@/src/components/ui/button'
import { ScreenFooter } from '@/src/components/ui/screen-footer'
import { useToggleScroll } from '@/src/features/engine/use-toggle-scroll'
import { t } from '@/src/i18n'

const REPEAT = 4

export default function PreviewScreen() {
  const { engine, toggle } = useToggleScroll()
  const paragraphs = Array.from({ length: REPEAT }, () => t('previewBody').split('\n\n')).flat()

  useFocusEffect(
    useCallback(() => {
      ScrollEngine.setPreviewMode(true)
      return () => {
        ScrollEngine.setPreviewMode(false)
        ScrollEngine.stop()
      }
    }, []),
  )

  return (
    <>
      <ScrollView className="flex-1 bg-bg-primary" contentContainerClassName="gap-5 px-6 py-6">
        <Text className="text-2xl font-black text-text-primary">{t('previewTitle')}</Text>
        {paragraphs.map((paragraph, index) => (
          <Text key={index} className="text-lg leading-8 text-text-primary">
            {paragraph}
          </Text>
        ))}
      </ScrollView>
      <ScreenFooter>
        <Button
          title={engine.running ? t('pause') : t('start')}
          variant={engine.running ? 'danger' : 'primary'}
          onPress={toggle}
        />
      </ScreenFooter>
    </>
  )
}
