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
  Alert,
  Stack,
  InputAdornment,
} from '@mui/material'
import { KeyRound, Lock, X, Check, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { usePalette } from '../../../shared/hooks/usePalette'
import { authService } from '../services/authService'

interface FirstTimeLoginDialogProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function FirstTimeLoginDialog({ open, onClose, onSuccess }: FirstTimeLoginDialogProps) {
  const { t } = useTranslation('auth')
  const palette = usePalette()
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleClose = () => {
    setCode('')
    setNewPassword('')
    setConfirmPassword('')
    setError(null)
    setSuccess(null)
    onClose()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    // Validation
    if (!code.trim()) {
      setError(t('firstTimeLogin.codeRequired'))
      return
    }

    if (!newPassword.trim()) {
      setError(t('firstTimeLogin.passwordRequired'))
      return
    }

    if (newPassword.length < 8) {
      setError(t('firstTimeLogin.passwordMinLength'))
      return
    }

    if (newPassword !== confirmPassword) {
      setError(t('firstTimeLogin.passwordsNotMatch'))
      return
    }

    try {
      setLoading(true)
      const response = await authService.completeSetup({
        code: code.trim(),
        newPassword: newPassword.trim(),
      })
      setSuccess(response.message || t('firstTimeLogin.successMessage'))
      
      // Close dialog after 2 seconds and trigger success callback
      setTimeout(() => {
        handleClose()
        onSuccess()
      }, 2000)
    } catch (err: any) {
      setError(err.message || t('firstTimeLogin.error'))
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
          <KeyRound size={24} style={{ color: palette.accent }} />
          <Typography variant="h2" sx={{ fontSize: '1.5rem', fontWeight: 600 }}>
            {t('firstTimeLogin.title')}
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

      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert
              severity="success"
              icon={<Check size={20} />}
              sx={{ mb: 2 }}
            >
              {success}
            </Alert>
          )}

          <Stack spacing={2}>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
              {t('firstTimeLogin.description')}
            </Typography>

            <TextField
              fullWidth
              label={t('firstTimeLogin.verificationCode')}
              value={code}
              onChange={(e) => {
                setCode(e.target.value)
                setError(null)
              }}
              placeholder={t('firstTimeLogin.verificationCode')}
              required
              error={!!error && !code.trim()}
              disabled={loading || !!success}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '0.75rem',
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <KeyRound size={20} style={{ color: palette.mutedForeground }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label={t('firstTimeLogin.newPassword')}
              type={showPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value)
                setError(null)
              }}
              placeholder={t('firstTimeLogin.newPassword')}
              required
              error={!!error && (!newPassword.trim() || newPassword.length < 8)}
              disabled={loading || !!success}
              helperText={newPassword && newPassword.length < 8 ? t('firstTimeLogin.passwordMinLengthHelper') : ''}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '0.75rem',
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock size={20} style={{ color: palette.mutedForeground }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: 'text.secondary' }}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label={t('firstTimeLogin.confirmPassword')}
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value)
                setError(null)
              }}
              placeholder={t('firstTimeLogin.confirmPassword')}
              required
              error={!!error && (newPassword !== confirmPassword || !confirmPassword.trim())}
              disabled={loading || !!success}
              helperText={
                confirmPassword && newPassword !== confirmPassword
                  ? t('firstTimeLogin.passwordsNotMatchHelper')
                  : ''
              }
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '0.75rem',
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock size={20} style={{ color: palette.mutedForeground }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                      sx={{ color: 'text.secondary' }}
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
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
            {t('common:buttons.cancel')}
          </Button>
          <Button
            type="submit"
            disabled={loading || !!success || !code.trim() || !newPassword.trim() || !confirmPassword.trim()}
            variant="contained"
            sx={{
              textTransform: 'none',
              borderRadius: '0.5rem',
            }}
          >
            {loading ? t('firstTimeLogin.settingPassword') : success ? t('firstTimeLogin.success') : t('firstTimeLogin.completeSetup')}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  )
}

