import { Card, CardContent, Typography, Box, Chip, Stack, Divider } from '@mui/material'
import { Building2, Users, Mail } from 'lucide-react'
import { lightPalette } from '../../../theme'
import type { GovernmentAgency } from '../types'

interface GovernmentAgencyCardProps {
  agency: GovernmentAgency
  onClick?: () => void
}

export default function GovernmentAgencyCard({ agency, onClick }: GovernmentAgencyCardProps) {
  const employeeCount = agency.employees.length
  const displayedEmployees = agency.employees.slice(0, 2)
  const hasMoreEmployees = employeeCount > 2

  return (
    <Card
      onClick={onClick}
      sx={{
        transition: 'all 0.2s',
        cursor: onClick ? 'pointer' : 'default',
        '&:hover': {
          transform: 'translateY(-2px)',
        },
      }}
    >
      <CardContent sx={{ p: 1.5 }}>
        {/* Header with Agency Name and Employee Count */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 1.25,
            gap: 1,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flex: 1, minWidth: 0 }}>
            <Building2 size={20} style={{ color: lightPalette.accent, flexShrink: 0 }} />
            <Typography
              variant="h3"
              component="h3"
              sx={{
                fontSize: '1.125rem',
                fontWeight: 600,
                lineHeight: 1.4,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {agency.name}
            </Typography>
          </Box>
          <Chip
            icon={<Users size={14} />}
            label={`${employeeCount} ${employeeCount === 1 ? 'Employee' : 'Employees'}`}
            size="small"
            sx={{
              height: 24,
              fontSize: '0.75rem',
              fontWeight: 500,
              backgroundColor: lightPalette.accent + '33',
              color: lightPalette.accent,
              flexShrink: 0,
            }}
          />
        </Box>

        {/* Employees Section */}
        {employeeCount > 0 ? (
          <>
            <Divider sx={{ my: 1.25 }} />
            <Box>
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
              <Stack spacing={1}>
                {displayedEmployees.map((employee) => (
                  <Box
                    key={employee.id}
                    sx={{
                      p: 1,
                      borderRadius: '0.5rem',
                      backgroundColor: lightPalette.muted,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        mb: 0.5,
                      }}
                    >
                      {employee.userName}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Mail size={14} style={{ color: lightPalette.mutedForeground, flexShrink: 0 }} />
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: '0.8125rem',
                          color: 'text.secondary',
                        }}
                      >
                        {employee.email}
                      </Typography>
                    </Box>
                  </Box>
                ))}
                {hasMoreEmployees && (
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: '0.8125rem',
                      color: 'text.secondary',
                      fontStyle: 'italic',
                      textAlign: 'center',
                      pt: 0.5,
                    }}
                  >
                    +{employeeCount - 2} more employee{employeeCount - 2 > 1 ? 's' : ''}
                  </Typography>
                )}
              </Stack>
            </Box>
          </>
        ) : (
          <Box
            sx={{
              mt: 1.25,
              p: 1.5,
              borderRadius: '0.5rem',
              backgroundColor: lightPalette.muted,
              textAlign: 'center',
            }}
          >
            <Typography
              variant="body2"
              sx={{
                fontSize: '0.875rem',
                color: 'text.secondary',
              }}
            >
              No employees assigned
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

