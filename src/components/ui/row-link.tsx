import { ChevronRight } from 'lucide-react-native'
import { Pressable, Text } from 'react-native'

import { useThemeColors } from '@/src/theme/colors'

type RowLinkProps = {
  label: string
  value: string
  onPress: () => void
}

export function RowLink({ label, value, onPress }: RowLinkProps) {
  const colors = useThemeColors()

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className="flex-row items-center gap-3 border-t border-rule py-4 active:opacity-60"
    >
      <Text className="text-base text-pencil">{label}</Text>
      <Text className="flex-1 text-right text-base font-semibold text-ink" numberOfLines={1}>
        {value}
      </Text>
      <ChevronRight size={18} color={colors.faint} />
    </Pressable>
  )
}
