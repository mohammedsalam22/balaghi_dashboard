import { useState, useEffect } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Typography, Box, Button, Alert, Divider } from '@mui/material'
import { X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { Complaint, ComplaintStatus } from '../types'
import { useAppSelector } from '../../../shared/store/hooks'
import ConfirmationDialog from '../../../shared/components/ConfirmationDialog'
import ComplaintStatusSelector from './ComplaintStatusSelector'
import ComplaintInformation from './ComplaintInformation'
import ComplaintAttachments from './ComplaintAttachments'
import { useComplaintStatusUpdate } from '../hooks/useComplaintStatusUpdate'
import { useStatusConfig } from '../utils/complaintUtils'

interface ComplaintDetailsDialogProps {
  open: boolean
  onClose: () => void
  complaint: Complaint | null
  onStatusUpdate?: () => void
}

export default function ComplaintDetailsDialog({ open, onClose, complaint, onStatusUpdate }: ComplaintDetailsDialogProps) {
  const { t } = useTranslation('complaints')
  const statusConfig = useStatusConfig()
  const { roles } = useAppSelector((state) => state.auth)
  const [currentStatus, setCurrentStatus] = useState<ComplaintStatus | null>(null)

  const canEditStatus = roles.includes('Employee')

  // Initialize current status when complaint changes
  useEffect(() => {
    if (complaint) {
      setCurrentStatus(complaint.status)
    }
  }, [complaint])

  if (!complaint) return null

  const displayStatus = currentStatus || complaint.status

  const statusUpdateHook = useComplaintStatusUpdate({
    complaintId: complaint.id,
    currentStatus: displayStatus,
    onSuccess: (newStatus) => {
      setCurrentStatus(newStatus)
      if (onStatusUpdate) {
        onStatusUpdate()
      }
    },
  })

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '0.75rem',
          maxHeight: '90vh',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 1.5,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box>
          <Typography variant="h3" component="span" sx={{ fontSize: '1.25rem', fontWeight: 600, mr: 1 }}>
            {t('details.title')}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontSize: '0.875rem',
              color: 'text.secondary',
              fontFamily: 'monospace',
              mt: 0.5,
            }}
          >
            {complaint.trackingNumber}
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            '&:hover': {
              backgroundColor: 'action.hover',
            },
          }}
        >
          <X size={20} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 2.5 }}>
        {/* Status Update Messages */}
        {statusUpdateHook.updateSuccess && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => statusUpdateHook.setUpdateSuccess(false)}>
            {t('details.statusUpdated')}
          </Alert>
        )}
        {statusUpdateHook.updateError && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => statusUpdateHook.setUpdateError(null)}>
            {statusUpdateHook.updateError}
          </Alert>
        )}

        {/* Status Selector */}
        <Box sx={{ mb: 3, pt: 2 }}>
          <ComplaintStatusSelector
            currentStatus={displayStatus}
            onStatusChange={statusUpdateHook.handleStatusChange}
            canEdit={canEditStatus}
            isUpdating={statusUpdateHook.isUpdating}
          />
        </Box>

        {/* Description */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ fontSize: '0.875rem', fontWeight: 600, mb: 1, color: 'text.secondary' }}>
            {t('details.description')}
          </Typography>
          <Typography variant="body1" sx={{ fontSize: '0.9375rem', lineHeight: 1.6, color: 'text.primary' }}>
            {complaint.description}
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Complaint Information */}
        <ComplaintInformation complaint={complaint} />

        {/* Attachments */}
        {complaint.attachments && complaint.attachments.length > 0 && (
          <>
            <Divider sx={{ my: 3 }} />
            <ComplaintAttachments attachments={complaint.attachments} attachmentsCount={complaint.attachmentsCount} />
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 2.5, py: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <Button onClick={onClose} variant="outlined" sx={{ textTransform: 'none' }}>
          {t('details.close')}
        </Button>
      </DialogActions>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={statusUpdateHook.confirmDialogOpen}
        title={t('details.changeStatus')}
        message={
          statusUpdateHook.pendingStatus
            ? t('details.changeStatusMessage', {
                from: statusConfig[displayStatus]?.label || displayStatus,
                to: statusConfig[statusUpdateHook.pendingStatus]?.label || statusUpdateHook.pendingStatus,
              })
            : ''
        }
        confirmText={t('details.changeStatusButton')}
        cancelText={t('common:buttons.cancel')}
        confirmColor="primary"
        onConfirm={statusUpdateHook.handleConfirmStatusUpdate}
        onCancel={statusUpdateHook.handleCancelStatusUpdate}
        loading={statusUpdateHook.isUpdating}
      />
    </Dialog>
  )
}
