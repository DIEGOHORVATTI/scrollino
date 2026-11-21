import { useColorScheme } from 'react-native'

const palette = {
  dark: { background: '#14110d', text: '#fdf8f0', muted: '#7d7365', accent: '#f59e0b' },
  light: { background: '#faf6ef', text: '#1c1712', muted: '#948a7d', accent: '#b45309' },
}

export function useThemeColors() {
  return palette[useColorScheme() === 'light' ? 'light' : 'dark']
}
