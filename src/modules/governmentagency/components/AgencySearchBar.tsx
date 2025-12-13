import { Box, TextField, InputAdornment } from '@mui/material'
import { Search } from 'lucide-react'
import { usePalette } from '../../../shared/hooks/usePalette'

interface AgencySearchBarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
}

export default function AgencySearchBar({ searchQuery, onSearchChange }: AgencySearchBarProps) {
  const palette = usePalette()
  return (
    <Box sx={{ mb: 2 }}>
      <TextField
        fullWidth
        placeholder="Search agencies by name..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        size="small"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search size={18} style={{ color: palette.mutedForeground }} />
            </InputAdornment>
          ),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '0.5rem',
          },
        }}
      />
    </Box>
  )
}
