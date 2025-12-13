import { IconButton, Menu, MenuItem, Box, Typography } from '@mui/material'
import { Languages } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '../contexts/LanguageContext'

export default function LanguageSwitcher() {
  const { language, changeLanguage } = useLanguage()
  const { t } = useTranslation('common')
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLanguageChange = (lang: 'en' | 'ar') => {
    changeLanguage(lang)
    handleClose()
  }

  const getLanguageLabel = (lang: 'en' | 'ar') => {
    return lang === 'ar' ? 'العربية' : 'English'
  }

  return (
    <>
      <IconButton
        color="inherit"
        onClick={handleClick}
        sx={{
          '&:hover': {
            backgroundColor: 'action.hover',
          },
        }}
        title={t('labels.language')}
      >
        <Languages size={20} />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem
          onClick={() => handleLanguageChange('en')}
          selected={language === 'en'}
          sx={{
            direction: 'ltr',
            '&.Mui-selected': {
              backgroundColor: 'action.selected',
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 100 }}>
            <Typography variant="body2">🇬🇧</Typography>
            <Typography variant="body2">English</Typography>
          </Box>
        </MenuItem>
        <MenuItem
          onClick={() => handleLanguageChange('ar')}
          selected={language === 'ar'}
          sx={{
            direction: 'rtl',
            '&.Mui-selected': {
              backgroundColor: 'action.selected',
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 100 }}>
            <Typography variant="body2">🇸🇦</Typography>
            <Typography variant="body2">العربية</Typography>
          </Box>
        </MenuItem>
      </Menu>
    </>
  )
}
