import { useState } from 'react'
import { Box, Typography, Container, Button } from '@mui/material'
import { Plus } from 'lucide-react'
import { useGovernmentAgencies } from '../hooks/useGovernmentAgencies'
import GovernmentAgencyGrid from './GovernmentAgencyGrid'
import AddAgencyDialog from './AddAgencyDialog'
import AgencyDialog from './AgencyDialog'
import type { GovernmentAgency } from '../types'

export default function GovernmentAgencyPage() {
  const { agencies, loading, error, refetch } = useGovernmentAgencies()
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [selectedAgency, setSelectedAgency] = useState<GovernmentAgency | null>(null)
  const [agencyDialogOpen, setAgencyDialogOpen] = useState(false)

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
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading government agencies...</Typography>
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">Error loading government agencies: {error.message}</Typography>
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
            Government Agencies
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1rem' }}>
            View and manage all government agencies and their employees.
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
          Add Agency
        </Button>
      </Box>

      {/* Agencies Grid */}
      <GovernmentAgencyGrid agencies={agencies} onAgencyClick={handleAgencyClick} />

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

