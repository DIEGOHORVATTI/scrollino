import { useState } from 'react'
import Slider from '@react-native-community/slider'
import { Pressable, Text, View } from 'react-native'

import { ScrollEngine } from '@/modules/scroll-engine'
import { Card } from '@/src/components/ui/card'
import { t, tn } from '@/src/i18n'
import { PRESETS, progressToSecs, screensPerMinute, secsToProgress } from '@/src/lib/speed'
import { useThemeColors } from '@/src/theme/colors'

type SpeedCardProps = {
  secs: number
}

export function SpeedCard({ secs }: SpeedCardProps) {
  const colors = useThemeColors()
  const [dragging, setDragging] = useState<number | null>(null)
  const shown = dragging ?? secs

  function commit(value: number) {
    setDragging(null)
    ScrollEngine.setSecondsPerScreen(value)
  }

  return (
    <Card title={t('speed')}>
      <View className="flex-row items-end justify-between">
        <View className="flex-row items-baseline gap-1">
          <Text className="text-5xl font-black text-text-primary">{shown}</Text>
          <Text className="text-base text-text-secondary">{t('secondsPerScreen')}</Text>
        </View>
        <Text className="pb-2 text-sm text-text-muted">
          {tn('screensPerMinute', screensPerMinute(shown))}
        </Text>
      </View>
      <Slider
        value={secsToProgress(secs)}
        minimumValue={0}
        maximumValue={1}
        inverted
        minimumTrackTintColor={colors.accent}
        thumbTintColor={colors.accent}
        onValueChange={(progress) => setDragging(progressToSecs(progress))}
        onSlidingComplete={(progress) => commit(progressToSecs(progress))}
        accessibilityLabel={t('speed')}
      />
      <View className="flex-row gap-2">
        {PRESETS.map(({ key, secs: preset }) => {
          const selected = shown === preset
          return (
            <Pressable
              key={key}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              onPress={() => commit(preset)}
              className={`flex-1 items-center rounded-xl border py-2.5 active:opacity-70 ${
                selected ? 'border-primary bg-primary/15' : 'border-border'
              }`}
            >
              <Text className="text-sm font-semibold text-text-primary">{t(key)}</Text>
              <Text className="text-xs text-text-muted">{preset} s</Text>
            </Pressable>
          )
        })}
      </View>
    </Card>
  )
}
