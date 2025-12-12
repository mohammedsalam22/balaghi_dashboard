import { Box } from '@mui/material'
import type { GovernmentAgency } from '../types'
import GovernmentAgencyCard from './GovernmentAgencyCard'

interface GovernmentAgencyGridProps {
  agencies: GovernmentAgency[]
  onAgencyClick?: (agency: GovernmentAgency) => void
}

export default function GovernmentAgencyGrid({ agencies, onAgencyClick }: GovernmentAgencyGridProps) {
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
      {agencies.map((agency) => (
        <GovernmentAgencyCard
          key={agency.id}
          agency={agency}
          onClick={() => onAgencyClick?.(agency)}
        />
      ))}
    </Box>
  )
}

