import { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../../shared/store/hooks'
import type { ComplaintStatus } from '../types'
import { updateComplaintStatusAsync } from '../slices/complaintsSlice'

interface UseComplaintStatusUpdateProps {
  complaintId: string
  currentStatus: ComplaintStatus
  onSuccess?: (newStatus: ComplaintStatus) => void
}

export function useComplaintStatusUpdate({ complaintId, currentStatus, onSuccess }: UseComplaintStatusUpdateProps) {
  const dispatch = useAppDispatch()
  const { error: complaintsError } = useAppSelector((state) => state.complaints)
  
  const [updateError, setUpdateError] = useState<string | null>(null)
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [pendingStatus, setPendingStatus] = useState<ComplaintStatus | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  // Sync error from Redux state
  useEffect(() => {
    if (complaintsError) {
      setUpdateError(complaintsError)
    }
  }, [complaintsError])

  const handleStatusChange = (newStatus: ComplaintStatus) => {
    if (newStatus === currentStatus) return
    setPendingStatus(newStatus)
    setConfirmDialogOpen(true)
  }

  const handleConfirmStatusUpdate = async () => {
    if (!pendingStatus) return

    const newStatus = pendingStatus
    setIsUpdating(true)
    setUpdateError(null)
    setUpdateSuccess(false)
    setConfirmDialogOpen(false)

    try {
      const result = await dispatch(updateComplaintStatusAsync({ id: complaintId, status: newStatus }))
      
      if (updateComplaintStatusAsync.fulfilled.match(result)) {
        setUpdateSuccess(true)
        if (onSuccess) {
          onSuccess(newStatus)
        }
        setTimeout(() => setUpdateSuccess(false), 2000)
      } else {
        setUpdateError(result.payload as string || 'Failed to update status')
      }
    } catch (error) {
      setUpdateError(error instanceof Error ? error.message : 'Failed to update status')
    } finally {
      setIsUpdating(false)
      setPendingStatus(null)
    }
  }

  const handleCancelStatusUpdate = () => {
    setConfirmDialogOpen(false)
    setPendingStatus(null)
  }

  return {
    isUpdating,
    updateError,
    updateSuccess,
    confirmDialogOpen,
    pendingStatus,
    handleStatusChange,
    handleConfirmStatusUpdate,
    handleCancelStatusUpdate,
    setUpdateSuccess,
    setUpdateError,
  }
}
