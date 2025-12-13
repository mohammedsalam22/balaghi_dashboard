import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Stack,
  Divider,
  IconButton,
} from '@mui/material'
import { Building2, Users, Mail, Edit2, Trash2, X, Plus, Check, XCircle } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../../shared/store/hooks'
import { lightPalette } from '../../../theme'
import type { GovernmentAgency } from '../types'
import {
  updateAgencyAsync,
  deleteAgencyAsync,
  inviteEmployeeAsync,
  deleteEmployeeAsync,
} from '../slices/governmentAgenciesSlice'
import ConfirmationDialog from '../../../shared/components/ConfirmationDialog'

interface AgencyDialogProps {
  open: boolean
  agency: GovernmentAgency | null
  onClose: () => void
  onUpdate: () => void
  onDelete: () => void
}

export default function AgencyDialog({ open, agency, onClose, onUpdate, onDelete }: AgencyDialogProps) {
  const dispatch = useAppDispatch()
  const { error: reduxError, isLoading } = useAppSelector((state) => state.governmentAgencies)
  
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [showAddEmployee, setShowAddEmployee] = useState(false)
  const [employeeEmail, setEmployeeEmail] = useState('')
  const [employeeName, setEmployeeName] = useState('')
  const [inviteLoading, setInviteLoading] = useState(false)
  const [inviteError, setInviteError] = useState<string | null>(null)
  const [inviteSuccess, setInviteSuccess] = useState<string | null>(null)
  const [deletingEmployeeId, setDeletingEmployeeId] = useState<string | null>(null)
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean
    title: string
    message: string
    onConfirm: () => void
  }>({
    open: false,
    title: '',
    message: '',
    onConfirm: () => {},
  })

  // Initialize form when agency changes
  useEffect(() => {
    if (agency) {
      setName(agency.name)
      setIsEditing(false)
      setError(null)
      setShowAddEmployee(false)
      setEmployeeEmail('')
      setEmployeeName('')
      setInviteError(null)
      setInviteSuccess(null)
      setDeletingEmployeeId(null)
      setConfirmDialog({
        open: false,
        title: '',
        message: '',
        onConfirm: () => {},
      })
    }
  }, [agency])

  // Sync error from Redux
  useEffect(() => {
    if (reduxError) {
      setError(reduxError)
    }
  }, [reduxError])

  const handleEdit = () => {
    if (agency) {
      setName(agency.name)
      setIsEditing(true)
      setError(null)
    }
  }

  const handleCancel = () => {
    if (agency) {
      setName(agency.name)
      setIsEditing(false)
      setError(null)
    }
  }

  const handleSave = async () => {
    if (!agency?.id || !name.trim()) {
      setError('Agency name is required')
      return
    }

    const agencyId = agency.id
    try {
      setError(null)
      const result = await dispatch(updateAgencyAsync({ id: agencyId, data: { name: name.trim() } }))
      
      if (updateAgencyAsync.fulfilled.match(result)) {
        setIsEditing(false)
        onUpdate()
        onClose()
      } else {
        setError(result.payload as string || 'Failed to update agency')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update agency')
    }
  }

  const handleDelete = () => {
    if (!agency) return

    setConfirmDialog({
      open: true,
      title: 'Delete Agency',
      message: `Are you sure you want to delete "${agency.name}"? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          setError(null)
          const result = await dispatch(deleteAgencyAsync(agency.id))
          
          if (deleteAgencyAsync.fulfilled.match(result)) {
            setConfirmDialog({ ...confirmDialog, open: false })
            onDelete()
            onClose()
          } else {
            setError(result.payload as string || 'Failed to delete agency')
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to delete agency')
        }
      },
    })
  }

  const handleAddEmployeeClick = () => {
    setShowAddEmployee(true)
    setInviteError(null)
    setInviteSuccess(null)
  }

  const handleCancelAddEmployee = () => {
    setShowAddEmployee(false)
    setEmployeeEmail('')
    setEmployeeName('')
    setInviteError(null)
    setInviteSuccess(null)
  }

  const handleInviteEmployee = async () => {
    if (!agency) return

    if (!employeeEmail.trim() || !employeeName.trim()) {
      setInviteError('Both email and name are required')
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(employeeEmail.trim())) {
      setInviteError('Please enter a valid email address')
      return
    }

    try {
      setInviteLoading(true)
      setInviteError(null)
      setInviteSuccess(null)
      const result = await dispatch(
        inviteEmployeeAsync({
          agencyId: agency.id,
          fullName: employeeName.trim(),
          email: employeeEmail.trim(),
        })
      )
      
      if (inviteEmployeeAsync.fulfilled.match(result)) {
        setInviteSuccess(result.payload.message || 'Employee invitation sent successfully')
        setEmployeeEmail('')
        setEmployeeName('')
        // Refresh the agency data after a short delay to show success message
        setTimeout(() => {
          setShowAddEmployee(false)
          onUpdate()
        }, 2000)
      } else {
        setInviteError(result.payload as string || 'Failed to invite employee')
      }
    } catch (err) {
      setInviteError(err instanceof Error ? err.message : 'Failed to invite employee')
    } finally {
      setInviteLoading(false)
    }
  }

  const handleDeleteEmployee = (employeeId: string, employeeName: string) => {
    if (!agency) return

    setConfirmDialog({
      open: true,
      title: 'Delete Employee',
      message: `Are you sure you want to delete "${employeeName}"? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          setDeletingEmployeeId(employeeId)
          setError(null)
          const result = await dispatch(deleteEmployeeAsync(employeeId))
          
          if (deleteEmployeeAsync.fulfilled.match(result)) {
            setConfirmDialog({ ...confirmDialog, open: false })
            onUpdate()
          } else {
            setError(result.payload as string || 'Failed to delete employee')
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to delete employee')
        } finally {
          setDeletingEmployeeId(null)
        }
      },
    })
  }

  if (!agency) return null

  const employeeCount = agency.employees.length

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '0.75rem',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Building2 size={24} style={{ color: lightPalette.accent }} />
          <Typography variant="h2" sx={{ fontSize: '1.5rem', fontWeight: 600 }}>
            Agency Details
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

      <DialogContent>
        {error && (
          <Box
            sx={{
              p: 1.5,
              mb: 2,
              borderRadius: '0.5rem',
              backgroundColor: lightPalette.destructive + '20',
              border: `1px solid ${lightPalette.destructive}`,
            }}
          >
            <Typography variant="body2" sx={{ color: lightPalette.destructive }}>
              {error}
            </Typography>
          </Box>
        )}

        <Box sx={{ mb: 3 }}>
          <Typography
            variant="overline"
            sx={{
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'text.secondary',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              mb: 1,
              display: 'block',
            }}
          >
            Agency Name
          </Typography>
          {isEditing ? (
            <TextField
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter agency name"
              size="small"
              error={!!error && !name.trim()}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '0.5rem',
                },
              }}
            />
          ) : (
            <Box
              sx={{
                p: 1.5,
                borderRadius: '0.5rem',
                backgroundColor: lightPalette.muted,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Typography variant="body1" sx={{ fontSize: '1rem', fontWeight: 500 }}>
                {agency.name}
              </Typography>
            </Box>
          )}
        </Box>

        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Typography
              variant="overline"
              sx={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'text.secondary',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                display: 'block',
              }}
            >
              Employees ({employeeCount})
            </Typography>
            {!showAddEmployee && (
              <Button
                startIcon={<Plus size={16} />}
                onClick={handleAddEmployeeClick}
                size="small"
                variant="outlined"
                sx={{
                  textTransform: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '0.8125rem',
                }}
              >
                Add Employee
              </Button>
            )}
          </Box>
          <Divider sx={{ mb: 2 }} />

          {/* Add Employee Form */}
          {showAddEmployee && (
            <Box
              sx={{
                p: 2,
                mb: 2,
                borderRadius: '0.5rem',
                backgroundColor: lightPalette.muted,
                border: `1px solid ${lightPalette.border}`,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2" sx={{ fontSize: '0.875rem', fontWeight: 600 }}>
                  Invite New Employee
                </Typography>
                <IconButton
                  onClick={handleCancelAddEmployee}
                  size="small"
                  sx={{
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                >
                  <XCircle size={18} />
                </IconButton>
              </Box>

              {inviteError && (
                <Box
                  sx={{
                    p: 1,
                    mb: 1.5,
                    borderRadius: '0.5rem',
                    backgroundColor: lightPalette.destructive + '20',
                    border: `1px solid ${lightPalette.destructive}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                  }}
                >
                  <XCircle size={16} style={{ color: lightPalette.destructive, flexShrink: 0 }} />
                  <Typography variant="body2" sx={{ fontSize: '0.8125rem', color: lightPalette.destructive }}>
                    {inviteError}
                  </Typography>
                </Box>
              )}

              {inviteSuccess && (
                <Box
                  sx={{
                    p: 1,
                    mb: 1.5,
                    borderRadius: '0.5rem',
                    backgroundColor: lightPalette.statusResolved + '20',
                    border: `1px solid ${lightPalette.statusResolved}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                  }}
                >
                  <Check size={16} style={{ color: lightPalette.statusResolved, flexShrink: 0 }} />
                  <Typography variant="body2" sx={{ fontSize: '0.8125rem', color: lightPalette.statusResolved }}>
                    {inviteSuccess}
                  </Typography>
                </Box>
              )}

              <Stack spacing={1.5}>
                <TextField
                  label="Employee Name"
                  value={employeeName}
                  onChange={(e) => {
                    setEmployeeName(e.target.value)
                    setInviteError(null)
                  }}
                  placeholder="Enter employee full name"
                  fullWidth
                  size="small"
                  error={!!inviteError && !employeeName.trim()}
                  disabled={inviteLoading}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '0.5rem',
                    },
                  }}
                />
                <TextField
                  label="Employee Email"
                  type="email"
                  value={employeeEmail}
                  onChange={(e) => {
                    setEmployeeEmail(e.target.value)
                    setInviteError(null)
                  }}
                  placeholder="Enter employee email"
                  fullWidth
                  size="small"
                  error={!!inviteError && !employeeEmail.trim()}
                  disabled={inviteLoading}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '0.5rem',
                    },
                  }}
                />
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                  <Button
                    onClick={handleCancelAddEmployee}
                    disabled={inviteLoading}
                    variant="outlined"
                    size="small"
                    sx={{
                      textTransform: 'none',
                      borderRadius: '0.5rem',
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    startIcon={<Plus size={16} />}
                    onClick={handleInviteEmployee}
                    disabled={inviteLoading || !employeeEmail.trim() || !employeeName.trim()}
                    variant="contained"
                    size="small"
                    sx={{
                      textTransform: 'none',
                      borderRadius: '0.5rem',
                    }}
                  >
                    Send Invitation
                  </Button>
                </Box>
              </Stack>
            </Box>
          )}
          {employeeCount > 0 ? (
            <Stack spacing={1.5}>
              {agency.employees.map((employee) => (
                <Box
                  key={employee.id}
                  sx={{
                    p: 1.5,
                    borderRadius: '0.5rem',
                    backgroundColor: lightPalette.muted,
                    border: `1px solid ${lightPalette.border}`,
                    position: 'relative',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
                    <Users size={16} style={{ color: lightPalette.mutedForeground, flexShrink: 0 }} />
                    <Typography variant="body2" sx={{ fontSize: '0.875rem', fontWeight: 500, flex: 1 }}>
                      {employee.userName}
                    </Typography>
                    <IconButton
                      onClick={() => handleDeleteEmployee(employee.id, employee.userName)}
                      disabled={deletingEmployeeId === employee.id || isLoading}
                      size="small"
                      sx={{
                        color: lightPalette.destructive,
                        '&:hover': {
                          backgroundColor: lightPalette.destructive + '20',
                        },
                        '&:disabled': {
                          opacity: 0.5,
                        },
                      }}
                      title="Delete employee"
                    >
                      <Trash2 size={16} />
                    </IconButton>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Mail size={14} style={{ color: lightPalette.mutedForeground, flexShrink: 0 }} />
                    <Typography variant="body2" sx={{ fontSize: '0.8125rem', color: 'text.secondary' }}>
                      {employee.email}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Stack>
          ) : (
            <Box
              sx={{
                p: 2,
                borderRadius: '0.5rem',
                backgroundColor: lightPalette.muted,
                textAlign: 'center',
              }}
            >
              <Typography variant="body2" sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                No employees assigned to this agency
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          pb: 2,
          gap: 1,
          justifyContent: 'space-between',
        }}
      >
        <Button
          startIcon={<Trash2 size={18} />}
          onClick={handleDelete}
          disabled={isLoading}
          color="error"
          variant="outlined"
          sx={{
            textTransform: 'none',
            borderRadius: '0.5rem',
          }}
        >
          Delete Agency
        </Button>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {isEditing ? (
            <>
              <Button
                onClick={handleCancel}
                disabled={isLoading}
                variant="outlined"
                sx={{
                  textTransform: 'none',
                  borderRadius: '0.5rem',
                }}
              >
                Cancel
              </Button>
              <Button
                startIcon={<Edit2 size={18} />}
                onClick={handleSave}
                disabled={isLoading || !name.trim()}
                variant="contained"
                sx={{
                  textTransform: 'none',
                  borderRadius: '0.5rem',
                }}
              >
                Save Changes
              </Button>
            </>
          ) : (
            <Button
              startIcon={<Edit2 size={18} />}
              onClick={handleEdit}
              variant="contained"
              sx={{
                textTransform: 'none',
                borderRadius: '0.5rem',
              }}
            >
              Edit Name
            </Button>
          )}
        </Box>
      </DialogActions>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="error"
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog({ ...confirmDialog, open: false })}
        loading={isLoading || deletingEmployeeId !== null}
      />
    </Dialog>
  )
}

