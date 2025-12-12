import { createTheme } from '@mui/material/styles'

// HSL to RGB conversion helper
function hslToRgb(h: number, s: number, l: number): string {
  s /= 100
  l /= 100
  const k = (n: number) => (n + h / 30) % 12
  const a = s * Math.min(l, 1 - l)
  const f = (n: number) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
  const r = Math.round(255 * f(0))
  const g = Math.round(255 * f(8))
  const b = Math.round(255 * f(4))
  return `rgb(${r}, ${g}, ${b})`
}

// Light mode colors (HSL)
const lightColors = {
  background: { h: 210, s: 20, l: 98 },
  foreground: { h: 215, s: 25, l: 15 },
  primary: { h: 214, s: 85, l: 45 },
  primaryForeground: { h: 0, s: 0, l: 100 },
  secondary: { h: 210, s: 15, l: 92 },
  accent: { h: 214, s: 75, l: 55 },
  card: { h: 0, s: 0, l: 100 },
  border: { h: 215, s: 16, l: 84 },
  muted: { h: 210, s: 15, l: 92 },
  mutedForeground: { h: 215, s: 16, l: 47 },
  // Status colors
  statusPending: { h: 38, s: 92, l: 50 },
  statusPendingForeground: { h: 26, s: 90, l: 20 },
  statusProgress: { h: 214, s: 85, l: 45 },
  statusResolved: { h: 142, s: 71, l: 45 },
  statusResolvedForeground: { h: 0, s: 0, l: 100 },
  // Priority colors
  destructive: { h: 0, s: 84, l: 60 },
  destructiveForeground: { h: 0, s: 0, l: 100 },
}

// Dark mode colors (HSL)
const darkColors = {
  background: { h: 215, s: 30, l: 8 },
  foreground: { h: 210, s: 20, l: 95 },
  primary: { h: 214, s: 85, l: 55 },
  primaryForeground: { h: 0, s: 0, l: 100 },
  secondary: { h: 215, s: 20, l: 18 },
  accent: { h: 214, s: 75, l: 55 },
  card: { h: 215, s: 20, l: 15 },
  border: { h: 215, s: 20, l: 27 },
  muted: { h: 215, s: 20, l: 18 },
  mutedForeground: { h: 215, s: 12, l: 64 },
  // Status colors
  statusPending: { h: 38, s: 92, l: 50 },
  statusPendingForeground: { h: 0, s: 0, l: 100 },
  statusProgress: { h: 214, s: 85, l: 55 },
  statusResolved: { h: 142, s: 71, l: 45 },
  statusResolvedForeground: { h: 0, s: 0, l: 100 },
  // Priority colors
  destructive: { h: 0, s: 84, l: 60 },
  destructiveForeground: { h: 0, s: 0, l: 100 },
}

function createColorPalette(colors: typeof lightColors) {
  return {
    background: hslToRgb(colors.background.h, colors.background.s, colors.background.l),
    foreground: hslToRgb(colors.foreground.h, colors.foreground.s, colors.foreground.l),
    primary: hslToRgb(colors.primary.h, colors.primary.s, colors.primary.l),
    primaryForeground: hslToRgb(colors.primaryForeground.h, colors.primaryForeground.s, colors.primaryForeground.l),
    secondary: hslToRgb(colors.secondary.h, colors.secondary.s, colors.secondary.l),
    accent: hslToRgb(colors.accent.h, colors.accent.s, colors.accent.l),
    card: hslToRgb(colors.card.h, colors.card.s, colors.card.l),
    border: hslToRgb(colors.border.h, colors.border.s, colors.border.l),
    muted: hslToRgb(colors.muted.h, colors.muted.s, colors.muted.l),
    mutedForeground: hslToRgb(colors.mutedForeground.h, colors.mutedForeground.s, colors.mutedForeground.l),
    statusPending: hslToRgb(colors.statusPending.h, colors.statusPending.s, colors.statusPending.l),
    statusPendingForeground: hslToRgb(colors.statusPendingForeground.h, colors.statusPendingForeground.s, colors.statusPendingForeground.l),
    statusProgress: hslToRgb(colors.statusProgress.h, colors.statusProgress.s, colors.statusProgress.l),
    statusResolved: hslToRgb(colors.statusResolved.h, colors.statusResolved.s, colors.statusResolved.l),
    statusResolvedForeground: hslToRgb(colors.statusResolvedForeground.h, colors.statusResolvedForeground.s, colors.statusResolvedForeground.l),
    destructive: hslToRgb(colors.destructive.h, colors.destructive.s, colors.destructive.l),
    destructiveForeground: hslToRgb(colors.destructiveForeground.h, colors.destructiveForeground.s, colors.destructiveForeground.l),
  }
}

const lightPalette = createColorPalette(lightColors)
const darkPalette = createColorPalette(darkColors)

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: lightPalette.primary,
      contrastText: lightPalette.primaryForeground,
    },
    secondary: {
      main: lightPalette.secondary,
      contrastText: lightPalette.foreground,
    },
    background: {
      default: lightPalette.background,
      paper: lightPalette.card,
    },
    text: {
      primary: lightPalette.foreground,
      secondary: lightPalette.mutedForeground,
    },
    error: {
      main: lightPalette.destructive,
      contrastText: lightPalette.destructiveForeground,
    },
  },
  typography: {
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    h1: {
      fontSize: '1.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
    },
    h3: {
      fontSize: '1.125rem',
      fontWeight: 600,
    },
    body1: {
      fontSize: '0.9375rem',
    },
    body2: {
      fontSize: '0.875rem',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: lightPalette.card,
          color: lightPalette.foreground,
          borderBottom: `1px solid ${lightPalette.border}`,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: lightPalette.card,
          borderRight: `1px solid ${lightPalette.border}`,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: lightPalette.card,
          border: `1px solid ${lightPalette.border}`,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '0.375rem',
          '&:hover': {
            backgroundColor: lightPalette.accent,
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: lightPalette.accent,
          },
        },
      },
    },
  },
})

// Export color palettes for component use
export { lightPalette, darkPalette }


