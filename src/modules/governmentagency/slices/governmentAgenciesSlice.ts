import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { governmentAgencyService } from '../services/governmentAgencyService'
import type {
  GovernmentAgency,
  CreateAgencyRequest,
  UpdateAgencyRequest,
  InviteEmployeeRequest,
  InviteEmployeeResponse,
} from '../services/governmentAgencyService'

interface GovernmentAgenciesState {
  agencies: GovernmentAgency[]
  isLoading: boolean
  error: string | null
}

const initialState: GovernmentAgenciesState = {
  agencies: [],
  isLoading: false,
  error: null,
}

// Async thunk for fetching agencies
export const fetchAgenciesAsync = createAsyncThunk(
  'governmentAgencies/fetchAgencies',
  async (_, { rejectWithValue }) => {
    try {
      const agencies = await governmentAgencyService.getAll()
      return agencies
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch government agencies')
    }
  }
)

// Async thunk for creating an agency
export const createAgencyAsync = createAsyncThunk(
  'governmentAgencies/createAgency',
  async (data: CreateAgencyRequest, { rejectWithValue }) => {
    try {
      const agency = await governmentAgencyService.create(data)
      return agency
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create government agency')
    }
  }
)

// Async thunk for updating an agency
export const updateAgencyAsync = createAsyncThunk(
  'governmentAgencies/updateAgency',
  async ({ id, data }: { id: string; data: UpdateAgencyRequest }, { rejectWithValue }) => {
    try {
      const agency = await governmentAgencyService.update(id, data)
      return agency
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update government agency')
    }
  }
)

// Async thunk for deleting an agency
export const deleteAgencyAsync = createAsyncThunk(
  'governmentAgencies/deleteAgency',
  async (id: string, { rejectWithValue }) => {
    try {
      await governmentAgencyService.delete(id)
      return id
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete government agency')
    }
  }
)

// Async thunk for inviting an employee
export const inviteEmployeeAsync = createAsyncThunk(
  'governmentAgencies/inviteEmployee',
  async (data: InviteEmployeeRequest, { rejectWithValue }) => {
    try {
      const response = await governmentAgencyService.inviteEmployee(data)
      return { ...response, agencyId: data.agencyId }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to invite employee')
    }
  }
)

// Async thunk for deleting an employee
export const deleteEmployeeAsync = createAsyncThunk(
  'governmentAgencies/deleteEmployee',
  async (userId: string, { rejectWithValue }) => {
    try {
      await governmentAgencyService.deleteEmployee(userId)
      return userId
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete employee')
    }
  }
)

const governmentAgenciesSlice = createSlice({
  name: 'governmentAgencies',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    // Fetch agencies cases
    builder
      .addCase(fetchAgenciesAsync.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchAgenciesAsync.fulfilled, (state, action: PayloadAction<GovernmentAgency[]>) => {
        state.isLoading = false
        state.agencies = action.payload
        state.error = null
      })
      .addCase(fetchAgenciesAsync.rejected, (state, action) => {
        state.isLoading = false
        state.error = (action.payload as string) || 'Failed to fetch government agencies'
      })

    // Create agency cases
    builder
      .addCase(createAgencyAsync.pending, (state) => {
        state.error = null
      })
      .addCase(createAgencyAsync.fulfilled, (state, action: PayloadAction<GovernmentAgency>) => {
        state.agencies.push(action.payload)
        state.error = null
      })
      .addCase(createAgencyAsync.rejected, (state, action) => {
        state.error = (action.payload as string) || 'Failed to create government agency'
      })

    // Update agency cases
    builder
      .addCase(updateAgencyAsync.pending, (state) => {
        state.error = null
      })
      .addCase(updateAgencyAsync.fulfilled, (state, action: PayloadAction<GovernmentAgency>) => {
        if (action.payload && action.payload.id) {
          const index = state.agencies.findIndex((agency) => agency.id === action.payload.id)
          if (index !== -1) {
            state.agencies[index] = action.payload
          }
        }
        state.error = null
      })
      .addCase(updateAgencyAsync.rejected, (state, action) => {
        state.error = (action.payload as string) || 'Failed to update government agency'
      })

    // Delete agency cases
    builder
      .addCase(deleteAgencyAsync.pending, (state) => {
        state.error = null
      })
      .addCase(deleteAgencyAsync.fulfilled, (state, action: PayloadAction<string>) => {
        state.agencies = state.agencies.filter((agency) => agency.id !== action.payload)
        state.error = null
      })
      .addCase(deleteAgencyAsync.rejected, (state, action) => {
        state.error = (action.payload as string) || 'Failed to delete government agency'
      })

    // Invite employee cases
    builder
      .addCase(inviteEmployeeAsync.pending, (state) => {
        state.error = null
      })
      .addCase(inviteEmployeeAsync.fulfilled, (state, action) => {
        // The employee will be added to the agency when we refetch
        // For now, we just clear the error
        state.error = null
      })
      .addCase(inviteEmployeeAsync.rejected, (state, action) => {
        state.error = (action.payload as string) || 'Failed to invite employee'
      })

    // Delete employee cases
    builder
      .addCase(deleteEmployeeAsync.pending, (state) => {
        state.error = null
      })
      .addCase(deleteEmployeeAsync.fulfilled, (state, action: PayloadAction<string>) => {
        // Remove employee from all agencies
        state.agencies.forEach((agency) => {
          agency.employees = agency.employees.filter((employee) => employee.id !== action.payload)
        })
        state.error = null
      })
      .addCase(deleteEmployeeAsync.rejected, (state, action) => {
        state.error = (action.payload as string) || 'Failed to delete employee'
      })
  },
})

export const { clearError } = governmentAgenciesSlice.actions
export default governmentAgenciesSlice.reducer
