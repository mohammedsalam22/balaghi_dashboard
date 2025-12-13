import { Box, Typography } from '@mui/material'
import type { Complaint } from '../types'
import ComplaintCard from './ComplaintCard'

interface ComplaintsGridProps {
  complaints: Complaint[]
  onStatusUpdate?: () => void
}

export default function ComplaintsGrid({ complaints, onStatusUpdate }: ComplaintsGridProps) {
  if (complaints.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 200,
          p: 3,
        }}
      >
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          No complaints found
        </Typography>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          lg: 'repeat(3, 1fr)',
        },
        gap: 2,
      }}
    >
      {complaints.map((complaint) => (
        <ComplaintCard key={complaint.id} complaint={complaint} onStatusUpdate={onStatusUpdate} />
      ))}
    </Box>
  )
}

