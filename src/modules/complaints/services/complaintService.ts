import apiService from '../../../shared/services/apiService'
import type { Complaint } from '../types'

export interface ComplaintsResponse {
  success: boolean
  data: Complaint[]
}

export const complaintService = {
  getAll: async (): Promise<Complaint[]> => {
    try {
      const response = await apiService.get<Complaint[]>('/complaints/my-agency')
      return response || []
    } catch (error) {
      console.error('Error fetching complaints:', error)
      throw error
    }
  },

  getById: async (id: string): Promise<Complaint | undefined> => {
    try {
      const complaints = await complaintService.getAll()
      return complaints.find((complaint) => complaint.id === id)
    } catch (error) {
      console.error('Error fetching complaint:', error)
      throw error
    }
  },

  updateStatus: async (id: string, status: string): Promise<void> => {
    try {
      await apiService.patch(`/complaints/${id}/status`, { status })
    } catch (error) {
      console.error('Error updating complaint status:', error)
      throw error
    }
  },

  getAttachmentUrl: (attachmentUrl: string): string => {
    if (attachmentUrl.startsWith('http://') || attachmentUrl.startsWith('https://')) {
      return attachmentUrl
    }
    
    const axiosInstance = apiService.getAxiosInstance()
    let baseURL = axiosInstance.defaults.baseURL || ''
    
    
    if (baseURL.startsWith('/')) {
      baseURL = import.meta.env.VITE_API_BASE_URL || ''
    }
    
    baseURL = baseURL.replace(/\/api\/?$/, '')
    
    if (!baseURL || (!baseURL.startsWith('http://') && !baseURL.startsWith('https://'))) {
      // Last resort fallback
      baseURL = window.location.origin
    }
    
    const cleanBaseURL = baseURL.replace(/\/$/, '')
    const cleanAttachmentUrl = attachmentUrl.startsWith('/') ? attachmentUrl : `/${attachmentUrl}`
    return `${cleanBaseURL}${cleanAttachmentUrl}`
  },
}

