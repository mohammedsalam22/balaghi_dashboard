import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../../shared/store/store'
import { complaintService } from '../services/complaintService'
import type { Complaint, ComplaintStatus } from '../types'

interface ComplaintsState {
  complaints: Complaint[]
  isLoading: boolean
  error: string | null
  fetchedForIsAdmin: boolean | null
}

const initialState: ComplaintsState = {
  complaints: [],
  isLoading: false,
  error: null,
  fetchedForIsAdmin: null,
}

// Async thunk for fetching complaints
export const fetchComplaintsAsync = createAsyncThunk(
  'complaints/fetchComplaints',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState
      const isAdmin = (state.auth.roles || []).includes('Admin')
      const complaints = await complaintService.getAll({ isAdmin })
      return { complaints, isAdmin }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch complaints')
    }
  }
)

// Async thunk for updating complaint status
export const updateComplaintStatusAsync = createAsyncThunk(
  'complaints/updateStatus',
  async ({ id, status }: { id: string; status: ComplaintStatus }, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState
      const isAdmin = (state.auth.roles || []).includes('Admin')
      if (isAdmin) {
        return rejectWithValue('Admins are not allowed to update complaint status')
      }

      await complaintService.updateStatus(id, status)
      // Return the updated complaint data
      const complaint = state.complaints.complaints.find((c) => c.id === id)
      if (complaint) {
        return { id, status, complaint: { ...complaint, status } }
      }
      return { id, status }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update complaint status')
    }
  }
)

const complaintsSlice = createSlice({
  name: 'complaints',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    updateComplaintStatus: (state, action: PayloadAction<{ id: string; status: ComplaintStatus }>) => {
      const complaint = state.complaints.find((c) => c.id === action.payload.id)
      if (complaint) {
        complaint.status = action.payload.status
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch complaints cases
    builder
      .addCase(fetchComplaintsAsync.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchComplaintsAsync.fulfilled, (state, action: PayloadAction<{ complaints: Complaint[]; isAdmin: boolean }>) => {
        state.isLoading = false
        state.complaints = action.payload.complaints
        state.fetchedForIsAdmin = action.payload.isAdmin
        state.error = null
      })
      .addCase(fetchComplaintsAsync.rejected, (state, action) => {
        state.isLoading = false
        state.error = (action.payload as string) || 'Failed to fetch complaints'
      })

    // Update status cases
    builder
      .addCase(updateComplaintStatusAsync.pending, (state) => {
        state.error = null
      })
      .addCase(updateComplaintStatusAsync.fulfilled, (state, action) => {
        if (action.payload.complaint) {
          const index = state.complaints.findIndex((c) => c.id === action.payload.id)
          if (index !== -1) {
            state.complaints[index] = action.payload.complaint
          }
        } else {
          // Fallback: update status directly
          const complaint = state.complaints.find((c) => c.id === action.payload.id)
          if (complaint) {
            complaint.status = action.payload.status
          }
        }
        state.error = null
      })
      .addCase(updateComplaintStatusAsync.rejected, (state, action) => {
        state.error = (action.payload as string) || 'Failed to update complaint status'
      })
  },
})

export const { clearError, updateComplaintStatus } = complaintsSlice.actions
export default complaintsSlice.reducer
