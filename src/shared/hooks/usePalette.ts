import { useTheme } from '../contexts/ThemeContext'
import { lightPalette, darkPalette } from '../contexts/ThemeContext'

/**
 * Hook to get the current palette based on theme mode
 */
export function usePalette() {
  const { mode } = useTheme()
  return mode === 'light' ? lightPalette : darkPalette
}
