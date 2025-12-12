import { useLocation, useNavigate } from 'react-router-dom'
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Box } from '@mui/material'
import { Home as HomeIcon, FileText, Users, BarChart3, Settings as SettingsIcon, Building2 } from 'lucide-react'
import { useAppSelector } from '../store/hooks'

interface AppSidebarProps {
  open: boolean
}

// All navigation items with their required roles
const allNavigationItems = [
  { icon: <HomeIcon size={20} />, label: 'Dashboard', path: '/dashboard', roles: ['Admin', 'Employee'] },
  { icon: <FileText size={20} />, label: 'Complaints', path: '/complaints', roles: ['Admin', 'Employee'] },
  { icon: <Users size={20} />, label: 'Citizens', path: '/citizens', roles: ['Admin'] },
  { icon: <Building2 size={20} />, label: 'Government Agencies', path: '/government-agency', roles: ['Admin'] },
  { icon: <BarChart3 size={20} />, label: 'Analytics', path: '/analytics', roles: ['Admin'] },
  { icon: <SettingsIcon size={20} />, label: 'Settings', path: '/settings', roles: ['Admin', 'Employee'] },
]

export default function AppSidebar({ open }: AppSidebarProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { roles } = useAppSelector((state) => state.auth)
  const drawerWidth = 240
  const railWidth = 72

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
            Navigation
          </Typography>
        )}

        <List sx={{ gap: 0.25 }}>
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <ListItem key={item.label} disablePadding sx={{ mb: 0.25 }}>
                <ListItemButton
                  selected={isActive}
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    borderRadius: '0.5rem',
                    py: 0.75,
                    px: open ? 0.75 : 1,
                    justifyContent: open ? 'flex-start' : 'center',
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
                  title={!open ? item.label : undefined}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: open ? 36 : 'auto',
                      justifyContent: 'center',
                      color: isActive ? 'text.primary' : 'text.secondary',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {open && (
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{
                        fontSize: '0.9375rem',
                        fontWeight: isActive ? 500 : 400,
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
