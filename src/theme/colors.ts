import { useColorScheme } from 'react-native'

const palette = {
  dark: {
    paper: '#12171e',
    paperDeep: '#1a212b',
    ink: '#e6e8e3',
    pencil: '#98a0aa',
    faint: '#5f6873',
    rule: '#2a323d',
    marker: '#c9d15a',
    onMarker: '#12171e',
  },
  light: {
    paper: '#eef0eb',
    paperDeep: '#e3e6df',
    ink: '#1b2430',
    pencil: '#5d6672',
    faint: '#9aa19a',
    rule: '#d3d8cf',
    marker: '#e4ec5c',
    onMarker: '#1b2430',
  },
}

export type ThemeColors = (typeof palette)['light']

export function useThemeColors(): ThemeColors {
  return palette[useColorScheme() === 'light' ? 'light' : 'dark']
}
