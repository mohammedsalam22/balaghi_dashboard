import { useState, useMemo } from 'react'
import type { Complaint, ComplaintStatus } from '../types'

export type FilterStatus = ComplaintStatus | 'All Status'

interface UseComplaintFiltersProps {
  complaints: Complaint[]
  initialSearchQuery?: string
  initialStatusFilter?: FilterStatus
}

export function useComplaintFilters({
  complaints,
  initialSearchQuery = '',
  initialStatusFilter = 'All Status',
}: UseComplaintFiltersProps) {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery)
  const [statusFilter, setStatusFilter] = useState<FilterStatus>(initialStatusFilter)

  const filteredComplaints = useMemo(() => {
    return complaints.filter((complaint) => {
      const searchLower = searchQuery.toLowerCase()
      const matchesSearch =
        complaint.trackingNumber.toLowerCase().includes(searchLower) ||
        complaint.complaintType.toLowerCase().includes(searchLower) ||
        complaint.description.toLowerCase().includes(searchLower) ||
        complaint.citizenName.toLowerCase().includes(searchLower) ||
        complaint.agencyName.toLowerCase().includes(searchLower)

      const matchesStatus = statusFilter === 'All Status' || complaint.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [complaints, searchQuery, statusFilter])

  return {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    filteredComplaints,
  }
}
