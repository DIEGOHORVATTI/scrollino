import { Pressable, Text, type PressableProps } from 'react-native'

type ButtonVariant = 'primary' | 'danger' | 'ghost'

type ButtonProps = PressableProps & {
  title: string
  variant?: ButtonVariant
}

const variantClass: Record<ButtonVariant, string> = {
  primary: 'bg-button',
  danger: 'bg-danger',
  ghost: 'bg-transparent',
}

const textClass: Record<ButtonVariant, string> = {
  primary: 'text-on-accent',
  danger: 'text-on-accent',
  ghost: 'text-text-secondary',
}

export function Button({ title, variant = 'primary', ...props }: ButtonProps) {
  return (
    <Pressable
      className={`h-14 items-center justify-center rounded-xl active:opacity-70 ${variantClass[variant]}`}
      {...props}
    >
      <Text className={`text-base font-semibold ${textClass[variant]}`}>{title}</Text>
    </Pressable>
  )
}
