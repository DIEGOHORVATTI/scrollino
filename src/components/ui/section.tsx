import type { ReactNode } from 'react'

import { Text, View } from 'react-native'

type SectionProps = {
  title: string
  children: ReactNode
}

export function Section({ title, children }: SectionProps) {
  return (
    <View className="gap-4 border-t border-rule pt-5">
      <Text className="font-serif-bold text-xl text-ink">{title}</Text>
      {children}
    </View>
  )
}
