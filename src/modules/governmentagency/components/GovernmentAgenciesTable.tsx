import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
} from '@mui/material'
import { useState, useMemo } from 'react'
import { usePalette } from '../../../shared/hooks/usePalette'
import type { GovernmentAgency } from '../types'
import ConfirmationDialog from '../../../shared/components/ConfirmationDialog'
import AgencySearchBar from './AgencySearchBar'
import AgencyTableRow from './AgencyTableRow'
import { useAgencyDelete } from '../hooks/useAgencyDelete'

interface GovernmentAgenciesTableProps {
  agencies: GovernmentAgency[]
  onAgencyEdit: (agency: GovernmentAgency) => void
  onAgencyDelete: () => void
  onEmployeeDelete: () => void
}

export default function GovernmentAgenciesTable({
  agencies,
  onAgencyEdit,
  onAgencyDelete,
  onEmployeeDelete,
}: GovernmentAgenciesTableProps) {
  const palette = usePalette()
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState('')
  
  const {
    deleteConfirm,
    handleDeleteClick,
    handleDeleteConfirm,
    handleDeleteCancel,
  } = useAgencyDelete({ onSuccess: onAgencyDelete })

  // Filter agencies based on search query
  const filteredAgencies = useMemo(() => {
    if (!searchQuery.trim()) return agencies
    const query = searchQuery.toLowerCase()
    return agencies.filter((agency) => agency.name.toLowerCase().includes(query))
  }, [agencies, searchQuery])

  const toggleRow = (agencyId: string) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(agencyId)) {
      newExpanded.delete(agencyId)
    } else {
      newExpanded.add(agencyId)
    }
    setExpandedRows(newExpanded)
  }

  if (agencies.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 200,
          p: 3,
        }}
      >
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          No government agencies found
        </Typography>
      </Box>
    )
  }

  return (
    <>
      {/* Search Bar */}
      <AgencySearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      {/* Table */}
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: '0.75rem',
          border: `1px solid ${palette.border}`,
          overflow: 'hidden',
        }}
      >
        <Table>
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: palette.muted,
                '& th': {
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: 'text.secondary',
                  borderBottom: `1px solid ${palette.border}`,
                },
              }}
            >
              <TableCell sx={{ width: 50 }}></TableCell>
              <TableCell>Agency Name</TableCell>
              <TableCell align="center" sx={{ width: 150 }}>
                Employees
              </TableCell>
              <TableCell align="right" sx={{ width: 120 }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAgencies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    No agencies found matching "{searchQuery}"
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredAgencies.map((agency) => (
                <AgencyTableRow
                  key={agency.id}
                  agency={agency}
                  isExpanded={expandedRows.has(agency.id)}
                  onToggleExpand={() => toggleRow(agency.id)}
                  onEdit={onAgencyEdit}
                  onDelete={handleDeleteClick}
                />
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={deleteConfirm.open}
        title="Delete Agency"
        message={`Are you sure you want to delete "${deleteConfirm.agencyName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="error"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </>
  )
}

