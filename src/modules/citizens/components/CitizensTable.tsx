import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  TextField,
  InputAdornment,
  Chip,
  TablePagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from '@mui/material'
import type { SelectChangeEvent } from '@mui/material'
import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '../../../shared/contexts/LanguageContext'
import { usePalette } from '../../../shared/hooks/usePalette'
import type { Citizen, CitizensSort } from '../types'

interface CitizensTableProps {
  citizens: Citizen[]
  totalCount: number
  pageIndex: number
  pageSize: number
  draftSearchQuery: string
  draftIsEmailVerified: boolean | null
  draftSort: CitizensSort
  appliedSearchQuery: string
  appliedIsEmailVerified: boolean | null
  hasPendingFilters: boolean
  onApplyFilters: () => void
  onResetFilters: () => void
  onDraftSearchQueryChange: (value: string) => void
  onPageChange: (pageIndex: number) => void
  onPageSizeChange: (pageSize: number) => void
  onDraftIsEmailVerifiedChange: (value: boolean | null) => void
  onDraftSortChange: (value: CitizensSort) => void
}

function formatDateTime(value: string, locale: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString(locale, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function CitizensTable({
  citizens,
  totalCount,
  pageIndex,
  pageSize,
  draftSearchQuery,
  draftIsEmailVerified,
  draftSort,
  appliedSearchQuery,
  appliedIsEmailVerified,
  hasPendingFilters,
  onApplyFilters,
  onResetFilters,
  onDraftSearchQueryChange,
  onPageChange,
  onPageSizeChange,
  onDraftIsEmailVerifiedChange,
  onDraftSortChange,
}: CitizensTableProps) {
  const { t } = useTranslation('citizens')
  const { direction, language } = useLanguage()
  const palette = usePalette()

  const locale = language === 'ar' ? 'ar-SA' : 'en-US'

  const [localSearch, setLocalSearch] = useState(draftSearchQuery)
  useEffect(() => {
    setLocalSearch(draftSearchQuery)
  }, [draftSearchQuery])

  const handleSearchChange = (value: string) => {
    setLocalSearch(value)
    onDraftSearchQueryChange(value)
  }

  const handleChangePage = (_: unknown, newPage: number) => {
    onPageChange(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    onPageSizeChange(parseInt(event.target.value, 10))
  }

  const handleEmailVerifiedChange = (e: SelectChangeEvent) => {
    const value = e.target.value
    if (value === 'all') onDraftIsEmailVerifiedChange(null)
    else if (value === 'true') onDraftIsEmailVerifiedChange(true)
    else if (value === 'false') onDraftIsEmailVerifiedChange(false)
  }

  const handleSortChange = (e: SelectChangeEvent) => {
    onDraftSortChange(e.target.value as CitizensSort)
  }

  const emptyMessage =
    totalCount === 0 && (appliedSearchQuery.trim() || appliedIsEmailVerified !== null)
      ? t('table.noMatching', { query: appliedSearchQuery })
      : t('table.noCitizens')

  const canReset =
    draftSearchQuery.trim() !== '' ||
    draftIsEmailVerified !== null ||
    draftSort !== 'createdAtDesc' ||
    appliedSearchQuery.trim() !== '' ||
    appliedIsEmailVerified !== null

  // Defensive clamp so TablePagination doesn't get an out-of-range page.
  const maxPageIndex = totalCount > 0 ? Math.floor((totalCount - 1) / pageSize) : 0
  const safePageIndex = Math.min(pageIndex, maxPageIndex)

  useEffect(() => {
    if (safePageIndex !== pageIndex) {
      onPageChange(safePageIndex)
    }
  }, [onPageChange, pageIndex, safePageIndex])

  return (
    <>
      <Box sx={{ mb: 2, display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          sx={{
            flex: '1 1 320px',
            '& .MuiOutlinedInput-root': {
              borderRadius: '0.5rem',
            },
          }}
          placeholder={t('searchPlaceholder')}
          value={localSearch}
          onChange={(e) => handleSearchChange(e.target.value)}
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={18} style={{ color: palette.mutedForeground }} />
              </InputAdornment>
            ),
          }}
        />

        <FormControl size="small" sx={{ minWidth: 220 }}>
          <InputLabel>{t('filters.emailVerified')}</InputLabel>
          <Select
            value={draftIsEmailVerified === null ? 'all' : draftIsEmailVerified ? 'true' : 'false'}
            label={t('filters.emailVerified')}
            onChange={handleEmailVerifiedChange}
          >
            <MenuItem value="all">{t('filters.all')}</MenuItem>
            <MenuItem value="true">{t('filters.verified')}</MenuItem>
            <MenuItem value="false">{t('filters.notVerified')}</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 240 }}>
          <InputLabel>{t('sort.label')}</InputLabel>
          <Select value={draftSort} label={t('sort.label')} onChange={handleSortChange}>
            <MenuItem value="createdAtDesc">{t('sort.createdAtDesc')}</MenuItem>
            <MenuItem value="createdAtAsc">{t('sort.createdAtAsc')}</MenuItem>
            <MenuItem value="fullNameAsc">{t('sort.fullNameAsc')}</MenuItem>
            <MenuItem value="fullNameDesc">{t('sort.fullNameDesc')}</MenuItem>
            <MenuItem value="emailAsc">{t('sort.emailAsc')}</MenuItem>
            <MenuItem value="emailDesc">{t('sort.emailDesc')}</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="contained"
          onClick={onApplyFilters}
          disabled={!hasPendingFilters}
          sx={{ textTransform: 'none', borderRadius: '0.5rem', height: 40 }}
        >
          {t('actions.apply')}
        </Button>

        <Button
          variant="outlined"
          onClick={onResetFilters}
          disabled={!canReset}
          sx={{ textTransform: 'none', borderRadius: '0.5rem', height: 40 }}
        >
          {t('actions.reset')}
        </Button>
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          borderRadius: '0.75rem',
          border: `1px solid ${palette.border}`,
          overflow: 'hidden',
        }}
      >
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
              <TableCell align={direction === 'rtl' ? 'right' : 'left'}>{t('table.fullName')}</TableCell>
              <TableCell align={direction === 'rtl' ? 'right' : 'left'}>{t('table.email')}</TableCell>
              <TableCell align="center" sx={{ width: 170 }}>
                {t('table.emailVerified')}
              </TableCell>
              <TableCell align={direction === 'rtl' ? 'left' : 'right'} sx={{ width: 220 }}>
                {t('table.createdAt')}
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {citizens.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {emptyMessage}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              citizens.map((citizen) => (
                <TableRow
                  key={citizen.id}
                  sx={{
                    '&:hover': {
                      backgroundColor: palette.muted,
                    },
                    '& td': {
                      borderBottom: `1px solid ${palette.border}`,
                    },
                  }}
                >
                  <TableCell align={direction === 'rtl' ? 'right' : 'left'}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {citizen.fullName}
                    </Typography>
                  </TableCell>

                  <TableCell align={direction === 'rtl' ? 'right' : 'left'}>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', color: 'text.secondary' }}>
                      {citizen.email}
                    </Typography>
                  </TableCell>

                  <TableCell align="center">
                    {citizen.isEmailVerified ? (
                      <Chip
                        label={t('table.verified')}
                        size="small"
                        sx={{
                          backgroundColor: palette.statusResolved,
                          color: palette.statusResolvedForeground,
                          fontWeight: 600,
                        }}
                      />
                    ) : (
                      <Chip
                        label={t('table.notVerified')}
                        size="small"
                        sx={{
                          backgroundColor: palette.muted,
                          color: palette.mutedForeground,
                          fontWeight: 600,
                        }}
                      />
                    )}
                  </TableCell>

                  <TableCell align={direction === 'rtl' ? 'left' : 'right'}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {formatDateTime(citizen.createdAt, locale)}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={totalCount}
          page={safePageIndex}
          onPageChange={handleChangePage}
          rowsPerPage={pageSize}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[10, 25, 50, 100, 200]}
          labelRowsPerPage={t('pagination.rowsPerPage')}
          labelDisplayedRows={({ from, to, count }) =>
            count !== -1
              ? t('pagination.displayedRows', { from, to, count })
              : t('pagination.displayedRowsMoreThan', { from, to, moreThan: to })
          }
          getItemAriaLabel={(type) => t(`pagination.aria.${type}`)}
        />
      </TableContainer>
    </>
  )
}

