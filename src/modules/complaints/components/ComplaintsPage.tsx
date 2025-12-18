import { useEffect, useState } from 'react'
import { Box, Typography, Container } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useComplaints } from '../hooks/useComplaints'
import { useComplaintFilters } from '../hooks/useComplaintFilters'
import ComplaintFilters from './ComplaintFilters'
import ComplaintsGrid from './ComplaintsGrid'
import ComplaintsSkeleton from './ComplaintsSkeleton'
import ComplaintsSummary from './ComplaintsSummary'
import { useAppDispatch, useAppSelector } from '../../../shared/store/hooks'
import { fetchAgenciesAsync } from '../../governmentagency/slices/governmentAgenciesSlice'

export default function ComplaintsPage() {
  const { t } = useTranslation('complaints')
  const dispatch = useAppDispatch()
  const roles = useAppSelector((state) => state.auth.roles || [])
  const isAdmin = roles.includes('Admin')
  const agenciesState = useAppSelector((state) => state.governmentAgencies)

  const [agencyId, setAgencyId] = useState<string | null>(null)

  // Fetch agencies list for admin filter dropdown
  useEffect(() => {
    if (!isAdmin) return
    if (!agenciesState.isLoading && agenciesState.agencies.length === 0) {
      dispatch(fetchAgenciesAsync())
    }
  }, [agenciesState.agencies.length, agenciesState.isLoading, dispatch, isAdmin])

  const { complaints, loading, error, refetch } = useComplaints({ agencyId })
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
        showAgencyFilter={isAdmin}
        agencies={agenciesState.agencies}
        agencyId={agencyId}
        onAgencyChange={(id) => setAgencyId(id)}
      />

      {/* Summary */}
      <ComplaintsSummary
        totalComplaints={complaints}
        visibleComplaints={filteredComplaints}
        isFiltered={searchQuery.trim().length > 0 || statusFilter !== 'All Status' || !!agencyId}
      />

      {/* Complaints Grid */}
      <ComplaintsGrid complaints={filteredComplaints} onStatusUpdate={refetch} />
    </Container>
  )
}

