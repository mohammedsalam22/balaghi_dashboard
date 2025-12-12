import apiService from '../../../shared/services/apiService'
import type { GovernmentAgency } from '../types'

export interface CreateAgencyRequest {
  name: string
}

export interface UpdateAgencyRequest {
  name: string
}

export interface InviteEmployeeRequest {
  agencyId: string
  fullName: string
  email: string
}

export interface InviteEmployeeResponse {
  success: boolean
  message: string
  userId: string
}

export const governmentAgencyService = {
  // Get all government agencies
  getAll: async (): Promise<GovernmentAgency[]> => {
    try {
      // apiService.get automatically unwraps the 'data' property from the API response
      const agencies = await apiService.get<GovernmentAgency[]>('/GovernmentAgency')
      return agencies || []
    } catch (error) {
      console.error('Error fetching government agencies:', error)
      throw error
    }
  },

  // Get agency by ID
  getById: async (id: string): Promise<GovernmentAgency | undefined> => {
    try {
      const agencies = await governmentAgencyService.getAll()
      return agencies.find((agency) => agency.id === id)
    } catch (error) {
      console.error('Error fetching government agency:', error)
      throw error
    }
  },

  // Create a new agency
  create: async (data: CreateAgencyRequest): Promise<GovernmentAgency> => {
    try {
      const agency = await apiService.post<GovernmentAgency>('/GovernmentAgency', data)
      return agency
    } catch (error) {
      console.error('Error creating government agency:', error)
      throw error
    }
  },

  // Update an agency
  update: async (id: string, data: UpdateAgencyRequest): Promise<GovernmentAgency> => {
    try {
      const agency = await apiService.put<GovernmentAgency>(`/GovernmentAgency/${id}`, data)
      return agency
    } catch (error) {
      console.error('Error updating government agency:', error)
      throw error
    }
  },

  // Delete an agency
  delete: async (id: string): Promise<void> => {
    try {
      await apiService.delete(`/GovernmentAgency/${id}`)
    } catch (error) {
      console.error('Error deleting government agency:', error)
      throw error
    }
  },

  // Invite an employee to an agency
  inviteEmployee: async (data: InviteEmployeeRequest): Promise<InviteEmployeeResponse> => {
    try {
      const response = await apiService.post<InviteEmployeeResponse>('/admin/invite-employee', data)
      return response
    } catch (error) {
      console.error('Error inviting employee:', error)
      throw error
    }
  },

  // Delete an employee
  deleteEmployee: async (userId: string): Promise<void> => {
    try {
      await apiService.delete(`/admin/employee/${userId}`)
    } catch (error) {
      console.error('Error deleting employee:', error)
      throw error
    }
  },
}

