import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Link,
  Divider,
  Stack,
  Alert,
} from '@mui/material'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { usePalette } from '../../../shared/hooks/usePalette'
import type { LoginCredentials } from '../types'
import { useAppDispatch, useAppSelector } from '../../../shared/store/hooks'
import { loginAsync, clearError } from '../slices/authSlice'
import FirstTimeLoginDialog from './FirstTimeLoginDialog'

export default function LoginPage() {
  const palette = usePalette()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { isLoading, error, isAuthenticated } = useAppSelector((state) => state.auth)

  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [firstTimeLoginOpen, setFirstTimeLoginOpen] = useState(false)

  // Clear error when component mounts or when user starts typing
  useEffect(() => {
    if (error) {
      dispatch(clearError())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [credentials.email, credentials.password])

  const handleChange = (field: keyof LoginCredentials) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials((prev) => ({
      ...prev,
      [field]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(clearError())
    const result = await dispatch(loginAsync(credentials))
    
    // Navigate to dashboard on successful login
    if (loginAsync.fulfilled.match(result)) {
      navigate('/dashboard', { replace: true })
    }
  }

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true })
    }
  }, [isAuthenticated, navigate])

  // Extract RGB values from theme primary color for gradient
  // palette.primary is in format "rgb(r, g, b)"
  const extractRgb = (rgbString: string): string => {
    const match = rgbString.match(/\d+/g)
    return match ? match.join(', ') : '59, 130, 246'
  }
  const primaryColorRgb = extractRgb(palette.primary)

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'background.default',
        backgroundImage: `linear-gradient(135deg, rgba(${primaryColorRgb}, 0.08) 0%, rgba(${primaryColorRgb}, 0.03) 100%)`,
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Card
          sx={{
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.1)',
            borderRadius: '1rem',
            overflow: 'hidden',
            border: `1px solid ${palette.border}`,
          }}
        >
          <CardContent sx={{ p: 4 }}>
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography
                variant="h2"
                component="h1"
                sx={{
                  fontSize: '2rem',
                  fontWeight: 700,
                  mb: 1,
                  color: 'text.primary',
                }}
              >
                Welcome Back
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1rem' }}>
                Sign in to your Civic Portal account
              </Typography>
            </Box>

            {/* Login Form */}
            <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
              <Stack spacing={2.5}>
                {/* Error Alert */}
                {error && (
                  <Alert severity="error" onClose={() => dispatch(clearError())}>
                    {error}
                  </Alert>
                )}

                {/* Email Field */}
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={credentials.email}
                  onChange={handleChange('email')}
                  placeholder="Enter your email"
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '0.75rem',
                      '& fieldset': {
                        borderColor: 'divider',
                      },
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Mail size={20} style={{ color: palette.mutedForeground }} />
                      </InputAdornment>
                    ),
                  }}
                />

                {/* Password Field */}
                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={credentials.password}
                  onChange={handleChange('password')}
                  placeholder="Enter your password"
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '0.75rem',
                      '& fieldset': {
                        borderColor: 'divider',
                      },
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'primary.main',
                      },
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

                {/* Forgot Password Link */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Link
                    href="#"
                    sx={{
                      fontSize: '0.875rem',
                      color: 'primary.main',
                      textDecoration: 'none',
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    Forgot password?
                  </Link>
                </Box>

                {/* Submit Button */}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={isLoading}
                  sx={{
                    mt: 2,
                    py: 1.5,
                    borderRadius: '0.75rem',
                    fontSize: '1rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                    boxShadow: `0 1px 3px rgba(${primaryColorRgb}, 0.3), 0 4px 12px rgba(${primaryColorRgb}, 0.2)`,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: palette.accent,
                      boxShadow: `0 4px 6px rgba(${primaryColorRgb}, 0.3), 0 6px 16px rgba(${primaryColorRgb}, 0.25)`,
                      transform: 'translateY(-1px)',
                    },
                    '&:active': {
                      transform: 'translateY(0)',
                      boxShadow: `0 1px 3px rgba(${primaryColorRgb}, 0.3)`,
                    },
                    '&:disabled': {
                      opacity: 0.6,
                    },
                  }}
                >
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </Button>
              </Stack>
            </Box>

            {/* Divider */}
            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary', px: 2 }}>
                OR
              </Typography>
            </Divider>

            {/* Additional Options */}
            <Box sx={{ textAlign: 'center' }}>
              <Button
                onClick={() => setFirstTimeLoginOpen(true)}
                variant="text"
                sx={{
                  textTransform: 'none',
                  color: 'primary.main',
                  fontWeight: 600,
                  mb: 2,
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                First Time Login
              </Button>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Don't have an account?{' '}
                <Link
                  href="#"
                  sx={{
                    color: 'primary.main',
                    fontWeight: 600,
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Contact Administrator
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Footer */}
        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
            © 2026 Civic Portal. All rights reserved.
          </Typography>
        </Box>
      </Container>

      {/* First Time Login Dialog */}
      <FirstTimeLoginDialog
        open={firstTimeLoginOpen}
        onClose={() => setFirstTimeLoginOpen(false)}
        onSuccess={() => {
          // Optionally show a success message or redirect
          // The user can now log in with their new password
        }}
      />
    </Box>
  )
}

