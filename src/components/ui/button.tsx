import { Pressable, Text, type PressableProps } from 'react-native'

type ButtonVariant = 'ink' | 'marker' | 'quiet'

type ButtonProps = PressableProps & {
  title: string
  variant?: ButtonVariant
}

const surface: Record<ButtonVariant, string> = {
  ink: 'bg-ink',
  marker: 'bg-marker',
  quiet: 'bg-transparent',
}

const label: Record<ButtonVariant, string> = {
  ink: 'text-paper',
  marker: 'text-on-marker',
  quiet: 'text-pencil',
}

export function Button({ title, variant = 'ink', ...props }: ButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      className={`h-14 items-center justify-center rounded-full px-6 active:opacity-80 ${surface[variant]}`}
      {...props}
    >
      <Text className={`text-base font-semibold ${label[variant]}`}>{title}</Text>
    </Pressable>
  )
}
