import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../../shared/store/hooks'
import { fetchCitizensAsync } from '../slices/citizensSlice'
import type { CitizensListQuery } from '../types'

export function useCitizens(query: CitizensListQuery) {
  const dispatch = useAppDispatch()
  const { citizens, isLoading, error, page, pageSize, totalCount, totalPages } = useAppSelector((state) => state.citizens)

  useEffect(() => {
    dispatch(fetchCitizensAsync(query))
  }, [dispatch, query])

  const refetch = () => {
    dispatch(fetchCitizensAsync(query))
  }

  return {
    citizens,
    loading: isLoading,
    error: error ? new Error(error) : null,
    page,
    pageSize,
    totalCount,
    totalPages,
    refetch,
  }
}

