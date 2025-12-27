import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './shared/contexts/ThemeContext'
import { LanguageProvider } from './shared/contexts/LanguageContext'
import LoginPage from './modules/auth/components/LoginPage'
import DashboardPage from './modules/dashboard/components/DashboardPage'
import ComplaintsPage from './modules/complaints/components/ComplaintsPage'
import CitizensPage from './modules/citizens/components/CitizensPage'
import AnalyticsPage from './modules/analytics/components/AnalyticsPage'
import SettingsPage from './modules/settings/components/SettingsPage'
import GovernmentAgencyPage from './modules/governmentagency/components/GovernmentAgencyPage'
import NotificationsPage from './modules/notifications/components/NotificationsPage'
import ReportsPage from './modules/reports/components/ReportsPage'
import ProtectedRoute from './shared/components/ProtectedRoute'
import MainLayout from './shared/layouts/MainLayout'
import { useAppSelector } from './shared/store/hooks'

function HomeRedirect() {
  const { roles } = useAppSelector((state) => state.auth)
  const isAdmin = roles.includes('Admin')
  return <Navigate to={isAdmin ? '/dashboard' : '/complaints'} replace />
}

function App() {
  return (
    <LanguageProvider>
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
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <NotificationsPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <ReportsPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Default redirect */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomeRedirect />
              </ProtectedRoute>
            }
          />
          <Route
            path="*"
            element={
              <ProtectedRoute>
                <HomeRedirect />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
    </LanguageProvider>
  )
}

export default App
