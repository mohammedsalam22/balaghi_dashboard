import { useLocation, useNavigate } from 'react-router-dom'
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Box } from '@mui/material'
import { Home as HomeIcon, FileText, Users, BarChart3, Settings as SettingsIcon, Building2, Bell, FileSpreadsheet } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '../contexts/LanguageContext'
import { useAppSelector } from '../store/hooks'

interface AppSidebarProps {
  open: boolean
}

export default function AppSidebar({ open }: AppSidebarProps) {
  const { t } = useTranslation('navigation')
  const { direction } = useLanguage()
  const navigate = useNavigate()
  const location = useLocation()
  const { roles } = useAppSelector((state) => state.auth)
  const drawerWidth = 240
  const railWidth = 72
  
  // In RTL, sidebar should be on the right
  const anchor = direction === 'rtl' ? 'right' : 'left'

  // All navigation items with their required roles
  const allNavigationItems = [
    { icon: <HomeIcon size={20} />, labelKey: 'dashboard', path: '/dashboard', roles: ['Admin'] },
    { icon: <FileText size={20} />, labelKey: 'complaints', path: '/complaints', roles: ['Admin', 'Employee'] },
    { icon: <Users size={20} />, labelKey: 'citizens', path: '/citizens', roles: ['Admin'] },
    { icon: <Building2 size={20} />, labelKey: 'governmentAgencies', path: '/government-agency', roles: ['Admin'] },
    { icon: <BarChart3 size={20} />, labelKey: 'analytics', path: '/analytics', roles: ['Admin'] },
    { icon: <FileSpreadsheet size={20} />, labelKey: 'reports', path: '/reports', roles: ['Admin'] },
    { icon: <Bell size={20} />, labelKey: 'notifications', path: '/notifications', roles: ['Admin'] },
    { icon: <SettingsIcon size={20} />, labelKey: 'settings', path: '/settings', roles: ['Admin', 'Employee'] },
  ]

  // Filter navigation items based on user roles
  const navigationItems = allNavigationItems.filter((item) => {
    // If user has no roles, show nothing (shouldn't happen if authenticated)
    if (roles.length === 0) return false
    // Check if user has at least one of the required roles
    return item.roles.some((role) => roles.includes(role))
  })

  const handleNavigation = (path: string) => {
    navigate(path)
  }

  return (
    <Drawer
      variant="persistent"
      anchor={anchor}
      open={true}
      sx={{
        width: open ? drawerWidth : railWidth,
        flexShrink: 0,
        transition: 'width 0.3s ease',
        '& .MuiDrawer-paper': {
          width: open ? drawerWidth : railWidth,
          boxSizing: 'border-box',
          height: 'calc(100vh - 64px)',
          top: 64,
          transition: 'width 0.3s ease',
          overflowX: 'hidden',
        },
      }}
    >
      <Box sx={{ p: open ? 2 : 1 }}>
        {open && (
          <Typography
            variant="overline"
            sx={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'text.secondary',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              mb: 2,
              display: 'block',
            }}
          >
            {t('title')}
          </Typography>
        )}

        <List sx={{ gap: 0.25 }}>
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.path
            const label = t(item.labelKey)
            return (
              <ListItem key={item.labelKey} disablePadding sx={{ mb: 0.25 }}>
                <ListItemButton
                  selected={isActive}
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    borderRadius: '0.5rem',
                    py: 0.75,
                    px: open ? 0.75 : 1,
                    justifyContent: open ? 'flex-start' : 'center',
                    flexDirection: open && direction === 'rtl' ? 'row-reverse' : 'row',
                    cursor: 'pointer',
                    '&.Mui-selected': {
                      backgroundColor: 'action.hover',
                      color: 'text.primary',
                      fontWeight: 500,
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      },
                    },
                    '&:hover': {
                      backgroundColor: 'action.hover',
                      color: 'text.primary',
                    },
                  }}
                  title={!open ? label : undefined}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: open ? (direction === 'rtl' ? 0 : 36) : 'auto',
                      justifyContent: 'center',
                      color: isActive ? 'text.primary' : 'text.secondary',
                      ...(open && direction === 'rtl' 
                        ? { 
                            marginRight: 0,
                            marginLeft: 1,
                            order: 2, // Icon comes after text in RTL
                          }
                        : {
                            marginRight: 'auto',
                            marginLeft: 0,
                            order: 1, // Icon comes before text in LTR
                          }
                      ),
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {open && (
                    <ListItemText
                      primary={label}
                      primaryTypographyProps={{
                        fontSize: '0.9375rem',
                        fontWeight: isActive ? 500 : 400,
                      }}
                      sx={{
                        margin: 0,
                        order: direction === 'rtl' ? 1 : 2, // Text comes before icon in RTL
                        '& .MuiListItemText-primary': {
                          textAlign: direction === 'rtl' ? 'right' : 'left',
                        },
                      }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            )
          })}
        </List>
      </Box>
    </Drawer>
  )
}
