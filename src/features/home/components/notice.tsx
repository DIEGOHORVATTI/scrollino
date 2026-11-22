import { Pressable, Text, View } from 'react-native'

type NoticeProps = {
  text: string
  action: string
  onPress: () => void
}

export function Notice({ text, action, onPress }: NoticeProps) {
  return (
    <View className="flex-row items-center gap-4 rounded-2xl bg-marker px-5 py-4">
      <Text className="flex-1 text-[15px] leading-5 text-on-marker">{text}</Text>
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        className="rounded-full bg-ink px-4 py-2 active:opacity-80"
      >
        <Text className="text-sm font-semibold text-paper">{action}</Text>
      </Pressable>
    </View>
  )
}
