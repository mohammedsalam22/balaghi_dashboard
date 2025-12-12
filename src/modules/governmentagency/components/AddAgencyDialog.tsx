import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
} from '@mui/material'
import { Building2, Plus, X } from 'lucide-react'
import { useState } from 'react'
import { lightPalette } from '../../../theme'
import { governmentAgencyService } from '../services/governmentAgencyService'

interface AddAgencyDialogProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function AddAgencyDialog({ open, onClose, onSuccess }: AddAgencyDialogProps) {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleClose = () => {
    setName('')
    setError(null)
    onClose()
  }

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError('Agency name is required')
      return
    }

    try {
      setLoading(true)
      setError(null)
      await governmentAgencyService.create({ name: name.trim() })
      handleClose()
      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create agency')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '0.75rem',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Building2 size={24} style={{ color: lightPalette.accent }} />
          <Typography variant="h2" sx={{ fontSize: '1.5rem', fontWeight: 600 }}>
            Add New Agency
          </Typography>
        </Box>
        <IconButton
          onClick={handleClose}
          size="small"
          sx={{
            '&:hover': {
              backgroundColor: 'action.hover',
            },
          }}
        >
          <X size={20} />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {error && (
          <Box
            sx={{
              p: 1.5,
              mb: 2,
              borderRadius: '0.5rem',
              backgroundColor: lightPalette.destructive + '20',
              border: `1px solid ${lightPalette.destructive}`,
            }}
          >
            <Typography variant="body2" sx={{ color: lightPalette.destructive }}>
              {error}
            </Typography>
          </Box>
        )}

        <Box sx={{ mt: 1 }}>
          <Typography
            variant="overline"
            sx={{
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'text.secondary',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              mb: 1,
              display: 'block',
            }}
          >
            Agency Name
          </Typography>
          <TextField
            fullWidth
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              setError(null)
            }}
            placeholder="Enter agency name"
            error={!!error && !name.trim()}
            helperText={error && !name.trim() ? error : ''}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '0.5rem',
              },
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && name.trim()) {
                handleSubmit()
              }
            }}
          />
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          pb: 2,
          gap: 1,
        }}
      >
        <Button
          onClick={handleClose}
          disabled={loading}
          variant="outlined"
          sx={{
            textTransform: 'none',
            borderRadius: '0.5rem',
          }}
        >
          Cancel
        </Button>
        <Button
          startIcon={<Plus size={18} />}
          onClick={handleSubmit}
          disabled={loading || !name.trim()}
          variant="contained"
          sx={{
            textTransform: 'none',
            borderRadius: '0.5rem',
          }}
        >
          Add Agency
        </Button>
      </DialogActions>
    </Dialog>
  )
}

