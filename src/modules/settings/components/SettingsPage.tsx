import { Box, Typography, Container } from '@mui/material'

export default function SettingsPage() {
  return (
    <Container maxWidth={false} sx={{ px: 0 }}>
      <Box>
        <Typography variant="h2" component="h1" sx={{ mb: 0.5, fontSize: '2rem', fontWeight: 700 }}>
          Settings
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1rem' }}>
          Configure application settings
        </Typography>
      </Box>
    </Container>
  )
}

