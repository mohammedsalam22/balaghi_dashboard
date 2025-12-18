import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../../shared/store/hooks'
import { fetchComplaintsAsync } from '../slices/complaintsSlice'

export function useComplaints(options?: { agencyId?: string | null }) {
  const dispatch = useAppDispatch()
  const { complaints, isLoading, error, hasFetched, fetchedForIsAdmin, fetchedForAgencyId } = useAppSelector((state) => state.complaints)
  const isAdmin = useAppSelector((state) => (state.auth.roles || []).includes('Admin'))
  const desiredAgencyId = isAdmin ? (options?.agencyId ?? null) : null

  useEffect(() => {
    // Fetch complaints on mount, and refetch if role changed (admin vs employee)
    if (
      !isLoading &&
      (!hasFetched ||
        fetchedForIsAdmin === null ||
        fetchedForIsAdmin !== isAdmin ||
        (isAdmin && fetchedForAgencyId !== desiredAgencyId))
    ) {
      dispatch(fetchComplaintsAsync({ agencyId: desiredAgencyId }))
    }
  }, [dispatch, fetchedForAgencyId, fetchedForIsAdmin, hasFetched, isAdmin, isLoading, desiredAgencyId])

  const refetch = () => {
    dispatch(fetchComplaintsAsync({ agencyId: desiredAgencyId }))
  }

  return {
    complaints,
    loading: isLoading,
    error: error ? new Error(error) : null,
    refetch,
  }
}

