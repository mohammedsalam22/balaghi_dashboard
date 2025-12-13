import { Box, Chip, FormControl, InputLabel, Select, MenuItem, Typography, CircularProgress } from '@mui/material'
import type { ComplaintStatus } from '../types'
import { statusConfig, statusOptions } from '../utils/complaintUtils'

interface ComplaintStatusSelectorProps {
  currentStatus: ComplaintStatus
  onStatusChange: (status: ComplaintStatus) => void
  canEdit: boolean
  isUpdating: boolean
}

export default function ComplaintStatusSelector({
  currentStatus,
  onStatusChange,
  canEdit,
  isUpdating,
}: ComplaintStatusSelectorProps) {
  if (!canEdit) {
    return (
      <Chip
        label={statusConfig[currentStatus]?.label || currentStatus}
        size="small"
        sx={{
          fontSize: '0.875rem',
          fontWeight: 500,
          backgroundColor: statusConfig[currentStatus]?.backgroundColor || 'action.hover',
          color: statusConfig[currentStatus]?.color || 'text.secondary',
        }}
      />
    )
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {isUpdating && <CircularProgress size={16} />}
      <FormControl size="small" sx={{ minWidth: 200 }}>
        <InputLabel>Status</InputLabel>
        <Select
          value={currentStatus}
          label="Status"
          onChange={(e) => onStatusChange(e.target.value as ComplaintStatus)}
          disabled={isUpdating}
          sx={{
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'divider',
            },
          }}
        >
          {statusOptions.map((statusOption) => {
            const optionConfig = statusConfig[statusOption]
            return (
              <MenuItem key={statusOption} value={statusOption}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: optionConfig.color,
                    }}
                  />
                  <Typography>{optionConfig.label}</Typography>
                </Box>
              </MenuItem>
            )
          })}
        </Select>
      </FormControl>
    </Box>
  )
}
