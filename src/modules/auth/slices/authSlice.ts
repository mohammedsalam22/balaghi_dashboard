import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { authService } from '../services/authService'
import apiService from '../../../shared/services/apiService'
import type { LoginCredentials } from '../types'

interface AuthState {
  accessToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  expiresAt: string | null
  roles: string[]
}

// Initialize token in apiService if it exists in localStorage
const storedToken = localStorage.getItem('accessToken')
const storedRoles = localStorage.getItem('userRoles')
if (storedToken) {
  apiService.setAuthToken(storedToken)
}

const initialState: AuthState = {
  accessToken: storedToken,
  isAuthenticated: !!storedToken,
  isLoading: false,
  error: null,
  expiresAt: localStorage.getItem('tokenExpiresAt'),
  roles: storedRoles ? JSON.parse(storedRoles) : [],
}

// Async thunk for login
export const loginAsync = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials)
      return response
    } catch (error: any) {
      return rejectWithValue(error.message || 'Login failed')
    }
  }
)

// Async thunk for refreshing token
export const refreshTokenAsync = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.refreshToken()
      return response
    } catch (error: any) {
      return rejectWithValue(error.message || 'Token refresh failed')
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.accessToken = null
      state.isAuthenticated = false
      state.error = null
      state.expiresAt = null
      state.roles = []
      localStorage.removeItem('accessToken')
      localStorage.removeItem('tokenExpiresAt')
      localStorage.removeItem('userRoles')
      // Clear auth token from apiService
      apiService.clearAuthToken()
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    // Login cases
    builder
      .addCase(loginAsync.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loginAsync.fulfilled, (state, action: PayloadAction<{ accessToken: string; roles: string[]; accessTokenExpiresAt: string }>) => {
        state.isLoading = false
        state.isAuthenticated = true
        state.accessToken = action.payload.accessToken
        state.roles = action.payload.roles || []
        state.error = null
        
        // Store token in localStorage
        localStorage.setItem('accessToken', action.payload.accessToken)
        
        // Store roles in localStorage
        localStorage.setItem('userRoles', JSON.stringify(action.payload.roles || []))
        
        // Use the expiration time from the response
        state.expiresAt = action.payload.accessTokenExpiresAt
        localStorage.setItem('tokenExpiresAt', action.payload.accessTokenExpiresAt)
        
        // Set token in apiService
        apiService.setAuthToken(action.payload.accessToken)
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.isLoading = false
        state.isAuthenticated = false
        state.error = (action.payload as string) || 'Login failed'
        state.accessToken = null
      })

    // Refresh token cases
    builder
      .addCase(refreshTokenAsync.pending, (state) => {
        // Don't set loading to true to avoid UI flicker
        state.error = null
      })
      .addCase(refreshTokenAsync.fulfilled, (state, action: PayloadAction<{ accessToken: string; expiresAt: string }>) => {
        state.accessToken = action.payload.accessToken
        state.expiresAt = action.payload.expiresAt
        state.isAuthenticated = true
        state.error = null
        
        // Update token in localStorage
        localStorage.setItem('accessToken', action.payload.accessToken)
        localStorage.setItem('tokenExpiresAt', action.payload.expiresAt)
        
        // Update token in apiService
        apiService.setAuthToken(action.payload.accessToken)
      })
      .addCase(refreshTokenAsync.rejected, (state, action) => {
        // If refresh fails, logout the user
        state.accessToken = null
        state.isAuthenticated = false
        state.expiresAt = null
        state.roles = []
        state.error = (action.payload as string) || 'Token refresh failed'
        localStorage.removeItem('accessToken')
        localStorage.removeItem('tokenExpiresAt')
        localStorage.removeItem('userRoles')
        
        apiService.clearAuthToken()
      })
  },
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer

