import { useState } from 'react'
import { useAppDispatch } from '../../../shared/store/hooks'
import { deleteAgencyAsync } from '../slices/governmentAgenciesSlice'
import type { GovernmentAgency } from '../types'

interface UseAgencyDeleteProps {
  onSuccess?: () => void
}

export function useAgencyDelete({ onSuccess }: UseAgencyDeleteProps = {}) {
  const dispatch = useAppDispatch()
  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean
    agencyId: string | null
    agencyName: string
  }>({
    open: false,
    agencyId: null,
    agencyName: '',
  })

  const handleDeleteClick = (agency: GovernmentAgency) => {
    setDeleteConfirm({
      open: true,
      agencyId: agency.id,
      agencyName: agency.name,
    })
  }

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm.agencyId) return

    try {
      const result = await dispatch(deleteAgencyAsync(deleteConfirm.agencyId))
      if (deleteAgencyAsync.fulfilled.match(result)) {
        setDeleteConfirm({ open: false, agencyId: null, agencyName: '' })
        onSuccess?.()
      }
    } catch (error) {
      console.error('Failed to delete agency:', error)
    }
  }

  const handleDeleteCancel = () => {
    setDeleteConfirm({ open: false, agencyId: null, agencyName: '' })
  }

  return {
    deleteConfirm,
    handleDeleteClick,
    handleDeleteConfirm,
    handleDeleteCancel,
  }
}
