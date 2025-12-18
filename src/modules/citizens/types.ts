// Citizens module types

export interface Citizen {
  id: string
  fullName: string
  email: string
  isEmailVerified: boolean
  createdAt: string
}

export type CitizensSort =
  | 'createdAtDesc'
  | 'createdAtAsc'
  | 'fullNameAsc'
  | 'fullNameDesc'
  | 'emailAsc'
  | 'emailDesc'

export interface CitizensListQuery {
  page?: number
  pageSize?: number
  q?: string
  isEmailVerified?: boolean
  createdFrom?: string
  createdTo?: string
  sort?: CitizensSort
}

export interface CitizensListResponse {
  success: boolean
  page: number
  pageSize: number
  totalCount: number
  totalPages: number
  data: Citizen[]
}

