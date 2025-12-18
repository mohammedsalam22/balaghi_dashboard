import { Box, Typography, Container } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useComplaints } from '../hooks/useComplaints'
import { useComplaintFilters } from '../hooks/useComplaintFilters'
import ComplaintFilters from './ComplaintFilters'
import ComplaintsGrid from './ComplaintsGrid'
import ComplaintsSkeleton from './ComplaintsSkeleton'

export default function ComplaintsPage() {
  const { t } = useTranslation('complaints')
  const { complaints, loading, error, refetch } = useComplaints()
  const {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    filteredComplaints,
  } = useComplaintFilters({ complaints })

  if (loading) {
    return <ComplaintsSkeleton />
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{t('error', { message: error.message })}</Typography>
      </Box>
    )
  }

  return (
    <Container maxWidth={false} sx={{ px: 0 }}>
      {/* Page Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h2" component="h2" sx={{ mb: 0.5, fontSize: '2rem', fontWeight: 700 }}>
          {t('title')}
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1rem' }}>
          {t('description')}
        </Typography>
      </Box>

      {/* Filters */}
      <ComplaintFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      {/* Complaints Grid */}
      <ComplaintsGrid complaints={filteredComplaints} onStatusUpdate={refetch} />
    </Container>
  )
}

