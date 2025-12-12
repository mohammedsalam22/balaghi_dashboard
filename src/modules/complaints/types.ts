// Complaint types
export type ComplaintStatus = 'Pending' | 'In Progress' | 'Resolved'
export type ComplaintPriority = 'Low' | 'Medium' | 'High'

export interface Complaint {
  id: string
  category: string
  status: ComplaintStatus
  priority: ComplaintPriority
  title: string
  description: string
  reporter: string
  location: string
  date: string
}
