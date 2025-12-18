import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  Stack,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Button,
} from '@mui/material'
import type { SelectChangeEvent } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch } from '../../../shared/store/hooks'
import { logout } from '../../auth/slices/authSlice'
import { useTheme } from '../../../shared/contexts/ThemeContext'
import { useLanguage } from '../../../shared/contexts/LanguageContext'

export default function SettingsPage() {
  const { t } = useTranslation('common')
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { mode, toggleMode } = useTheme()
  const { language, changeLanguage } = useLanguage()
  const isArabic = language === 'ar'

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login', { replace: true })
  }

  const handleLanguageChange = (e: SelectChangeEvent) => {
    const value = e.target.value
    if (value === 'en' || value === 'ar') {
      changeLanguage(value)
    }
  }

  return (
    <Container maxWidth={false} sx={{ px: 0 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h2" component="h1" sx={{ mb: 0.5, fontSize: '2rem', fontWeight: 700 }}>
          {t('labels.settings')}
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1rem' }}>
          {t('messages.settingsDescription')}
        </Typography>
      </Box>

      <Stack spacing={2} sx={{ maxWidth: 720 }}>
        <Card>
          <CardContent>
            <Typography variant="h3" sx={{ mb: 1 }}>
              {t('labels.language')}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
              {t('messages.chooseLanguage')}
            </Typography>

            <FormControl size="small" sx={{ minWidth: 240 }}>
              <InputLabel>{t('labels.language')}</InputLabel>
              <Select value={language} label={t('labels.language')} onChange={handleLanguageChange}>
                <MenuItem value="en" sx={{ direction: 'ltr' }}>
                  English
                </MenuItem>
                <MenuItem value="ar" sx={{ direction: 'rtl' }}>
                  العربية
                </MenuItem>
              </Select>
            </FormControl>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h3" sx={{ mb: 1 }}>
              {t('labels.theme')}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
              {t('messages.chooseTheme')}
            </Typography>

            <FormControlLabel
              control={<Switch checked={mode === 'dark'} onChange={toggleMode} />}
              label={t('labels.darkMode')}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h3" sx={{ mb: 1 }}>
              {t('labels.account')}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
              {t('messages.accountActions')}
            </Typography>

            <Divider sx={{ mb: 2 }} />

            <Button
              variant="outlined"
              color="error"
              startIcon={!isArabic ? <LogOut size={18} /> : undefined}
              onClick={handleLogout}
              sx={{ textTransform: 'none' }}
            >
              {isArabic ? (
                <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, flexDirection: 'row-reverse' }}>
                  <LogOut size={18} />
                  <span>{t('buttons.logout')}</span>
                </Box>
              ) : (
                t('buttons.logout')
              )}
            </Button>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  )
}

