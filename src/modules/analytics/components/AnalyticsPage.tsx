import { Box, Typography, Container } from '@mui/material'

export default function AnalyticsPage() {
  return (
    <Container maxWidth={false} sx={{ px: 0 }}>
      <Box>
        <Typography variant="h2" component="h1" sx={{ mb: 0.5, fontSize: '2rem', fontWeight: 700 }}>
          Analytics
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1rem' }}>
          View analytics and reports
        </Typography>
      </Box>
    </Container>
  )
}

