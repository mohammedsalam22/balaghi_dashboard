import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'

export interface ApiResponse<T = any> {
  data: T
  message?: string
  status: number
}

export interface ApiError {
  message: string
  status?: number
  errors?: Record<string, string[]>
}

/**
 * API Service class for making HTTP requests using axios
 * Provides a centralized way to handle API calls with interceptors, error handling, and type safety
 */
class ApiService {
  private axiosInstance: AxiosInstance
  private baseURL: string

  constructor(baseURL?: string) {
    // Default to environment variable or relative path
    this.baseURL = baseURL || import.meta.env.VITE_API_BASE_URL || '/api'
    
    // Create axios instance with default config
    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
      timeout: 30000, // 30 seconds
      withCredentials: true, // Enable sending cookies (needed for refresh token HTTP-only cookie)
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.setupInterceptors()
  }

  /**
   * Setup request and response interceptors
   */
  private setupInterceptors(): void {
    // Request interceptor - add auth token, modify request, etc.
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // Get auth token from localStorage or wherever you store it
        const token = this.getAuthToken()
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }

        // Debug logging (can be removed in production)
        if (import.meta.env.DEV) {
          console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
            baseURL: config.baseURL,
            withCredentials: config.withCredentials,
            origin: window.location.origin,
          })
        }

        // You can add other common headers or modify request here
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Response interceptor - handle common response transformations
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        // You can transform response data here if needed
        return response
      },
      (error: AxiosError) => {
        // Handle common errors (401, 403, 500, etc.)
        if (error.response) {
          const status = error.response.status

          switch (status) {
            case 401:
              // Unauthorized - clear token and redirect to login
              this.handleUnauthorized()
              break
            case 403:
              // Forbidden
              console.error('Access forbidden')
              break
            case 404:
              // Not found
              console.error('Resource not found')
              break
            case 405:
              // Method not allowed (often CORS preflight OPTIONS request issue)
              console.error('Method not allowed - CORS configuration issue. Ensure backend allows OPTIONS requests.')
              break
            case 500:
              // Server error
              console.error('Server error')
              break
          }
        } else if (error.request) {
          // Request was made but no response received
          const errorMessage = error.message || ''
          if (errorMessage.includes('ERR_EMPTY_RESPONSE')) {
            console.error('Server closed connection - check if backend is running on http://localhost:5001')
          } else if (errorMessage.includes('ERR_CONNECTION_REFUSED')) {
            console.error('Connection refused - backend server is not running or not accessible on http://localhost:5001')
          } else {
            console.error('Network error - no response received from server')
          }
        }

        return Promise.reject(this.transformError(error))
      }
    )
  }

  /**
   * Get authentication token from storage
   * Override this method to customize token retrieval
   */
  private getAuthToken(): string | null {
    // Check accessToken first (used by auth slice), then fallback to authToken
    return localStorage.getItem('accessToken') || localStorage.getItem('authToken') || sessionStorage.getItem('authToken')
  }

  /**
   * Handle unauthorized access (401)
   * Override this method to customize behavior
   */
  private handleUnauthorized(): void {
    // Clear auth tokens (both accessToken and authToken for compatibility)
    localStorage.removeItem('accessToken')
    localStorage.removeItem('authToken')
    sessionStorage.removeItem('authToken')
    localStorage.removeItem('tokenExpiresAt')
    
    // Redirect to login or dispatch logout action
    // window.location.href = '/login'
    console.warn('Unauthorized access - token cleared')
  }

  /**
   * Transform axios error to ApiError format
   */
  private transformError(error: AxiosError): ApiError {
    if (error.response) {
      const data = error.response.data as any
      let message = data?.message || error.message || 'An error occurred'
      
      // Provide helpful message for CORS issues (405 on OPTIONS request)
      if (error.response.status === 405) {
        const method = error.config?.method?.toUpperCase() || ''
        if (method === 'OPTIONS') {
          message = 'CORS preflight failed: Backend must allow OPTIONS requests and return proper CORS headers (Access-Control-Allow-Origin, Access-Control-Allow-Methods, Access-Control-Allow-Credentials).'
        } else {
          message = `Method ${method} not allowed on this endpoint.`
        }
      }
      
      return {
        message,
        status: error.response.status,
        errors: data?.errors,
      }
    } else if (error.request) {
      // Request was made but no response received (network error, server down, CORS blocking, etc.)
      const errorMessage = error.message || ''
      const errorCode = (error as any).code || ''
      let message = 'Network error - no response received'
      
      // Check if this is a CORS issue (no response usually means CORS preflight failed)
      if (!error.response && errorMessage.includes('Network Error')) {
        const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'unknown'
        message = `CORS Error: Request from "${currentOrigin}" was blocked. Backend must allow this exact origin:\n` +
          `1. Set Access-Control-Allow-Origin to "${currentOrigin}" (NOT "*" - must be exact when using credentials)\n` +
          `2. Allow OPTIONS preflight requests and return 200/204\n` +
          `3. Return Access-Control-Allow-Methods: "POST, OPTIONS, GET, PUT, DELETE, PATCH"\n` +
          `4. Return Access-Control-Allow-Headers: "Content-Type, Authorization"\n` +
          `5. Return Access-Control-Allow-Credentials: "true" (required)\n` +
          `\nCheck browser DevTools → Network tab → look for the OPTIONS request to see what headers backend returns.`
      } else if (errorMessage.includes('ERR_EMPTY_RESPONSE') || errorCode.includes('ERR_EMPTY_RESPONSE')) {
        message = 'Server closed connection without response. This often indicates a CORS preflight (OPTIONS) request failed. Check backend CORS configuration.'
      } else if (errorMessage.includes('ERR_CONNECTION_REFUSED') || errorCode.includes('ERR_CONNECTION_REFUSED')) {
        message = 'Connection refused. Make sure the backend server is running on http://localhost:5001'
      } else if (errorMessage.includes('ERR_NETWORK') || errorCode.includes('ERR_NETWORK')) {
        message = 'Network error. This is often a CORS issue. Check browser console for detailed CORS error messages.'
      } else if (errorMessage.includes('timeout') || errorCode.includes('ECONNABORTED')) {
        message = 'Request timeout. The server took too long to respond.'
      }
      
      // Log detailed error for debugging
      if (import.meta.env.DEV) {
        console.error('[API Error] No response received:', {
          message: errorMessage,
          code: errorCode,
          config: error.config?.method?.toUpperCase() + ' ' + error.config?.url,
        })
      }
      
      return {
        message,
      }
    } else {
      return {
        message: error.message || 'An unexpected error occurred',
      }
    }
  }

  /**
   * GET request
   */
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.axiosInstance.get<ApiResponse<T> | T>(url, config)
      // Check if response is wrapped in ApiResponse structure
      if (response.data && typeof response.data === 'object' && 'data' in response.data) {
        return (response.data as ApiResponse<T>).data
      }
      return response.data as T
    } catch (error) {
      throw error
    }
  }

  /**
   * POST request
   */
  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.axiosInstance.post<ApiResponse<T> | T>(url, data, config)
      // Check if response is wrapped in ApiResponse structure
      if (response.data && typeof response.data === 'object' && 'data' in response.data) {
        return (response.data as ApiResponse<T>).data
      }
      return response.data as T
    } catch (error) {
      throw error
    }
  }

  /**
   * PUT request
   */
  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.axiosInstance.put<ApiResponse<T> | T>(url, data, config)
      // Check if response is wrapped in ApiResponse structure
      if (response.data && typeof response.data === 'object' && 'data' in response.data) {
        return (response.data as ApiResponse<T>).data
      }
      return response.data as T
    } catch (error) {
      throw error
    }
  }

  /**
   * PATCH request
   */
  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.axiosInstance.patch<ApiResponse<T> | T>(url, data, config)
      // Check if response is wrapped in ApiResponse structure
      if (response.data && typeof response.data === 'object' && 'data' in response.data) {
        return (response.data as ApiResponse<T>).data
      }
      return response.data as T
    } catch (error) {
      throw error
    }
  }

  /**
   * DELETE request
   */
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.axiosInstance.delete<ApiResponse<T> | T>(url, config)
      // Check if response is wrapped in ApiResponse structure
      if (response.data && typeof response.data === 'object' && 'data' in response.data) {
        return (response.data as ApiResponse<T>).data
      }
      return response.data as T
    } catch (error) {
      throw error
    }
  }

  /**
   * Set base URL
   */
  setBaseURL(baseURL: string): void {
    this.baseURL = baseURL
    this.axiosInstance.defaults.baseURL = baseURL
  }

  /**
   * Set default header
   */
  setHeader(key: string, value: string): void {
    this.axiosInstance.defaults.headers.common[key] = value
  }

  /**
   * Remove default header
   */
  removeHeader(key: string): void {
    delete this.axiosInstance.defaults.headers.common[key]
  }

  /**
   * Set auth token
   */
  setAuthToken(token: string): void {
    this.setHeader('Authorization', `Bearer ${token}`)
    localStorage.setItem('accessToken', token)
  }

  /**
   * Clear auth token
   */
  clearAuthToken(): void {
    this.removeHeader('Authorization')
    localStorage.removeItem('accessToken')
    localStorage.removeItem('authToken')
    sessionStorage.removeItem('authToken')
    localStorage.removeItem('tokenExpiresAt')
  }

  /**
   * Get the underlying axios instance (for advanced usage)
   */
  getAxiosInstance(): AxiosInstance {
    return this.axiosInstance
  }
}

// Create and export a singleton instance
export const apiService = new ApiService()

// Also export the class for creating custom instances if needed
export { ApiService }

// Export default as the singleton instance (most common use case)
export default apiService
