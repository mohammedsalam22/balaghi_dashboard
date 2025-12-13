import {
  TableRow,
  TableCell,
  Box,
  Typography,
  IconButton,
  Collapse,
  Chip,
} from '@mui/material'
import { Building2, Users, ChevronDown, ChevronRight, Edit2, Trash2 } from 'lucide-react'
import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '../../../shared/contexts/LanguageContext'
import { usePalette } from '../../../shared/hooks/usePalette'
import type { GovernmentAgency } from '../types'
import AgencyEmployeesList from './AgencyEmployeesList'

interface AgencyTableRowProps {
  agency: GovernmentAgency
  isExpanded: boolean
  onToggleExpand: () => void
  onEdit: (agency: GovernmentAgency) => void
  onDelete: (agency: GovernmentAgency) => void
}

export default function AgencyTableRow({
  agency,
  isExpanded,
  onToggleExpand,
  onEdit,
  onDelete,
}: AgencyTableRowProps) {
  const { t } = useTranslation('governmentAgency')
  const { direction } = useLanguage()
  const palette = usePalette()
  const employeeCount = agency.employees.length

  return (
    <Fragment>
      <TableRow
        sx={{
          '&:hover': {
            backgroundColor: palette.muted + '40',
          },
          cursor: 'pointer',
        }}
        onClick={onToggleExpand}
      >
        <TableCell>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation()
              onToggleExpand()
            }}
            sx={{
              color: palette.mutedForeground,
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
          >
            {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </IconButton>
        </TableCell>
        <TableCell align={direction === 'rtl' ? 'right' : 'left'}>
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              flexDirection: direction === 'rtl' ? 'row-reverse' : 'row',
              justifyContent: direction === 'rtl' ? 'flex-end' : 'flex-start',
            }}
          >
            <Building2 size={18} style={{ color: palette.accent, flexShrink: 0 }} />
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {agency.name}
            </Typography>
          </Box>
        </TableCell>
        <TableCell align="center">
          <Chip
            icon={<Users size={14} />}
            label={`${employeeCount} ${employeeCount === 1 ? t('table.employee') : t('table.employeesPlural')}`}
            size="small"
            sx={{
              height: 24,
              fontSize: '0.75rem',
              fontWeight: 500,
              backgroundColor: palette.accent + '33',
              color: palette.accent,
            }}
          />
        </TableCell>
        <TableCell align={direction === 'rtl' ? 'left' : 'right'}>
          <Box
            sx={{ 
              display: 'flex', 
              gap: 0.5, 
              justifyContent: direction === 'rtl' ? 'flex-start' : 'flex-end',
              flexDirection: direction === 'rtl' ? 'row-reverse' : 'row',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <IconButton
              size="small"
              onClick={() => onEdit(agency)}
              sx={{
                color: palette.accent,
                '&:hover': {
                  backgroundColor: palette.accent + '20',
                },
              }}
              title="Edit agency"
            >
              <Edit2 size={16} />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => onDelete(agency)}
              sx={{
                color: palette.destructive,
                '&:hover': {
                  backgroundColor: palette.destructive + '20',
                },
              }}
              title="Delete agency"
            >
              <Trash2 size={16} />
            </IconButton>
          </Box>
        </TableCell>
      </TableRow>
      {/* Expanded Row - Employees List */}
      <TableRow>
        <TableCell
          style={{ paddingBottom: 0, paddingTop: 0, border: 'none' }}
          colSpan={4}
        >
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <Box sx={{ p: 2, backgroundColor: palette.muted + '20' }}>
              <AgencyEmployeesList employees={agency.employees} />
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </Fragment>
  )
}
