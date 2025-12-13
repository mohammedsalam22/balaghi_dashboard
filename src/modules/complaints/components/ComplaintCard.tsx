import { useState } from 'react'
import { Card, CardContent, Typography, Box, Chip, Stack } from '@mui/material'
import { User, Building2, Calendar, Paperclip } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { usePalette } from '../../../shared/hooks/usePalette'
import type { Complaint } from '../types'
import ComplaintDetailsDialog from './ComplaintDetailsDialog'
import { useStatusConfig, formatDateShort } from '../utils/complaintUtils'

interface ComplaintCardProps {
  complaint: Complaint
  onStatusUpdate?: () => void
}


export default function ComplaintCard({ complaint, onStatusUpdate }: ComplaintCardProps) {
  const { t, i18n } = useTranslation('complaints')
  const palette = usePalette()
  const statusConfig = useStatusConfig()
  const [dialogOpen, setDialogOpen] = useState(false)
  const status = statusConfig[complaint.status]

  const handleCardClick = () => {
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
  }

  return (
    <>
    <Card
        onClick={handleCardClick}
      sx={{
        transition: 'all 0.2s',
          cursor: 'pointer',
        '&:hover': {
          transform: 'translateY(-2px)',
            boxShadow: 4,
        },
      }}
    >
      <CardContent sx={{ p: 1.5 }}>
        {/* Header with Tracking Number and Tags */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            mb: 1,
            gap: 1,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'text.secondary',
              fontFamily: 'monospace',
              whiteSpace: 'nowrap',
            }}
          >
            {complaint.trackingNumber}
          </Typography>

          <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <Chip
              label={complaint.complaintType}
              size="small"
              sx={{
                height: 20,
                fontSize: '0.75rem',
                fontWeight: 500,
                backgroundColor: palette.muted,
                color: palette.mutedForeground,
              }}
            />
            <Chip
              label={status.label}
              size="small"
              sx={{
                height: 20,
                fontSize: '0.75rem',
                fontWeight: 500,
                backgroundColor: status.backgroundColor,
                color: status.color,
              }}
            />
          </Stack>
        </Box>

        {/* Description */}
        <Typography
          variant="body1"
          sx={{
            fontSize: '0.9375rem',
            color: 'text.primary',
            mb: 1.25,
            lineHeight: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {complaint.description}
        </Typography>

        {/* Attachments Indicator */}
        {complaint.attachments && complaint.attachments.length > 0 && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.25 }}>
            <Paperclip size={14} style={{ color: palette.mutedForeground }} />
            <Typography variant="body2" sx={{ fontSize: '0.75rem', color: 'text.secondary', fontWeight: 500 }}>
              {complaint.attachmentsCount} {complaint.attachmentsCount === 1 ? t('card.attachments') : t('card.attachmentsPlural')}
            </Typography>
          </Box>
        )}

        {/* Footer with Info */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 0.75,
            pt: 1,
            borderTop: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <User size={16} style={{ color: palette.mutedForeground, flexShrink: 0 }} />
            <Typography variant="body2" sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
              {complaint.citizenName}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Building2 size={16} style={{ color: palette.mutedForeground, flexShrink: 0 }} />
            <Typography variant="body2" sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
              {complaint.agencyName}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Calendar size={16} style={{ color: palette.mutedForeground, flexShrink: 0 }} />
            <Typography variant="body2" sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
              {formatDateShort(complaint.createdAt, i18n.language === 'ar' ? 'ar-SA' : 'en-US')}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>

    <ComplaintDetailsDialog
      open={dialogOpen}
      onClose={handleCloseDialog}
      complaint={complaint}
      onStatusUpdate={onStatusUpdate}
    />
    </>
  )
}

