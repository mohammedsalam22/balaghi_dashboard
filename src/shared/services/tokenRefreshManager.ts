import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'

interface QueuedRequest {
  resolve: (value?: any) => void
  reject: (error?: any) => void
}


export class TokenRefreshManager {
  private isRefreshing: boolean = false
  private failedQueue: QueuedRequest[] = []


  async handleUnauthorized(
    error: AxiosError,
    axiosInstance: AxiosInstance,
    getAuthToken: () => string | null,
    clearAllAuth: () => void
  ): Promise<AxiosResponse | null> {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }

    // If this is a refresh token request that failed, don't try to refresh again
    if (originalRequest?.url?.includes('/auth/refresh-token')) {
      clearAllAuth()
      return null
    }

    // If request was already retried, don't try again
    if (originalRequest?._retry) {
      return null
    }

    // If we're already refreshing, queue this request and wait
    if (this.isRefreshing) {
      return new Promise((resolve, reject) => {
        this.failedQueue.push({
          resolve: () => {
            // Retry the original request after token is refreshed
            if (originalRequest) {
              originalRequest._retry = true
              const token = getAuthToken()
              if (token && originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`
              }
              axiosInstance(originalRequest).then(resolve).catch(reject)
            } else {
              resolve(null as any)
            }
          },
          reject,
        })
      })
    }

    // Check if we have a refresh token
    const refreshToken = localStorage.getItem('refreshToken')
    if (!refreshToken) {
      // No refresh token available, clear everything
      clearAllAuth()
      return null
    }

    // Try to refresh the token
    this.isRefreshing = true

    try {
      // Import authService dynamically to avoid circular dependency
      const { authService } = await import('../../modules/auth/services/authService')
      const response = await authService.refreshToken()

      // Update stored token
      const newToken = response.accessToken
      localStorage.setItem('accessToken', newToken)
      if (response.expiresAt) {
        localStorage.setItem('tokenExpiresAt', response.expiresAt)
      }

      // Process all queued requests
      this.failedQueue.forEach(({ resolve }) => resolve())
      this.failedQueue = []

      // Retry the original request if it exists
      if (originalRequest) {
        originalRequest._retry = true
        originalRequest.headers = originalRequest.headers || {}
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return axiosInstance(originalRequest)
      }

      return null
    } catch (refreshError) {
      // Refresh failed, clear everything and reject queued requests
      this.failedQueue.forEach(({ reject }) => reject(refreshError))
      this.failedQueue = []
      clearAllAuth()
      throw refreshError
    } finally {
      this.isRefreshing = false
    }
  }
}

