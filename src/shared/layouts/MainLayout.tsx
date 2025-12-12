import { useState } from 'react'
import { Box } from '@mui/material'
import AppBar from '../components/AppBar'
import AppSidebar from '../components/AppSidebar'

interface MainLayoutProps {
  children: React.ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <AppSidebar open={sidebarOpen} />

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            overflow: 'auto',
            backgroundColor: 'background.default',
            minHeight: 'calc(100vh - 64px)',
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  )
}

