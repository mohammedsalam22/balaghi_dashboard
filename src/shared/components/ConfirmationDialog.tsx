import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
} from '@mui/material'
import { AlertTriangle, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { usePalette } from '../hooks/usePalette'

interface ConfirmationDialogProps {
  open: boolean
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  confirmColor?: 'primary' | 'error' | 'warning' | 'info' | 'success'
  onConfirm: () => void
  onCancel: () => void
  loading?: boolean
}

export default function ConfirmationDialog({
  open,
  title,
  message,
  confirmText,
  cancelText,
  confirmColor = 'error',
  onConfirm,
  onCancel,
  loading = false,
}: ConfirmationDialogProps) {
  const { t } = useTranslation('common')
  const palette = usePalette()
  
  const dialogTitle = title || t('messages.confirmDelete')
  const dialogConfirmText = confirmText || t('buttons.confirm')
  const dialogCancelText = cancelText || t('buttons.cancel')
  
  return (
    <Dialog
      open={open}
      onClose={onCancel}
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
          <AlertTriangle size={24} style={{ color: palette.destructive }} />
          <Typography variant="h2" sx={{ fontSize: '1.25rem', fontWeight: 600 }}>
            {dialogTitle}
          </Typography>
        </Box>
        <IconButton
          onClick={onCancel}
          size="small"
          disabled={loading}
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
        <DialogContentText
          sx={{
            fontSize: '0.9375rem',
            color: 'text.primary',
            lineHeight: 1.6,
          }}
        >
          {message}
        </DialogContentText>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          pb: 2,
          gap: 1,
        }}
      >
        <Button
          onClick={onCancel}
          disabled={loading}
          variant="outlined"
          sx={{
            textTransform: 'none',
            borderRadius: '0.5rem',
          }}
        >
          {dialogCancelText}
        </Button>
        <Button
          onClick={onConfirm}
          disabled={loading}
          variant="contained"
          color={confirmColor}
          sx={{
            textTransform: 'none',
            borderRadius: '0.5rem',
          }}
        >
          {loading ? t('buttons.processing') : dialogConfirmText}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

