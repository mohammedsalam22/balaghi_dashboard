import type { AxiosError } from 'axios'
import type { ApiError } from './apiService'

/**
 * Transforms axios errors into standardized ApiError format
 * Handles various error scenarios including CORS, network, and HTTP errors
 */
export class ErrorTransformer {

  transform(error: AxiosError): ApiError {
    if (error.response) {
      return this.transformResponseError(error)
    } else if (error.request) {
      return this.transformRequestError(error)
    } else {
      return {
        message: error.message || 'An unexpected error occurred',
      }
    }
  }


  private transformResponseError(error: AxiosError): ApiError {
    const data = error.response!.data as any
    let message = data?.message || error.message || 'An error occurred'

    if (error.response!.status === 405) {
      const method = error.config?.method?.toUpperCase() || ''
      if (method === 'OPTIONS') {
        message =
          'CORS preflight failed: Backend must allow OPTIONS requests and return proper CORS headers (Access-Control-Allow-Origin, Access-Control-Allow-Methods, Access-Control-Allow-Credentials).'
      } else {
        message = `Method ${method} not allowed on this endpoint.`
      }
    }

    return {
      message,
      status: error.response!.status,
      errors: data?.errors,
    }
  }

 
  private transformRequestError(error: AxiosError): ApiError {
    const errorMessage = error.message || ''
    const errorCode = (error as any).code || ''
    let message = 'Network error - no response received'

    if (!error.response && errorMessage.includes('Network Error')) {
      const currentOrigin =
        typeof window !== 'undefined' ? window.location.origin : 'unknown'
      message =
        `CORS Error: Request from "${currentOrigin}" was blocked. Backend must allow this exact origin:\n` +
        `1. Set Access-Control-Allow-Origin to "${currentOrigin}" (NOT "*" - must be exact when using credentials)\n` +
        `2. Allow OPTIONS preflight requests and return 200/204\n` +
        `3. Return Access-Control-Allow-Methods: "POST, OPTIONS, GET, PUT, DELETE, PATCH"\n` +
        `4. Return Access-Control-Allow-Headers: "Content-Type, Authorization"\n` +
        `5. Return Access-Control-Allow-Credentials: "true" (required)\n` +
        `\nCheck browser DevTools → Network tab → look for the OPTIONS request to see what headers backend returns.`
    } else if (
      errorMessage.includes('ERR_EMPTY_RESPONSE') ||
      errorCode.includes('ERR_EMPTY_RESPONSE')
    ) {
      message =
        'Server closed connection without response. This often indicates a CORS preflight (OPTIONS) request failed. Check backend CORS configuration.'
    } else if (
      errorMessage.includes('ERR_CONNECTION_REFUSED') ||
      errorCode.includes('ERR_CONNECTION_REFUSED')
    ) {
      message =
        'Connection refused. Make sure the backend server is running on http://localhost:5001'
    } else if (
      errorMessage.includes('ERR_NETWORK') ||
      errorCode.includes('ERR_NETWORK')
    ) {
      message =
        'Network error. This is often a CORS issue. Check browser console for detailed CORS error messages.'
    } else if (
      errorMessage.includes('timeout') ||
      errorCode.includes('ECONNABORTED')
    ) {
      message = 'Request timeout. The server took too long to respond.'
    }

    if (import.meta.env.DEV) {
      console.error('[API Error] No response received:', {
        message: errorMessage,
        code: errorCode,
        config:
          error.config?.method?.toUpperCase() + ' ' + error.config?.url,
      })
    }

    return {
      message,
    }
  }


  logStatusError(status: number, error: AxiosError): void {
    switch (status) {
      case 403:
        console.error('Access forbidden')
        break
      case 404:
        console.error('Resource not found')
        break
      case 405:
        console.error(
          'Method not allowed - CORS configuration issue. Ensure backend allows OPTIONS requests.'
        )
        break
      case 500:
        console.error('Server error')
        break
    }
  }


  logNetworkError(error: AxiosError): void {
    const errorMessage = error.message || ''
    if (errorMessage.includes('ERR_EMPTY_RESPONSE')) {
      console.error(
        'Server closed connection - check if backend is running on http://localhost:5001'
      )
    } else if (errorMessage.includes('ERR_CONNECTION_REFUSED')) {
      console.error(
        'Connection refused - backend server is not running or not accessible on http://localhost:5001'
      )
    } else {
      console.error('Network error - no response received from server')
    }
  }
}

