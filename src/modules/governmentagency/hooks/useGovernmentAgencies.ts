import { useState, useEffect } from 'react'
import type { GovernmentAgency } from '../types'
import { governmentAgencyService } from '../services/governmentAgencyService'

export function useGovernmentAgencies() {
  const [agencies, setAgencies] = useState<GovernmentAgency[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    loadAgencies()
  }, [])

  const loadAgencies = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await governmentAgencyService.getAll()
      setAgencies(data)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load government agencies'))
    } finally {
      setLoading(false)
    }
  }

  return {
    agencies,
    loading,
    error,
    refetch: loadAgencies,
  }
}

