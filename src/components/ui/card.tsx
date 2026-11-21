import type { ReactNode } from 'react'

import { Text, View } from 'react-native'

type CardProps = {
  title?: string
  children: ReactNode
}

export function Card({ title, children }: CardProps) {
  return (
    <View className="gap-4 rounded-2xl border border-border bg-bg-card p-4">
      {title ? (
        <Text className="text-xs font-semibold uppercase tracking-widest text-text-muted">
          {title}
        </Text>
      ) : null}
      {children}
    </View>
  )
}
