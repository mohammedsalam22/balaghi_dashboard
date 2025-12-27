import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppBar as MuiAppBar, Toolbar, IconButton, Typography, Box, Menu, MenuItem, Divider, Badge } from '@mui/material'
import { Menu as MenuIcon } from '@mui/icons-material'
import { Bell, User, LogOut, Settings as SettingsIcon, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { logout } from '../../modules/auth/slices/authSlice'
import { removeNotificationById, markAsRead } from '../../modules/notifications/slices/notificationSlice'
import type { RootState } from '../store/store'

interface AppBarProps {
  onMenuClick: () => void
}

export default function AppBar({ onMenuClick }: AppBarProps) {
  const { t } = useTranslation(['auth', 'common'])
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { roles } = useAppSelector((state) => state.auth)
  const notifications = useAppSelector((state: RootState) => state.notifications.notifications)
  const unreadNotifications = notifications.filter(n => !n.read)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const notificationsOpen = Boolean(notificationsAnchorEl)

  const isEmployeeOnly = roles.includes('Employee') && !roles.includes('Admin')

  const handleUserMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleUserMenuClose = () => {
    setAnchorEl(null)
  }

  const handleNotificationsMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationsAnchorEl(event.currentTarget)
  }

  const handleNotificationsMenuClose = () => {
    setNotificationsAnchorEl(null)
  }

  const handleNotificationClick = (notificationId: string) => {
    dispatch(markAsRead(notificationId))
  }

  const handleNotificationRemove = (notificationId: string, event: React.MouseEvent) => {
    event.stopPropagation()
    dispatch(removeNotificationById(notificationId))
  }

  const handleViewAllNotifications = () => {
    handleNotificationsMenuClose()
    navigate('/notifications')
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
        {!isEmployeeOnly && (
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
        )}

        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h1" component="h1" sx={{ fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.2 }}>
            {t('auth:appTitle')}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
            {t('auth:appSubtitle')}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 0.75, alignItems: 'center' }}>
          {isEmployeeOnly && (
          <IconButton
            color="inherit"
              onClick={() => navigate('/settings')}
              aria-label="settings"
            sx={{
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
          >
              <SettingsIcon size={20} />
          </IconButton>
          )}
          {!isEmployeeOnly && (
          <IconButton
            color="inherit"
            onClick={handleNotificationsMenuClick}
            sx={{
              position: 'relative',
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
          >
            <Badge badgeContent={unreadNotifications.length} color="error" invisible={unreadNotifications.length === 0}>
              <Bell size={20} />
            </Badge>
          </IconButton>
          )}

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

        {/* Notifications Menu */}
        <Menu
          anchorEl={notificationsAnchorEl}
          open={notificationsOpen}
          onClose={handleNotificationsMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          PaperProps={{
            sx: { minWidth: 320, maxWidth: 400, maxHeight: 400 },
          }}
        >
          <Box sx={{ px: 2, py: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="subtitle2">
              {t('common:notifications.title', 'Notifications')}
            </Typography>
            {unreadNotifications.length > 0 && (
              <Badge badgeContent={unreadNotifications.length} color="error" />
            )}
          </Box>
          <Divider />
          {notifications.length === 0 ? (
            <MenuItem disabled sx={{ py: 2 }}>
              <Typography variant="body2">{t('common:notifications.noNotifications', 'No notifications')}</Typography>
            </MenuItem>
          ) : (
            notifications.slice(0, 5).map((notification) => (
              <MenuItem 
                key={notification.id}
                onClick={() => handleNotificationClick(notification.id)}
                sx={{ 
                  py: 1.5,
                  backgroundColor: notification.read ? 'transparent' : 'action.hover',
                  '&:hover': { backgroundColor: 'action.selected' }
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
                  <Box sx={{ flex: 1, mr: 1 }}>
                    <Box sx={{ mb: 0.5 }}>
                      <Typography variant="body2" fontWeight="bold" sx={{ fontSize: '0.875rem' }}>
                        {notification.type}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      {notification.trackingNumber} - {notification.complaintType}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      {new Date(notification.submittedAt).toLocaleString()}
                    </Typography>
                  </Box>
                  <IconButton
                    size="small"
                    onClick={(e) => handleNotificationRemove(notification.id, e)}
                    sx={{ ml: 1, flexShrink: 0 }}
                  >
                    <X size={16} />
                  </IconButton>
                </Box>
              </MenuItem>
            ))
          )}
          <Divider />
          <MenuItem onClick={handleViewAllNotifications} sx={{ py: 1 }}>
            <Typography variant="body2">{t('common:notifications.viewAll', 'View All Notifications')}</Typography>
          </MenuItem>
        </Menu>
      </Toolbar>
    </MuiAppBar>
  )
}
