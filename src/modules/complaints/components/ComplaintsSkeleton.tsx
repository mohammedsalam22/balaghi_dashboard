import { Box, Container, Skeleton } from '@mui/material'

export default function ComplaintsSkeleton() {
  return (
    <Container maxWidth={false} sx={{ px: 0 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Skeleton variant="text" width={200} height={40} />
        <Skeleton variant="text" width={360} height={24} />
      </Box>

      {/* Filters */}
      <Box sx={{ mb: 2, display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
        <Skeleton variant="rounded" height={40} sx={{ flex: '1 1 320px' }} />
        <Skeleton variant="rounded" height={40} width={200} />
      </Box>

      {/* Grid cards */}
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
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} variant="rounded" height={220} />
        ))}
      </Box>
    </Container>
  )
}
