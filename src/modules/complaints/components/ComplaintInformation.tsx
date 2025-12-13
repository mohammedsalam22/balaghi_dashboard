import { Box, Typography, Stack } from '@mui/material'
import { User, Building2, Calendar, Tag } from 'lucide-react'
import { lightPalette } from '../../../theme'
import type { Complaint } from '../types'
import { formatDate } from '../utils/complaintUtils'

interface ComplaintInformationProps {
  complaint: Complaint
}

export default function ComplaintInformation({ complaint }: ComplaintInformationProps) {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="body2" sx={{ fontSize: '0.875rem', fontWeight: 600, mb: 2, color: 'text.secondary' }}>
        Complaint Information
      </Typography>
      <Stack spacing={2}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Tag size={18} style={{ color: lightPalette.mutedForeground, flexShrink: 0 }} />
          <Box>
            <Typography variant="body2" sx={{ fontSize: '0.75rem', color: 'text.secondary', mb: 0.25 }}>
              Complaint Type
            </Typography>
            <Typography variant="body1" sx={{ fontSize: '0.9375rem', fontWeight: 500 }}>
              {complaint.complaintType}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <User size={18} style={{ color: lightPalette.mutedForeground, flexShrink: 0 }} />
          <Box>
            <Typography variant="body2" sx={{ fontSize: '0.75rem', color: 'text.secondary', mb: 0.25 }}>
              Citizen Name
            </Typography>
            <Typography variant="body1" sx={{ fontSize: '0.9375rem', fontWeight: 500 }}>
              {complaint.citizenName}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Building2 size={18} style={{ color: lightPalette.mutedForeground, flexShrink: 0 }} />
          <Box>
            <Typography variant="body2" sx={{ fontSize: '0.75rem', color: 'text.secondary', mb: 0.25 }}>
              Agency
            </Typography>
            <Typography variant="body1" sx={{ fontSize: '0.9375rem', fontWeight: 500 }}>
              {complaint.agencyName}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Calendar size={18} style={{ color: lightPalette.mutedForeground, flexShrink: 0 }} />
          <Box>
            <Typography variant="body2" sx={{ fontSize: '0.75rem', color: 'text.secondary', mb: 0.25 }}>
              Created At
            </Typography>
            <Typography variant="body1" sx={{ fontSize: '0.9375rem', fontWeight: 500 }}>
              {formatDate(complaint.createdAt)}
            </Typography>
          </Box>
        </Box>
      </Stack>
    </Box>
  )
}
