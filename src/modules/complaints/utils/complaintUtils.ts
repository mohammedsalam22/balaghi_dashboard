import type { ComplaintStatus } from '../types'
import { useTranslation } from 'react-i18next'
import { usePalette } from '../../../shared/hooks/usePalette'

// Hook to get status config based on current theme
export function useStatusConfig() {
  const { t } = useTranslation('complaints')
  const palette = usePalette()
  return {
    Pending: {
      label: t('status.pending'),
      color: palette.statusPending,
      backgroundColor: `${palette.statusPending}33`,
    },
    UnderReview: {
      label: t('status.underReview'),
      color: palette.statusProgress || palette.accent,
      backgroundColor: `${palette.statusProgress || palette.accent}33`,
    },
    InProgress: {
      label: t('status.inProgress'),
      color: palette.statusProgress,
      backgroundColor: `${palette.statusProgress}33`,
    },
    Resolved: {
      label: t('status.resolved'),
      color: palette.statusResolved,
      backgroundColor: `${palette.statusResolved}33`,
    },
    Rejected: {
      label: t('status.rejected'),
      color: palette.destructive,
      backgroundColor: `${palette.destructive}33`,
    },
  } as const
}

// Static config for backward compatibility (light mode)
import { lightPalette } from '../../../theme'
export const statusConfig = {
  Pending: {
    label: 'Pending',
    color: lightPalette.statusPending,
    backgroundColor: `${lightPalette.statusPending}33`,
  },
  UnderReview: {
    label: 'Under Review',
    color: lightPalette.statusProgress || lightPalette.accent,
    backgroundColor: `${lightPalette.statusProgress || lightPalette.accent}33`,
  },
  InProgress: {
    label: 'In Progress',
    color: lightPalette.statusProgress,
    backgroundColor: `${lightPalette.statusProgress}33`,
  },
  Resolved: {
    label: 'Resolved',
    color: lightPalette.statusResolved,
    backgroundColor: `${lightPalette.statusResolved}33`,
  },
  Rejected: {
    label: 'Rejected',
    color: lightPalette.destructive,
    backgroundColor: `${lightPalette.destructive}33`,
  },
} as const

export const statusOptions: ComplaintStatus[] = ['Pending', 'UnderReview', 'InProgress', 'Resolved', 'Rejected']

export const formatDate = (dateString: string, locale: string = 'en-US'): string => {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return dateString
  }
}

export const formatDateShort = (dateString: string, locale: string = 'en-US'): string => {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return dateString
  }
}

export const isImageFile = (contentType: string): boolean => {
  return contentType.startsWith('image/')
}
