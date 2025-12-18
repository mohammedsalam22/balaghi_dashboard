import { Box, Chip, Paper, Typography } from '@mui/material'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { Complaint, ComplaintStatus } from '../types'
import { statusOptions, useStatusConfig } from '../utils/complaintUtils'
import { useLanguage } from '../../../shared/contexts/LanguageContext'

interface ComplaintsSummaryProps {
  totalComplaints: Complaint[]
  visibleComplaints: Complaint[]
  isFiltered: boolean
}

export default function ComplaintsSummary({ totalComplaints, visibleComplaints, isFiltered }: ComplaintsSummaryProps) {
  const { t, i18n } = useTranslation('complaints')
  const { direction } = useLanguage()
  const statusConfig = useStatusConfig()
  const locale = i18n.language === 'ar' ? 'ar-SA' : 'en-US'

  const counts = useMemo(() => {
    const map: Record<ComplaintStatus, number> = {
      Pending: 0,
      UnderReview: 0,
      InProgress: 0,
      Resolved: 0,
      Rejected: 0,
    }

    for (const c of totalComplaints) {
      map[c.status] = (map[c.status] ?? 0) + 1
    }

    return map
  }, [totalComplaints])

  const totalText = t('summary.total', { value: totalComplaints.length.toLocaleString(locale) })
  const showingText = t('summary.showing', { value: visibleComplaints.length.toLocaleString(locale) })

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: '0.5rem',
        border: '1px solid',
        borderColor: 'divider',
        p: 1.25,
        mb: 2,
        direction,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1.5,
          flexWrap: 'wrap',
          // Let `direction` control start/end so RTL swaps sides correctly.
          flexDirection: 'row',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, flexWrap: 'wrap' }}>
          <Typography variant="body2" sx={{ fontWeight: 800 }}>
            {t('summary.title')}
          </Typography>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'baseline',
              gap: 1,
              flexWrap: 'wrap',
              flexDirection: 'row',
            }}
          >
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {totalText}
            </Typography>
            {isFiltered && (
              <>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  •
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {showingText}
                </Typography>
              </>
            )}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap', flexDirection: 'row' }}>
          {statusOptions.map((status) => (
            <Chip
              key={status}
              label={
                <Box
                  component="span"
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 0.5,
                    flexDirection: 'row',
                  }}
                >
                  <span>{statusConfig[status]?.label ?? status}</span>
                  <span>{(counts[status] ?? 0).toLocaleString(locale)}</span>
                </Box>
              }
              size="small"
              sx={{
                height: 22,
                fontSize: '0.75rem',
                fontWeight: 700,
                backgroundColor: statusConfig[status]?.backgroundColor,
                color: statusConfig[status]?.color,
              }}
            />
          ))}
        </Box>
      </Box>
    </Paper>
  )
}
