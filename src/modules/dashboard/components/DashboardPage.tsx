import { Box, Typography, Container, Card, CardContent, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from '@mui/material'
import { PieChart } from '@mui/x-charts/PieChart'
import { LineChart } from '@mui/x-charts/LineChart'
import { FileText, Users, Building2, UserCog } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from '../../../shared/store/hooks'
import { useLanguage } from '../../../shared/contexts/LanguageContext'
import { usePalette } from '../../../shared/hooks/usePalette'
import { useDashboard } from '../hooks/useDashboard'
import DashboardSkeleton from './DashboardSkeleton'
import { useStatusConfig } from '../../complaints/utils/complaintUtils'

export default function DashboardPage() {
  const { t } = useTranslation('dashboard')
  const { t: tCommon } = useTranslation('common')
  const { direction, language } = useLanguage()
  const palette = usePalette()
  const statusConfig = useStatusConfig()

  const roles = useAppSelector((state) => state.auth.roles || [])
  const isAdmin = roles.includes('Admin')

  const { loading, error, kpis, statusCounts, trend, recentComplaints } = useDashboard()

  const locale = language === 'ar' ? 'ar-SA' : 'en-US'

  if (!isAdmin) {
    return (
      <Container maxWidth={false} sx={{ px: 0 }}>
        <Box>
          <Typography variant="h2" component="h1" sx={{ mb: 0.5, fontSize: '2rem', fontWeight: 700 }}>
            {t('employee.title')}
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1rem' }}>
            {t('employee.description')}
          </Typography>
        </Box>
      </Container>
    )
  }

  if (loading || !kpis) {
    return <DashboardSkeleton />
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{t('error', { message: error.message })}</Typography>
      </Box>
    )
  }

  const kpiCards = [
    {
      key: 'totalCitizens',
      label: t('kpis.totalCitizens'),
      value: kpis.totalCitizens,
      icon: Users,
      color: palette.accent,
    },
    {
      key: 'totalAgencies',
      label: t('kpis.totalAgencies'),
      value: kpis.totalAgencies,
      icon: Building2,
      color: palette.secondary,
    },
    {
      key: 'totalEmployees',
      label: t('kpis.totalEmployees'),
      value: kpis.totalEmployees,
      icon: UserCog,
      color: palette.primary,
    },
    {
      key: 'totalComplaints',
      label: t('kpis.totalComplaints'),
      value: kpis.totalComplaints,
      icon: FileText,
      color: palette.primary,
    },
  ] as const

  const pieData = statusCounts.map((s) => ({
    id: s.status,
    value: s.count,
    label: statusConfig[s.status]?.label ?? s.status,
    color: statusConfig[s.status]?.color ?? palette.primary,
  }))

  const trendX = trend.map((p) => p.date)
  const trendY = trend.map((p) => p.count)

  return (
    <Container maxWidth={false} sx={{ px: 0 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h2" component="h1" sx={{ mb: 0.5, fontSize: '2rem', fontWeight: 700 }}>
          {t('title')}
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1rem' }}>
          {t('description')}
        </Typography>
      </Box>

      {/* KPI Cards */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            lg: 'repeat(4, 1fr)',
          },
          gap: 2,
          mb: 2,
        }}
      >
        {kpiCards.map((k) => (
          <Card key={k.key} sx={{ borderRadius: '0.75rem' }}>
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: 1.5,
                  flexDirection: direction === 'rtl' ? 'row-reverse' : 'row',
                }}
              >
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                    {k.label}
                  </Typography>
                  <Typography variant="h3" sx={{ fontSize: '1.75rem', fontWeight: 800, lineHeight: 1.1 }}>
                    {k.value.toLocaleString(locale)}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: `${k.color}22`,
                    border: `1px solid ${palette.border}`,
                    flexShrink: 0,
                  }}
                >
                  <k.icon size={20} style={{ color: k.color }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Charts */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '1fr 2fr' },
          gap: 2,
          mb: 2,
        }}
      >
        <Card sx={{ borderRadius: '0.75rem' }}>
          <CardContent>
            <Typography variant="h3" sx={{ mb: 1 }}>
              {t('charts.complaintsByStatus')}
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <PieChart
              series={[
                {
                  data: pieData,
                  innerRadius: 40,
                  outerRadius: 80,
                  paddingAngle: 2,
                },
              ]}
              height={240}
              margin={{ left: 10, right: 10, top: 10, bottom: 10 }}
            />
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: '0.75rem' }}>
          <CardContent>
            <Typography variant="h3" sx={{ mb: 1 }}>
              {t('charts.complaintsTrend')}
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <LineChart
              xAxis={[
                {
                  data: trendX,
                  scaleType: 'point',
                },
              ]}
              series={[
                {
                  data: trendY,
                  label: t('kpis.totalComplaints'),
                  color: palette.primary,
                },
              ]}
              height={240}
              margin={{ left: 40, right: 20, top: 10, bottom: 30 }}
            />
          </CardContent>
        </Card>
      </Box>

      {/* Recent complaints */}
      <Card sx={{ borderRadius: '0.75rem' }}>
        <CardContent>
          <Typography variant="h3" sx={{ mb: 1 }}>
            {t('recent.title')}
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <TableContainer component={Paper} sx={{ borderRadius: '0.75rem', overflow: 'hidden' }}>
            <Table>
              <TableHead>
                <TableRow
                  sx={{
                    backgroundColor: palette.muted,
                    '& th': {
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      color: 'text.secondary',
                      borderBottom: `1px solid ${palette.border}`,
                    },
                  }}
                >
                  <TableCell align={direction === 'rtl' ? 'right' : 'left'}>{t('recent.trackingNumber')}</TableCell>
                  <TableCell align={direction === 'rtl' ? 'right' : 'left'}>{t('recent.citizen')}</TableCell>
                  <TableCell align={direction === 'rtl' ? 'right' : 'left'}>{t('recent.agency')}</TableCell>
                  <TableCell align="center">{t('recent.status')}</TableCell>
                  <TableCell align={direction === 'rtl' ? 'left' : 'right'}>{t('recent.createdAt')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentComplaints.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {tCommon('status.noData')}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  recentComplaints.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell align={direction === 'rtl' ? 'right' : 'left'} sx={{ fontFamily: 'monospace' }}>
                        {c.trackingNumber}
                      </TableCell>
                      <TableCell align={direction === 'rtl' ? 'right' : 'left'}>{c.citizenName}</TableCell>
                      <TableCell align={direction === 'rtl' ? 'right' : 'left'}>{c.agencyName}</TableCell>
                      <TableCell align="center">
                        <Chip
                          label={statusConfig[c.status]?.label ?? c.status}
                          size="small"
                          sx={{
                            backgroundColor: statusConfig[c.status]?.backgroundColor ?? palette.muted,
                            color: statusConfig[c.status]?.color ?? palette.foreground,
                            fontWeight: 600,
                          }}
                        />
                      </TableCell>
                      <TableCell align={direction === 'rtl' ? 'left' : 'right'} sx={{ color: 'text.secondary' }}>
                        {new Date(c.createdAt).toLocaleDateString(locale, {
                          year: 'numeric',
                          month: 'short',
                          day: '2-digit',
                        })}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Container>
  )
}
