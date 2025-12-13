import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../../shared/store/hooks'
import { fetchAgenciesAsync } from '../slices/governmentAgenciesSlice'

export function useGovernmentAgencies() {
  const dispatch = useAppDispatch()
  const { agencies, isLoading, error } = useAppSelector((state) => state.governmentAgencies)

  useEffect(() => {
    // Fetch agencies on mount if we don't have any
    if (agencies.length === 0 && !isLoading) {
      dispatch(fetchAgenciesAsync())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only run on mount

  const refetch = () => {
    dispatch(fetchAgenciesAsync())
  }

  return {
    agencies,
    loading: isLoading,
    error: error ? new Error(error) : null,
    refetch,
  }
}

