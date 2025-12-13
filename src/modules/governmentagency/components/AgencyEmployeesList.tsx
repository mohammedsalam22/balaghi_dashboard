import { Box, Typography, Stack } from '@mui/material'
import { Users, Mail } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '../../../shared/contexts/LanguageContext'
import { usePalette } from '../../../shared/hooks/usePalette'
import type { Employee } from '../types'

interface AgencyEmployeesListProps {
  employees: Employee[]
}

export default function AgencyEmployeesList({ employees }: AgencyEmployeesListProps) {
  const { t } = useTranslation('governmentAgency')
  const { direction } = useLanguage()
  const palette = usePalette()
  
  if (employees.length === 0) {
    return (
      <Box
        sx={{
          p: 2,
          borderRadius: '0.5rem',
          backgroundColor: 'background.paper',
          textAlign: 'center',
        }}
      >
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {t('detailsDialog.noEmployees')}
        </Typography>
      </Box>
    )
  }

  return (
    <Stack spacing={1}>
      <Typography
        variant="overline"
        sx={{
          fontSize: '0.75rem',
          fontWeight: 600,
          color: 'text.secondary',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          mb: 1,
          display: 'block',
          textAlign: direction === 'rtl' ? 'right' : 'left',
        }}
      >
        {t('detailsDialog.employees')}
      </Typography>
      {employees.map((employee) => (
        <Box
          key={employee.id}
          sx={{
            p: 1.5,
            borderRadius: '0.5rem',
            backgroundColor: 'background.paper',
            border: `1px solid ${palette.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: direction === 'rtl' ? 'row' : 'row',
          }}
        >
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1, 
              flex: 1,
              flexDirection: direction === 'rtl' ? 'row-reverse' : 'row',
              justifyContent: direction === 'rtl' ? 'flex-end' : 'flex-start',
            }}
          >
            <Users size={16} style={{ color: palette.mutedForeground, flexShrink: 0 }} />
            <Typography 
              variant="body2" 
              sx={{ 
                fontWeight: 500,
                textAlign: direction === 'rtl' ? 'right' : 'left',
              }}
            >
              {employee.userName}
            </Typography>
          </Box>
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 0.5,
              flexDirection: direction === 'rtl' ? 'row-reverse' : 'row',
            }}
          >
            <Mail size={14} style={{ color: palette.mutedForeground, flexShrink: 0 }} />
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'text.secondary', 
                fontSize: '0.8125rem',
                textAlign: direction === 'rtl' ? 'right' : 'left',
              }}
            >
              {employee.email}
            </Typography>
          </Box>
        </Box>
      ))}
    </Stack>
  )
}
