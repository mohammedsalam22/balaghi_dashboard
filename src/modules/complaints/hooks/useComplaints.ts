import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../../shared/store/hooks'
import { fetchComplaintsAsync } from '../slices/complaintsSlice'

export function useComplaints() {
  const dispatch = useAppDispatch()
  const { complaints, isLoading, error } = useAppSelector((state) => state.complaints)

  useEffect(() => {
    // Fetch complaints on mount if we don't have any
    if (complaints.length === 0 && !isLoading) {
      dispatch(fetchComplaintsAsync())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only run on mount

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

