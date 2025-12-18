import apiService from '../../../shared/services/apiService'
import type { CitizensListQuery, CitizensListResponse } from '../types'

export const citizenService = {
  list: async (query?: CitizensListQuery): Promise<CitizensListResponse> => {
    try {
      const params: Record<string, any> = {
        page: query?.page ?? 1,
        pageSize: query?.pageSize ?? 50,
        q: query?.q?.trim() ? query.q.trim() : undefined,
        isEmailVerified: query?.isEmailVerified,
        createdFrom: query?.createdFrom,
        createdTo: query?.createdTo,
        sort: query?.sort ?? 'createdAtDesc',
      }

      // Remove undefined params so we don't send them
      Object.keys(params).forEach((k) => params[k] === undefined && delete params[k])

      // IMPORTANT: apiService.get() auto-unwraps "data", so we must use axios directly
      // to keep paging metadata (page/pageSize/totalCount/totalPages).
      const axiosInstance = apiService.getAxiosInstance()
      const response = await axiosInstance.get<CitizensListResponse>('/admin/citizens', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching citizens:', error)
      throw error
    }
  },
}

