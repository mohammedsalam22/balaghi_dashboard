import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { dashboardService } from '../services/dashboardService'
import type { DashboardData, DashboardKpis, DashboardRecentComplaint, DashboardStatusCount, DashboardTrendPoint } from '../services/dashboardService'
import type { RootState } from '../../../shared/store/store'

interface DashboardState {
  isLoading: boolean
  error: string | null
  lastFetchedAt: number | null
  kpis: DashboardKpis | null
  statusCounts: DashboardStatusCount[]
  trend: DashboardTrendPoint[]
  recentComplaints: DashboardRecentComplaint[]
}

const initialState: DashboardState = {
  isLoading: false,
  error: null,
  lastFetchedAt: null,
  kpis: null,
  statusCounts: [],
  trend: [],
  recentComplaints: [],
}

const DASHBOARD_CACHE_TTL_MS = 2 * 60 * 1000

export const fetchDashboardAsync = createAsyncThunk<
  DashboardData,
  { force?: boolean } | undefined,
  { state: RootState }
>(
  'dashboard/fetchAdminDashboard',
  async (_, { rejectWithValue }) => {
    try {
      const data = await dashboardService.getAdminDashboard()
      return data
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to load dashboard')
    }
  },
  {
    condition: (arg, { getState }) => {
      const state = getState()
      const { isLoading, lastFetchedAt } = state.dashboard

      // Prevent duplicate in-flight requests
      if (isLoading) return false

      // Allow forced refresh (manual refetch)
      if (arg?.force) return true

      // Skip if cache is still fresh
      if (typeof lastFetchedAt === 'number' && Date.now() - lastFetchedAt < DASHBOARD_CACHE_TTL_MS) {
        return false
      }

      return true
    },
  }
)

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardAsync.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchDashboardAsync.fulfilled, (state, action: PayloadAction<DashboardData>) => {
        state.isLoading = false
        state.kpis = action.payload.kpis
        state.statusCounts = action.payload.statusCounts
        state.trend = action.payload.trend
        state.recentComplaints = action.payload.recentComplaints
        state.error = null
        state.lastFetchedAt = Date.now()
      })
      .addCase(fetchDashboardAsync.rejected, (state, action) => {
        state.isLoading = false
        state.error = (action.payload as string) || 'Failed to load dashboard'
      })
  },
})

export const { clearError } = dashboardSlice.actions
export default dashboardSlice.reducer
