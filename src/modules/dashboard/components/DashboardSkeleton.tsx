import { Box, Card, CardContent, Container, Divider, Skeleton } from '@mui/material'

export default function DashboardSkeleton() {
  return (
    <Container maxWidth={false} sx={{ px: 0 }}>
      <Box sx={{ mb: 3 }}>
        <Skeleton variant="text" width={220} height={40} />
        <Skeleton variant="text" width={320} height={24} />
      </Box>

      {/* KPI cards */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            lg: 'repeat(4, 1fr)',
          },
          gap: 2,
          mb: 2,
        }}
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} sx={{ borderRadius: '0.75rem' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1.5 }}>
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width={140} height={20} />
                  <Skeleton variant="text" width={110} height={42} />
                </Box>
                <Skeleton variant="rounded" width={40} height={40} />
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Charts */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '1fr 2fr' },
          gap: 2,
          mb: 2,
        }}
      >
        <Card sx={{ borderRadius: '0.75rem' }}>
          <CardContent>
            <Skeleton variant="text" width={220} height={26} />
            <Divider sx={{ mb: 2 }} />
            <Skeleton variant="rounded" height={240} />
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: '0.75rem' }}>
          <CardContent>
            <Skeleton variant="text" width={260} height={26} />
            <Divider sx={{ mb: 2 }} />
            <Skeleton variant="rounded" height={240} />
          </CardContent>
        </Card>
      </Box>

      {/* Recent table */}
      <Card sx={{ borderRadius: '0.75rem' }}>
        <CardContent>
          <Skeleton variant="text" width={220} height={26} />
          <Divider sx={{ mb: 2 }} />
          <Skeleton variant="rounded" height={260} />
        </CardContent>
      </Card>
    </Container>
  )
}
