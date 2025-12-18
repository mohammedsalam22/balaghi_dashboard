import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../../shared/store/hooks'
import { fetchComplaintsAsync } from '../slices/complaintsSlice'

export function useComplaints() {
  const dispatch = useAppDispatch()
  const { complaints, isLoading, error, fetchedForIsAdmin } = useAppSelector((state) => state.complaints)
  const isAdmin = useAppSelector((state) => (state.auth.roles || []).includes('Admin'))

  useEffect(() => {
    // Fetch complaints on mount, and refetch if role changed (admin vs employee)
    if (!isLoading && (complaints.length === 0 || fetchedForIsAdmin === null || fetchedForIsAdmin !== isAdmin)) {
      dispatch(fetchComplaintsAsync())
    }
  }, [dispatch, complaints.length, fetchedForIsAdmin, isAdmin, isLoading])

  const refetch = () => {
    dispatch(fetchComplaintsAsync())
  }

  return {
    complaints,
    loading: isLoading,
    error: error ? new Error(error) : null,
    refetch,
  }
}

