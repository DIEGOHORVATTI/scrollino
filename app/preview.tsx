import { useCallback } from 'react'
import { useFocusEffect } from 'expo-router'
import { ScrollView } from 'react-native'

import { ScrollEngine } from '@/modules/scroll-engine'
import { Button } from '@/src/components/ui/button'
import { ScreenFooter } from '@/src/components/ui/screen-footer'
import { useToggleScroll } from '@/src/features/engine/use-toggle-scroll'
import { Serif } from '@/src/components/ui/serif'
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
      <ScrollView className="flex-1 bg-paper" contentContainerClassName="gap-5 px-6 py-6">
        <Serif weight="bold" className="text-[26px] leading-9 text-ink">
          {t('previewTitle')}
        </Serif>
        {paragraphs.map((paragraph, index) => (
          <Serif key={index} className="text-[18px] leading-8 text-ink">
            {paragraph}
          </Serif>
        ))}
      </ScrollView>
      <ScreenFooter>
        <Button
          title={engine.running ? t('pause') : t('start')}
          variant={engine.running ? 'marker' : 'ink'}
          onPress={toggle}
        />
      </ScreenFooter>
    </>
  )
}
