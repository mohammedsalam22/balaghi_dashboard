import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppBar as MuiAppBar, Toolbar, IconButton, Typography, Box, Menu, MenuItem, Divider } from '@mui/material'
import { Menu as MenuIcon } from '@mui/icons-material'
import { Bell, User, LogOut, Sun, Moon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch } from '../store/hooks'
import { logout } from '../../modules/auth/slices/authSlice'
import { useTheme } from '../contexts/ThemeContext'
import LanguageSwitcher from './LanguageSwitcher'

interface AppBarProps {
  onMenuClick: () => void
}

export default function AppBar({ onMenuClick }: AppBarProps) {
  const { t } = useTranslation(['auth', 'common'])
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { mode, toggleMode } = useTheme()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleUserMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleUserMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    dispatch(logout())
    handleUserMenuClose()
    navigate('/login', { replace: true })
  }

  return (
    <MuiAppBar
      position="sticky"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        height: 64,
      }}
    >
      <Toolbar sx={{ gap: 1.5, px: 1.5 }}>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={onMenuClick}
          sx={{
            '&:hover': {
              backgroundColor: 'action.hover',
            },
          }}
        >
          <MenuIcon />
        </IconButton>

        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h1" component="h1" sx={{ fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.2 }}>
            {t('auth:appTitle')}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
            {t('auth:appSubtitle')}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 0.75, alignItems: 'center' }}>
          <LanguageSwitcher />

          <IconButton
            color="inherit"
            onClick={toggleMode}
            sx={{
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
            title={mode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            {mode === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </IconButton>

          <IconButton
            color="inherit"
            sx={{
              position: 'relative',
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
          >
            <Bell size={20} />
            <Box
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: 'error.main',
                border: '2px solid',
                borderColor: 'background.paper',
              }}
            />
          </IconButton>

          <IconButton
            color="inherit"
            onClick={handleUserMenuClick}
            sx={{
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
          >
            <User size={20} />
          </IconButton>
        </Box>

        {/* User Menu */}
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleUserMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem disabled>
            <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
              {t('common:labels.account')}
            </Typography>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LogOut size={18} />
              <Typography variant="body2">{t('auth:logout')}</Typography>
            </Box>
          </MenuItem>
        </Menu>
      </Toolbar>
    </MuiAppBar>
  )
}
