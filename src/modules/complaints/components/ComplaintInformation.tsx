import { Box, Typography, Stack } from '@mui/material'
import { User, Building2, Calendar, Tag } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { usePalette } from '../../../shared/hooks/usePalette'
import type { Complaint } from '../types'
import { formatDate } from '../utils/complaintUtils'

interface ComplaintInformationProps {
  complaint: Complaint
}

export default function ComplaintInformation({ complaint }: ComplaintInformationProps) {
  const { t, i18n } = useTranslation('complaints')
  const palette = usePalette()
  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="body2" sx={{ fontSize: '0.875rem', fontWeight: 600, mb: 2, color: 'text.secondary' }}>
        {t('details.complaintInformation')}
      </Typography>
      <Stack spacing={2}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Tag size={18} style={{ color: palette.mutedForeground, flexShrink: 0 }} />
          <Box>
            <Typography variant="body2" sx={{ fontSize: '0.75rem', color: 'text.secondary', mb: 0.25 }}>
              {t('details.complaintType')}
            </Typography>
            <Typography variant="body1" sx={{ fontSize: '0.9375rem', fontWeight: 500 }}>
              {complaint.complaintType}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <User size={18} style={{ color: palette.mutedForeground, flexShrink: 0 }} />
          <Box>
            <Typography variant="body2" sx={{ fontSize: '0.75rem', color: 'text.secondary', mb: 0.25 }}>
              {t('details.citizenName')}
            </Typography>
            <Typography variant="body1" sx={{ fontSize: '0.9375rem', fontWeight: 500 }}>
              {complaint.citizenName}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Building2 size={18} style={{ color: palette.mutedForeground, flexShrink: 0 }} />
          <Box>
            <Typography variant="body2" sx={{ fontSize: '0.75rem', color: 'text.secondary', mb: 0.25 }}>
              {t('details.agency')}
            </Typography>
            <Typography variant="body1" sx={{ fontSize: '0.9375rem', fontWeight: 500 }}>
              {complaint.agencyName}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Calendar size={18} style={{ color: palette.mutedForeground, flexShrink: 0 }} />
          <Box>
            <Typography variant="body2" sx={{ fontSize: '0.75rem', color: 'text.secondary', mb: 0.25 }}>
              {t('details.createdAt')}
            </Typography>
            <Typography variant="body1" sx={{ fontSize: '0.9375rem', fontWeight: 500 }}>
              {formatDate(complaint.createdAt, i18n.language === 'ar' ? 'ar-SA' : 'en-US')}
            </Typography>
          </Box>
        </Box>
      </Stack>
    </Box>
  )
}
