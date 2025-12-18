import { useMemo, useState } from 'react'
import { Box, Typography, Container } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useCitizens } from '../hooks/useCitizens'
import CitizensTable from './CitizensTable'
import CitizensSkeleton from './CitizensSkeleton'
import type { CitizensSort } from '../types'

export default function CitizensPage() {
  const { t } = useTranslation('citizens')

  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize, setPageSize] = useState(50)

  // Draft filters (UI-controlled). Applied filters drive the API call.
  const [draftSearchQuery, setDraftSearchQuery] = useState('')
  const [draftIsEmailVerified, setDraftIsEmailVerified] = useState<boolean | null>(null)
  const [draftSort, setDraftSort] = useState<CitizensSort>('createdAtDesc')

  const [appliedSearchQuery, setAppliedSearchQuery] = useState('')
  const [appliedIsEmailVerified, setAppliedIsEmailVerified] = useState<boolean | null>(null)
  const [appliedSort, setAppliedSort] = useState<CitizensSort>('createdAtDesc')

  const hasPendingFilters =
    draftSearchQuery.trim() !== appliedSearchQuery.trim() ||
    draftIsEmailVerified !== appliedIsEmailVerified ||
    draftSort !== appliedSort

  const query = useMemo(
    () => ({
      page: pageIndex + 1,
      pageSize,
      q: appliedSearchQuery.trim() ? appliedSearchQuery.trim() : undefined,
      isEmailVerified: appliedIsEmailVerified === null ? undefined : appliedIsEmailVerified,
      sort: appliedSort,
    }),
    [appliedIsEmailVerified, appliedSearchQuery, appliedSort, pageIndex, pageSize]
  )

  const { citizens, loading, error, totalCount } = useCitizens(query)

  if (loading) {
    return <CitizensSkeleton />
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{t('error', { message: error.message })}</Typography>
      </Box>
    )
  }

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

      <CitizensTable
        citizens={citizens}
        totalCount={totalCount}
        pageIndex={pageIndex}
        pageSize={pageSize}
        draftSearchQuery={draftSearchQuery}
        draftIsEmailVerified={draftIsEmailVerified}
        draftSort={draftSort}
        appliedSearchQuery={appliedSearchQuery}
        appliedIsEmailVerified={appliedIsEmailVerified}
        hasPendingFilters={hasPendingFilters}
        onApplyFilters={() => {
          setAppliedSearchQuery(draftSearchQuery)
          setAppliedIsEmailVerified(draftIsEmailVerified)
          setAppliedSort(draftSort)
          setPageIndex(0)
        }}
        onResetFilters={() => {
          const defaultSearch = ''
          const defaultEmailVerified = null
          const defaultSort: CitizensSort = 'createdAtDesc'

          setDraftSearchQuery(defaultSearch)
          setDraftIsEmailVerified(defaultEmailVerified)
          setDraftSort(defaultSort)

          setAppliedSearchQuery(defaultSearch)
          setAppliedIsEmailVerified(defaultEmailVerified)
          setAppliedSort(defaultSort)

          setPageIndex(0)
        }}
        onDraftSearchQueryChange={(value) => setDraftSearchQuery(value)}
        onPageChange={(nextPageIndex) => setPageIndex(nextPageIndex)}
        onPageSizeChange={(nextPageSize) => {
          setPageSize(nextPageSize)
          setPageIndex(0)
        }}
        onDraftIsEmailVerifiedChange={(value) => setDraftIsEmailVerified(value)}
        onDraftSortChange={(value) => setDraftSort(value)}
      />
    </Container>
  )
}

