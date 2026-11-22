import { useEffect, useState } from 'react'
import { type LayoutChangeEvent, Text, View } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useFrameCallback,
  useReducedMotion,
  useSharedValue,
} from 'react-native-reanimated'
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg'

import { t } from '@/src/i18n'
import { useThemeColors } from '@/src/theme/colors'

const WINDOW_HEIGHT = 216
const FADE = 56

type ReadingWindowProps = {
  secs: number
}

function Fade({ edge, color }: { edge: 'top' | 'bottom'; color: string }) {
  const id = `fade-${edge}`
  return (
    <Svg
      pointerEvents="none"
      width="100%"
      height={FADE}
      style={{ position: 'absolute', left: 0, right: 0, [edge]: 0 }}
    >
      <Defs>
        <LinearGradient
          id={id}
          x1="0"
          y1={edge === 'top' ? '0' : '1'}
          x2="0"
          y2={edge === 'top' ? '1' : '0'}
        >
          <Stop offset="0" stopColor={color} stopOpacity="1" />
          <Stop offset="1" stopColor={color} stopOpacity="0" />
        </LinearGradient>
      </Defs>
      <Rect width="100%" height={FADE} fill={`url(#${id})`} />
    </Svg>
  )
}

export function ReadingWindow({ secs }: ReadingWindowProps) {
  const colors = useThemeColors()
  const reduceMotion = useReducedMotion()
  const offset = useSharedValue(0)
  const loopHeight = useSharedValue(0)
  const pxPerMs = useSharedValue(0)
  const [paragraphs] = useState(() => t('previewBody').split('\n\n'))

  useEffect(() => {
    pxPerMs.set(WINDOW_HEIGHT / (secs * 1000))
  }, [pxPerMs, secs])

  useFrameCallback(({ timeSincePreviousFrame }) => {
    const loop = loopHeight.get()
    if (reduceMotion || !loop || !timeSincePreviousFrame) return
    const next = offset.get() - timeSincePreviousFrame * pxPerMs.get()
    offset.set(next <= -loop ? next + loop : next)
  })

  const style = useAnimatedStyle(() => ({ transform: [{ translateY: offset.get() }] }))

  function measure(event: LayoutChangeEvent) {
    loopHeight.set(event.nativeEvent.layout.height)
  }

  const copy = (onLayout?: (event: LayoutChangeEvent) => void) => (
    <View onLayout={onLayout} className="gap-4 pb-4">
      {paragraphs.map((paragraph, index) => (
        <Text key={index} className="font-serif text-[17px] leading-7 text-ink">
          {paragraph}
        </Text>
      ))}
    </View>
  )

  return (
    <View
      accessible
      accessibilityLabel={t('previewTitle')}
      className="overflow-hidden rounded-3xl bg-paper-deep px-6"
      style={{ height: WINDOW_HEIGHT }}
    >
      <View
        pointerEvents="none"
        className="absolute left-0 right-0 bg-marker opacity-40"
        style={{ top: WINDOW_HEIGHT / 2 - 16, height: 32 }}
      />
      <Animated.View style={[{ paddingTop: WINDOW_HEIGHT / 2 - 14 }, style]}>
        {copy(measure)}
        {copy()}
      </Animated.View>
      <Fade edge="top" color={colors.paperDeep} />
      <Fade edge="bottom" color={colors.paperDeep} />
    </View>
  )
}
