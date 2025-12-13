import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './shared/contexts/ThemeContext'
import LoginPage from './modules/auth/components/LoginPage'
import DashboardPage from './modules/dashboard/components/DashboardPage'
import ComplaintsPage from './modules/complaints/components/ComplaintsPage'
import CitizensPage from './modules/citizens/components/CitizensPage'
import AnalyticsPage from './modules/analytics/components/AnalyticsPage'
import SettingsPage from './modules/settings/components/SettingsPage'
import GovernmentAgencyPage from './modules/governmentagency/components/GovernmentAgencyPage'
import ProtectedRoute from './shared/components/ProtectedRoute'
import MainLayout from './shared/layouts/MainLayout'

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <DashboardPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/complaints"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <ComplaintsPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/citizens"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <CitizensPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <AnalyticsPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <SettingsPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/government-agency"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <GovernmentAgencyPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
