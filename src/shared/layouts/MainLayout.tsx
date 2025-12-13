import { useState } from 'react'
import { Box } from '@mui/material'
import { useLanguage } from '../contexts/LanguageContext'
import AppBar from '../components/AppBar'
import AppSidebar from '../components/AppSidebar'

interface MainLayoutProps {
  children: React.ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { direction } = useLanguage()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const drawerWidth = 5
  const railWidth = 5
  const sidebarWidth = sidebarOpen ? drawerWidth : railWidth

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <AppSidebar open={sidebarOpen} />

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: 0, // Force flex to respect sidebar width
            p: 3,
            overflow: 'auto',
            backgroundColor: 'background.default',
            minHeight: 'calc(100vh - 64px)',
            // Account for sidebar width - MUI Drawer with persistent variant should handle this,
            // but we add explicit margin as fallback
            ...(direction === 'rtl' 
              ? { marginRight: `${sidebarWidth}px`, transition: 'margin-right 0.3s ease' }
              : { marginLeft: `${sidebarWidth}px`, transition: 'margin-left 0.3s ease' }
            ),
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  )
}

