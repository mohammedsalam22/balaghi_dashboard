// Complaint types
export type ComplaintStatus = 'Pending' | 'UnderReview' | 'InProgress' | 'Resolved' | 'Rejected'

export interface ComplaintAttachment {
  id: string
  fileName: string
  url: string
  contentType: string
  uploadedAt: string
}

export interface Complaint {
  id: string
  trackingNumber: string
  complaintType: string
  description: string
  citizenName: string
  agencyName: string
  status: ComplaintStatus
  createdAt: string
  attachmentsCount: number
  attachments: ComplaintAttachment[]
}
