import { Box, Container, Skeleton } from '@mui/material'

export default function CitizensSkeleton() {
  return (
    <Container maxWidth={false} sx={{ px: 0 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Skeleton variant="text" width={200} height={40} />
        <Skeleton variant="text" width={360} height={24} />
      </Box>

      {/* Filters */}
      <Box sx={{ mb: 2, display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
        <Skeleton variant="rounded" height={40} sx={{ flex: '1 1 320px' }} />
        <Skeleton variant="rounded" height={40} width={220} />
        <Skeleton variant="rounded" height={40} width={240} />
        <Skeleton variant="rounded" height={40} width={110} />
        <Skeleton variant="rounded" height={40} width={110} />
      </Box>

      {/* Table */}
      <Skeleton variant="rounded" height={420} />
    </Container>
  )
}
