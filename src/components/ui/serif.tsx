import { Text, type TextProps } from 'react-native'

const FAMILY = {
  regular: 'Literata_400Regular',
  bold: 'Literata_600SemiBold',
}

type SerifProps = TextProps & {
  weight?: keyof typeof FAMILY
}

export function Serif({ weight = 'regular', style, ...props }: SerifProps) {
  return <Text style={[{ fontFamily: FAMILY[weight] }, style]} {...props} />
}
