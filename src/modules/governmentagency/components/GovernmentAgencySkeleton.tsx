import { Box, Container, Skeleton } from '@mui/material'

export default function GovernmentAgencySkeleton() {
  return (
    <Container maxWidth={false} sx={{ px: 0 }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}>
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" width={260} height={40} />
          <Skeleton variant="text" width={420} height={24} />
        </Box>
        <Skeleton variant="rounded" width={160} height={40} />
      </Box>

      {/* Search bar */}
      <Box sx={{ mb: 2 }}>
        <Skeleton variant="rounded" height={40} />
      </Box>

      {/* Table */}
      <Skeleton variant="rounded" height={460} />
    </Container>
  )
}
