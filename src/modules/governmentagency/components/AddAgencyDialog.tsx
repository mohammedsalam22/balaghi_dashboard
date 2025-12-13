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
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from '../../../shared/store/hooks'
import { usePalette } from '../../../shared/hooks/usePalette'
import { createAgencyAsync } from '../slices/governmentAgenciesSlice'

interface AddAgencyDialogProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function AddAgencyDialog({ open, onClose, onSuccess }: AddAgencyDialogProps) {
  const { t } = useTranslation('governmentAgency')
  const palette = usePalette()
  const dispatch = useAppDispatch()
  const { error: reduxError, isLoading } = useAppSelector((state) => state.governmentAgencies)
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)

  // Sync error from Redux
  useEffect(() => {
    if (reduxError) {
      setError(reduxError)
    }
  }, [reduxError])

  const handleClose = () => {
    setName('')
    setError(null)
    onClose()
  }

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError(t('addDialog.nameRequired'))
      return
    }

    try {
      setError(null)
      const result = await dispatch(createAgencyAsync({ name: name.trim() }))
      
      if (createAgencyAsync.fulfilled.match(result)) {
      handleClose()
      onSuccess()
      } else {
        setError(result.payload as string || t('addDialog.createError'))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t('addDialog.createError'))
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
          <Building2 size={24} style={{ color: palette.accent }} />
          <Typography variant="h2" sx={{ fontSize: '1.5rem', fontWeight: 600 }}>
            {t('addDialog.title')}
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
              backgroundColor: palette.destructive + '20',
              border: `1px solid ${palette.destructive}`,
            }}
          >
            <Typography variant="body2" sx={{ color: palette.destructive }}>
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
            {t('addDialog.agencyName')}
          </Typography>
          <TextField
            fullWidth
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              setError(null)
            }}
            placeholder={t('addDialog.agencyName')}
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
          disabled={isLoading}
          variant="outlined"
          sx={{
            textTransform: 'none',
            borderRadius: '0.5rem',
          }}
        >
          {t('common:buttons.cancel')}
        </Button>
        <Button
          startIcon={<Plus size={18} />}
          onClick={handleSubmit}
          disabled={isLoading || !name.trim()}
          variant="contained"
          sx={{
            textTransform: 'none',
            borderRadius: '0.5rem',
          }}
        >
          {t('addAgency')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

