import { useState, useEffect } from 'react'
import type { Complaint } from '../types'
import { complaintService } from '../services/complaintService'

export function useComplaints() {
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    loadComplaints()
  }, [])

  const loadComplaints = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await complaintService.getAll()
      setComplaints(data)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load complaints'))
    } finally {
      setLoading(false)
    }
  }

  return {
    complaints,
    loading,
    error,
    refetch: loadComplaints,
  }
}

