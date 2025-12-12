// Government Agency types
export interface Employee {
  id: string
  userName: string
  email: string
}

export interface GovernmentAgency {
  id: string
  name: string
  employees: Employee[]
}

export interface GovernmentAgencyApiResponse {
  message: string
  success: boolean
  data: GovernmentAgency[]
}

