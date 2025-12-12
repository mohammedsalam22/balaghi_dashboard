import { useState, useMemo } from 'react'
import type { Complaint, ComplaintStatus, ComplaintPriority } from '../types'

export type FilterStatus = ComplaintStatus | 'All Status'
export type FilterPriority = ComplaintPriority | 'All Priority'

interface UseComplaintFiltersProps {
  complaints: Complaint[]
  initialSearchQuery?: string
  initialStatusFilter?: FilterStatus
  initialPriorityFilter?: FilterPriority
}

export function useComplaintFilters({
  complaints,
  initialSearchQuery = '',
  initialStatusFilter = 'All Status',
  initialPriorityFilter = 'All Priority',
}: UseComplaintFiltersProps) {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery)
  const [statusFilter, setStatusFilter] = useState<FilterStatus>(initialStatusFilter)
  const [priorityFilter, setPriorityFilter] = useState<FilterPriority>(initialPriorityFilter)

  const filteredComplaints = useMemo(() => {
    return complaints.filter((complaint) => {
      const matchesSearch =
        complaint.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        complaint.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        complaint.reporter.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = statusFilter === 'All Status' || complaint.status === statusFilter
      const matchesPriority = priorityFilter === 'All Priority' || complaint.priority === priorityFilter

      return matchesSearch && matchesStatus && matchesPriority
    })
  }, [complaints, searchQuery, statusFilter, priorityFilter])

  return {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    filteredComplaints,
  }
}

