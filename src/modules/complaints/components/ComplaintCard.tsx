import { Card, CardContent, Typography, Box, Chip, Stack } from '@mui/material'
import { User, MapPin, Calendar } from 'lucide-react'
import { lightPalette } from '../../../theme'
import type { Complaint } from '../types'

interface ComplaintCardProps {
  complaint: Complaint
}

const statusConfig = {
  Pending: {
    label: 'Pending',
    color: lightPalette.statusPending,
    backgroundColor: `${lightPalette.statusPending}33`, // 20% opacity
  },
  'In Progress': {
    label: 'In Progress',
    color: lightPalette.statusProgress,
    backgroundColor: `${lightPalette.statusProgress}33`,
  },
  Resolved: {
    label: 'Resolved',
    color: lightPalette.statusResolved,
    backgroundColor: `${lightPalette.statusResolved}33`,
  },
}

const priorityConfig = {
  Low: {
    label: 'Low',
    color: lightPalette.mutedForeground,
    backgroundColor: lightPalette.muted,
  },
  Medium: {
    label: 'Medium',
    color: lightPalette.accent,
    backgroundColor: `${lightPalette.accent}33`,
  },
  High: {
    label: 'High',
    color: lightPalette.destructive,
    backgroundColor: `${lightPalette.destructive}33`,
  },
}

export default function ComplaintCard({ complaint }: ComplaintCardProps) {
  const status = statusConfig[complaint.status]
  const priority = priorityConfig[complaint.priority]

  return (
    <Card
      sx={{
        transition: 'all 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
        },
      }}
    >
      <CardContent sx={{ p: 1.5 }}>
        {/* Header with ID and Tags */}
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
            {complaint.id}
          </Typography>

          <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <Chip
              label={complaint.category}
              size="small"
              sx={{
                height: 20,
                fontSize: '0.75rem',
                fontWeight: 500,
                backgroundColor: lightPalette.muted,
                color: lightPalette.mutedForeground,
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
            <Chip
              label={priority.label}
              size="small"
              sx={{
                height: 20,
                fontSize: '0.75rem',
                fontWeight: 500,
                backgroundColor: priority.backgroundColor,
                color: priority.color,
              }}
            />
          </Stack>
        </Box>

        {/* Title */}
        <Typography
          variant="h3"
          component="h3"
          sx={{
            fontSize: '1.125rem',
            fontWeight: 600,
            mb: 0.75,
            lineHeight: 1.4,
          }}
        >
          {complaint.title}
        </Typography>

        {/* Description */}
        <Typography
          variant="body1"
          sx={{
            fontSize: '0.9375rem',
            color: 'text.secondary',
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
            <User size={16} style={{ color: lightPalette.mutedForeground, flexShrink: 0 }} />
            <Typography variant="body2" sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
              {complaint.reporter}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <MapPin size={16} style={{ color: lightPalette.mutedForeground, flexShrink: 0 }} />
            <Typography variant="body2" sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
              {complaint.location}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Calendar size={16} style={{ color: lightPalette.mutedForeground, flexShrink: 0 }} />
            <Typography variant="body2" sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
              {complaint.date}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

