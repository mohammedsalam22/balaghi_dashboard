import { Box, Typography, Stack } from '@mui/material'
import { Users, Mail } from 'lucide-react'
import { lightPalette } from '../../../theme'
import type { Employee } from '../types'

interface AgencyEmployeesListProps {
  employees: Employee[]
}

export default function AgencyEmployeesList({ employees }: AgencyEmployeesListProps) {
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
          No employees assigned to this agency
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
        }}
      >
        Employees
      </Typography>
      {employees.map((employee) => (
        <Box
          key={employee.id}
          sx={{
            p: 1.5,
            borderRadius: '0.5rem',
            backgroundColor: 'background.paper',
            border: `1px solid ${lightPalette.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
            <Users size={16} style={{ color: lightPalette.mutedForeground }} />
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {employee.userName}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Mail size={14} style={{ color: lightPalette.mutedForeground }} />
            <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.8125rem' }}>
              {employee.email}
            </Typography>
          </Box>
        </Box>
      ))}
    </Stack>
  )
}
