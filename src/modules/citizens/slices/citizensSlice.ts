import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { citizenService } from '../services/citizenService'
import type { Citizen, CitizensListQuery, CitizensListResponse, CitizensSort } from '../types'

interface CitizensState {
  citizens: Citizen[]
  isLoading: boolean
  error: string | null
  page: number
  pageSize: number
  totalCount: number
  totalPages: number
  lastQuery: {
    q: string
    isEmailVerified: boolean | null
    sort: CitizensSort
    createdFrom?: string
    createdTo?: string
  }
}

const initialState: CitizensState = {
  citizens: [],
  isLoading: false,
  error: null,
  page: 1,
  pageSize: 50,
  totalCount: 0,
  totalPages: 0,
  lastQuery: {
    q: '',
    isEmailVerified: null,
    sort: 'createdAtDesc',
  },
}

export const fetchCitizensAsync = createAsyncThunk(
  'citizens/fetchCitizens',
  async (query: CitizensListQuery | undefined, { rejectWithValue }) => {
    try {
      const response = await citizenService.list(query)
      return response
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch citizens')
    }
  }
)

const citizensSlice = createSlice({
  name: 'citizens',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCitizensAsync.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchCitizensAsync.fulfilled, (state, action) => {
        state.isLoading = false
        state.citizens = action.payload.data || []
        state.page = action.payload.page
        state.pageSize = action.payload.pageSize
        state.totalCount = action.payload.totalCount
        state.totalPages = action.payload.totalPages
        state.error = null

        const arg = action.meta.arg as CitizensListQuery | undefined
        state.lastQuery = {
          q: arg?.q?.trim() ? arg.q.trim() : '',
          isEmailVerified: typeof arg?.isEmailVerified === 'boolean' ? arg.isEmailVerified : null,
          sort: (arg?.sort ?? 'createdAtDesc') as CitizensSort,
          createdFrom: arg?.createdFrom,
          createdTo: arg?.createdTo,
        }
      })
      .addCase(fetchCitizensAsync.rejected, (state, action) => {
        state.isLoading = false
        state.error = (action.payload as string) || 'Failed to fetch citizens'
      })
  },
})

export const { clearError } = citizensSlice.actions
export default citizensSlice.reducer

