import { Box } from '@mui/material'
import type { Complaint } from '../types'
import ComplaintCard from './ComplaintCard'

interface ComplaintsGridProps {
  complaints: Complaint[]
}

export default function ComplaintsGrid({ complaints }: ComplaintsGridProps) {
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
        <ComplaintCard key={complaint.id} complaint={complaint} />
      ))}
    </Box>
  )
}

