import { useState, useEffect } from 'react'
import { Box, Typography, Container, Button } from '@mui/material'
import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useGovernmentAgencies } from '../hooks/useGovernmentAgencies'
import { useAppSelector } from '../../../shared/store/hooks'
import GovernmentAgenciesTable from './GovernmentAgenciesTable'
import AddAgencyDialog from './AddAgencyDialog'
import AgencyDialog from './AgencyDialog'
import GovernmentAgencySkeleton from './GovernmentAgencySkeleton'
import type { GovernmentAgency } from '../types'

export default function GovernmentAgencyPage() {
  const { t } = useTranslation('governmentAgency')
  const { agencies, loading, error, refetch } = useGovernmentAgencies()
  const reduxAgencies = useAppSelector((state) => state.governmentAgencies.agencies)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [selectedAgency, setSelectedAgency] = useState<GovernmentAgency | null>(null)
  const [agencyDialogOpen, setAgencyDialogOpen] = useState(false)

  // Sync selectedAgency with Redux state when it updates
  useEffect(() => {
    if (selectedAgency && reduxAgencies.length > 0) {
      const updatedAgency = reduxAgencies.find((a) => a.id === selectedAgency.id)
      if (updatedAgency) {
        setSelectedAgency(updatedAgency)
      }
    }
  }, [reduxAgencies, selectedAgency?.id])

  const handleAddAgency = () => {
    setAddDialogOpen(true)
  }

  const handleAgencyClick = (agency: GovernmentAgency) => {
    setSelectedAgency(agency)
    setAgencyDialogOpen(true)
  }

  const handleDialogClose = () => {
    setAgencyDialogOpen(false)
    setSelectedAgency(null)
  }

  const handleAddSuccess = () => {
    refetch()
  }

  const handleUpdateSuccess = () => {
    refetch()
  }

  const handleDeleteSuccess = () => {
    refetch()
  }

  if (loading) {
    return <GovernmentAgencySkeleton />
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
      <Box
        sx={{
          mb: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 2,
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Typography variant="h2" component="h2" sx={{ mb: 0.5, fontSize: '2rem', fontWeight: 700 }}>
            {t('title')}
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1rem' }}>
            {t('description')}
          </Typography>
        </Box>
        <Button
          startIcon={<Plus size={18} />}
          onClick={handleAddAgency}
          variant="contained"
          sx={{
            textTransform: 'none',
            borderRadius: '0.5rem',
            flexShrink: 0,
          }}
        >
          {t('addAgency')}
        </Button>
      </Box>

      {/* Agencies Table */}
      <GovernmentAgenciesTable
        agencies={agencies}
        onAgencyEdit={handleAgencyClick}
        onAgencyDelete={handleDeleteSuccess}
        onEmployeeDelete={handleUpdateSuccess}
      />

      {/* Add Agency Dialog */}
      <AddAgencyDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onSuccess={handleAddSuccess}
      />

      {/* Agency Details Dialog */}
      <AgencyDialog
        open={agencyDialogOpen}
        agency={selectedAgency}
        onClose={handleDialogClose}
        onUpdate={handleUpdateSuccess}
        onDelete={handleDeleteSuccess}
      />
    </Container>
  )
}

