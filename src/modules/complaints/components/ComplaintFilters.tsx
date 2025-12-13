import { Box, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material'
import { Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { FilterStatus } from '../hooks/useComplaintFilters'

interface ComplaintFiltersProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  statusFilter: FilterStatus
  onStatusFilterChange: (status: FilterStatus) => void
}

export default function ComplaintFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: ComplaintFiltersProps) {
  const { t } = useTranslation('complaints')
  
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1,
        mb: 3,
        flexWrap: 'wrap',
        alignItems: 'center',
      }}
    >
      <TextField
        placeholder={t('searchPlaceholder')}
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        size="small"
        sx={{
          flex: 1,
          minWidth: 250,
          '& .MuiOutlinedInput-root': {
            borderRadius: '0.5rem',
            '& fieldset': {
              borderColor: 'divider',
            },
          },
        }}
        InputProps={{
          startAdornment: (
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 1, color: 'text.secondary' }}>
              <Search size={20} />
            </Box>
          ),
        }}
      />

      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel>{t('status.label')}</InputLabel>
        <Select
          value={statusFilter}
          label={t('status.label')}
          onChange={(e) => onStatusFilterChange(e.target.value as FilterStatus)}
          sx={{
            borderRadius: '0.5rem',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'divider',
            },
          }}
        >
          <MenuItem value="All Status">{t('status.allStatus')}</MenuItem>
          <MenuItem value="Pending">{t('status.pending')}</MenuItem>
          <MenuItem value="UnderReview">{t('status.underReview')}</MenuItem>
          <MenuItem value="InProgress">{t('status.inProgress')}</MenuItem>
          <MenuItem value="Resolved">{t('status.resolved')}</MenuItem>
          <MenuItem value="Rejected">{t('status.rejected')}</MenuItem>
        </Select>
      </FormControl>
    </Box>
  )
}

