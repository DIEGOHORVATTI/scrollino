import { useState } from 'react'
import Slider from '@react-native-community/slider'
import { Pressable, Text, View } from 'react-native'

import { ScrollEngine } from '@/modules/scroll-engine'
import { Serif } from '@/src/components/ui/serif'
import { t, tn } from '@/src/i18n'
import { PRESETS, progressToSecs, secsToProgress } from '@/src/lib/speed'
import { useThemeColors } from '@/src/theme/colors'

type SpeedControlProps = {
  secs: number
}

export function SpeedControl({ secs }: SpeedControlProps) {
  const colors = useThemeColors()
  const [dragging, setDragging] = useState<number | null>(null)
  const shown = dragging ?? secs

  function commit(value: number) {
    setDragging(null)
    ScrollEngine.setSecondsPerScreen(value)
  }

  return (
    <View className="gap-5">
      <Serif className="text-[26px] leading-9 text-ink">{tn('speedSentence', shown)}</Serif>
      <Slider
        value={secsToProgress(secs)}
        minimumValue={0}
        maximumValue={1}
        inverted
        minimumTrackTintColor={colors.ink}
        maximumTrackTintColor={colors.faint}
        thumbTintColor={colors.ink}
        onValueChange={(progress) => setDragging(progressToSecs(progress))}
        onSlidingComplete={(progress) => commit(progressToSecs(progress))}
        accessibilityLabel={t('speed')}
        style={{ marginHorizontal: -12 }}
      />
      <View className="flex-row gap-1" accessibilityRole="radiogroup">
        {PRESETS.map(({ key, secs: preset }) => {
          const selected = shown === preset
          return (
            <Pressable
              key={key}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              onPress={() => commit(preset)}
              className={`rounded-full px-4 py-2 active:opacity-60 ${selected ? 'bg-marker' : ''}`}
            >
              <Text
                className={`text-[15px] ${selected ? 'font-semibold text-on-marker' : 'text-pencil'}`}
              >
                {t(key)}
              </Text>
            </Pressable>
          )
        })}
      </View>
    </View>
  )
}
