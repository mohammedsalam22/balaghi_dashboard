import apiService from '../../../shared/services/apiService'
import type { LoginCredentials } from '../types'

export interface LoginResponse {
  accessToken: string
  roles: string[]
  refreshToken: string
  accessTokenExpiresAt: string
}

export interface RefreshTokenResponse {
  accessToken: string
  expiresAt: string
}

export interface CompleteSetupRequest {
  code: string
  newPassword: string
}

export interface CompleteSetupResponse {
  success: boolean
  message: string
}

export const authService = {
  /**
   * Login with email and password
   * Returns accessToken and sets refreshToken as HTTP-only cookie
   */
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    return apiService.post<LoginResponse>('/auth/login', credentials)
  },

  /**
   * Refresh access token using refresh token from HTTP-only cookie
   * Returns new accessToken and updates refreshToken cookie
   */
  refreshToken: async (): Promise<RefreshTokenResponse> => {
    return apiService.post<RefreshTokenResponse>('/auth/refresh-token')
  },

  /**
   * Complete first-time login setup for employees
   * Requires verification code and new password
   */
  completeSetup: async (data: CompleteSetupRequest): Promise<CompleteSetupResponse> => {
    return apiService.post<CompleteSetupResponse>('/admin/complete-setup', data)
  },
}

