import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { TokenRefreshManager } from './tokenRefreshManager'
import { ErrorTransformer } from './errorTransformer'

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


class ApiService {
  private axiosInstance: AxiosInstance
  private baseURL: string
  private tokenRefreshManager: TokenRefreshManager
  private errorTransformer: ErrorTransformer

  constructor(baseURL?: string) {
    this.baseURL = baseURL || import.meta.env.VITE_API_BASE_URL || '/api'
    
    this.tokenRefreshManager = new TokenRefreshManager()
    this.errorTransformer = new ErrorTransformer()
    
    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
      timeout: 30000, 
      withCredentials: true, 
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.setupInterceptors()
  }


  private setupInterceptors(): void {
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = this.getAuthToken()
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }

        
        if (import.meta.env.DEV) {
          console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
            baseURL: config.baseURL,
            withCredentials: config.withCredentials,
            origin: window.location.origin,
          })
        }

        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response
      },
      async (error: AxiosError) => {
        if (error.response) {
          const status = error.response.status

          switch (status) {
            case 401:
              try {
                const retryResponse = await this.tokenRefreshManager.handleUnauthorized(
                  error,
                  this.axiosInstance,
                  () => this.getAuthToken(),
                  () => this.clearAllAuth()
                )
                if (retryResponse) {
                  return retryResponse
                }
              } catch (refreshError) {
                this.clearAllAuth()
                return Promise.reject(this.errorTransformer.transform(error))
              }
              break
            default:
              this.errorTransformer.logStatusError(status, error)
              break
          }
        } else if (error.request) {
          this.errorTransformer.logNetworkError(error)
        }

        return Promise.reject(this.errorTransformer.transform(error))
      }
    )
  }


  private getAuthToken(): string | null {
    return localStorage.getItem('accessToken') || localStorage.getItem('authToken') || sessionStorage.getItem('authToken')
  }

  
  private clearAllAuth(): void {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('authToken')
    sessionStorage.removeItem('authToken')
    localStorage.removeItem('tokenExpiresAt')
    localStorage.removeItem('userRoles')
    this.clearAuthToken()
  }

  /**
   * GET request
   */
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.axiosInstance.get<ApiResponse<T> | T>(url, config)
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
      if (response.data && typeof response.data === 'object' && 'data' in response.data) {
        return (response.data as ApiResponse<T>).data
      }
      return response.data as T
    } catch (error) {
      throw error
    }
  }

 
  setBaseURL(baseURL: string): void {
    this.baseURL = baseURL
    this.axiosInstance.defaults.baseURL = baseURL
  }

  
  setHeader(key: string, value: string): void {
    this.axiosInstance.defaults.headers.common[key] = value
  }

  
  removeHeader(key: string): void {
    delete this.axiosInstance.defaults.headers.common[key]
  }


  setAuthToken(token: string): void {
    this.setHeader('Authorization', `Bearer ${token}`)
    localStorage.setItem('accessToken', token)
  }


  clearAuthToken(): void {
    this.removeHeader('Authorization')
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('authToken')
    sessionStorage.removeItem('authToken')
    localStorage.removeItem('tokenExpiresAt')
  }

  
  getAxiosInstance(): AxiosInstance {
    return this.axiosInstance
  }
}

// Create and export a singleton instance
export const apiService = new ApiService()

// Also export the class for creating custom instances if needed
export { ApiService }

// Export default as the singleton instance 
export default apiService
