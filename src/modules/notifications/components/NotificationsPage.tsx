import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Badge,
  Button,
} from '@mui/material';
import { Delete as DeleteIcon, MarkEmailRead as MarkReadIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import type { RootState } from '../../../shared/store/store';
import { removeNotificationById, markAsRead, clearNotifications } from '../slices/notificationSlice';

const NotificationsPage: React.FC = () => {
  const { t } = useTranslation('notifications');
  const dispatch = useDispatch();
  const notifications = useSelector((state: RootState) => state.notifications.notifications);

  const handleRemove = (id: string) => {
    dispatch(removeNotificationById(id));
  };

  const handleMarkAsRead = (id: string) => {
    dispatch(markAsRead(id));
  };

  const handleClearAll = () => {
    dispatch(clearNotifications());
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          {t('title', 'Notifications')}
          {unreadCount > 0 && (
            <Badge badgeContent={unreadCount} color="error" sx={{ ml: 2 }}>
              <Box />
            </Badge>
          )}
        </Typography>
        {notifications.length > 0 && (
          <Button 
            variant="outlined" 
            color="error" 
            onClick={handleClearAll}
            startIcon={<DeleteIcon />}
          >
            {t('clearAll', 'Clear All')}
          </Button>
        )}
      </Box>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('status', 'Status')}</TableCell>
                <TableCell>{t('type', 'Type')}</TableCell>
                <TableCell>{t('trackingNumber', 'Tracking Number')}</TableCell>
                <TableCell>{t('complaintType', 'Complaint Type')}</TableCell>
                <TableCell>{t('submittedAt', 'Submitted At')}</TableCell>
                <TableCell>{t('actions', 'Actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {notifications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      {t('noNotifications', 'No notifications yet')}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                notifications.map((notification) => (
                  <TableRow 
                    key={notification.id}
                    sx={{ 
                      backgroundColor: notification.read ? 'transparent' : 'action.hover',
                      '&:hover': { backgroundColor: 'action.selected' }
                    }}
                  >
                    <TableCell>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={notification.type}
                        color={notification.type === 'NewComplaint' ? 'primary' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{notification.trackingNumber}</TableCell>
                    <TableCell>{notification.complaintType}</TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(notification.submittedAt).toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        {!notification.read && (
                          <IconButton
                            size="small"
                            onClick={() => handleMarkAsRead(notification.id)}
                            title={t('markAsRead', 'Mark as read')}
                          >
                            <MarkReadIcon fontSize="small" />
                          </IconButton>
                        )}
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleRemove(notification.id)}
                          title={t('remove', 'Remove')}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default NotificationsPage;