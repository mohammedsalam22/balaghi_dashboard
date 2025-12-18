import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../../shared/store/hooks'
import { fetchDashboardAsync } from '../slices/dashboardSlice'

export function useDashboard() {
  const dispatch = useAppDispatch()
  const { isLoading, error, kpis, statusCounts, trend, recentComplaints } = useAppSelector((state) => state.dashboard)

  useEffect(() => {
    dispatch(fetchDashboardAsync(undefined))
  }, [dispatch])

  const refetch = () => {
    dispatch(fetchDashboardAsync({ force: true }))
  }

  return {
    loading: isLoading,
    error: error ? new Error(error) : null,
    kpis,
    statusCounts,
    trend,
    recentComplaints,
    refetch,
  }
}
