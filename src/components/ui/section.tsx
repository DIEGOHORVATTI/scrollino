import { Serif } from '@/src/components/ui/serif'
import type { ReactNode } from 'react'

import { View } from 'react-native'

type SectionProps = {
  title: string
  children: ReactNode
}

export function Section({ title, children }: SectionProps) {
  return (
    <View className="gap-4 border-t border-rule pt-5">
      <Serif weight="bold" className="text-xl text-ink">
        {title}
      </Serif>
      {children}
    </View>
  )
}
