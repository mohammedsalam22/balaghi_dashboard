import { Box, Typography, Container } from '@mui/material'
import { useComplaints } from '../hooks/useComplaints'
import { useComplaintFilters } from '../hooks/useComplaintFilters'
import ComplaintFilters from './ComplaintFilters'
import ComplaintsGrid from './ComplaintsGrid'

export default function ComplaintsPage() {
  const { complaints, loading, error } = useComplaints()
  const {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    filteredComplaints,
  } = useComplaintFilters({ complaints })

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading complaints...</Typography>
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">Error loading complaints: {error.message}</Typography>
      </Box>
    )
  }

  return (
    <Container maxWidth={false} sx={{ px: 0 }}>
      {/* Page Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h2" component="h2" sx={{ mb: 0.5, fontSize: '2rem', fontWeight: 700 }}>
          Citizen Complaints
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1rem' }}>
          Monitor and manage all citizen service requests.
        </Typography>
      </Box>

      {/* Filters */}
      <ComplaintFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        priorityFilter={priorityFilter}
        onPriorityFilterChange={setPriorityFilter}
      />

      {/* Complaints Grid */}
      <ComplaintsGrid complaints={filteredComplaints} />
    </Container>
  )
}

