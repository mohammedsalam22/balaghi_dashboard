import { Box, Typography, ImageList, ImageListItem, Button } from '@mui/material'
import { Paperclip, FileText, Download } from 'lucide-react'
import { lightPalette } from '../../../theme'
import type { Complaint } from '../types'
import { complaintService } from '../services/complaintService'
import { isImageFile } from '../utils/complaintUtils'

interface ComplaintAttachmentsProps {
  attachments: Complaint['attachments']
  attachmentsCount: number
}

export default function ComplaintAttachments({ attachments, attachmentsCount }: ComplaintAttachmentsProps) {
  if (!attachments || attachments.length === 0) {
    return null
  }

  const handleDownload = (attachmentUrl: string, fileName: string) => {
    const fullUrl = complaintService.getAttachmentUrl(attachmentUrl)
    const link = document.createElement('a')
    link.href = fullUrl
    link.download = fileName
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Paperclip size={18} style={{ color: lightPalette.mutedForeground }} />
        <Typography variant="body2" sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'text.secondary' }}>
          Attachments ({attachmentsCount})
        </Typography>
      </Box>
      <ImageList cols={3} rowHeight={200} gap={12} sx={{ m: 0 }}>
        {attachments.map((attachment) => {
          const attachmentUrl = complaintService.getAttachmentUrl(attachment.url)
          return (
            <ImageListItem
              key={attachment.id}
              sx={{
                position: 'relative',
                borderRadius: '0.5rem',
                overflow: 'hidden',
                border: '1px solid',
                borderColor: 'divider',
                '&:hover': {
                  borderColor: 'primary.main',
                },
              }}
            >
              {isImageFile(attachment.contentType) ? (
                <Box
                  sx={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                  }}
                >
                  <img
                    src={attachmentUrl}
                    alt={attachment.fileName}
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      cursor: 'pointer',
                    }}
                    onClick={() => window.open(attachmentUrl, '_blank')}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                      p: 1,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: '0.75rem',
                        color: 'white',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {attachment.fileName}
                    </Typography>
                  </Box>
                </Box>
              ) : (
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: lightPalette.muted,
                    p: 2,
                    gap: 1,
                  }}
                >
                  <FileText size={32} style={{ color: lightPalette.mutedForeground }} />
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: '0.75rem',
                      color: 'text.secondary',
                      textAlign: 'center',
                      wordBreak: 'break-word',
                    }}
                  >
                    {attachment.fileName}
                  </Typography>
                  <Button
                    size="small"
                    startIcon={<Download size={14} />}
                    onClick={() => handleDownload(attachment.url, attachment.fileName)}
                    sx={{
                      mt: 1,
                      fontSize: '0.75rem',
                      textTransform: 'none',
                    }}
                  >
                    Download
                  </Button>
                </Box>
              )}
            </ImageListItem>
          )
        })}
      </ImageList>
    </Box>
  )
}
