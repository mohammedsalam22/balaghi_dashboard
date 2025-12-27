import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Snackbar, Alert, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import type { RootState } from '../../../shared/store/store';
import { removeNotificationById, markAsRead } from '../slices/notificationSlice';

const NotificationSnackbar: React.FC = () => {
  const dispatch = useDispatch();
  const notifications = useSelector((state: RootState) => state.notifications.notifications);
  
  // Only show unread notifications in the snackbar
  const unreadNotifications = notifications.filter(n => !n.read);

  const handleClose = (id: string) => {
    dispatch(removeNotificationById(id));
  };

  const handleNotificationClick = (id: string) => {
    dispatch(markAsRead(id));
  };

  return (
    <>
      {unreadNotifications.map((notification) => (
        <Snackbar
          key={notification.id}
          open={true}
          // Remove autoHideDuration to make persistent until user interaction
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          sx={{ mt: 8 }} // Stack below AppBar
        >
          <Alert 
            severity="info"
            sx={{ 
              width: '100%',
              cursor: 'pointer'
            }}
            onClick={() => handleNotificationClick(notification.id)}
            action={
              <IconButton
                size="small"
                color="inherit"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClose(notification.id);
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            }
          >
            <div>
              <div>
                <strong>New {notification.type}</strong>
              </div>
              <div>
                {notification.trackingNumber} - {notification.complaintType}
              </div>
              <div style={{ fontSize: '0.8em', opacity: 0.7 }}>
                {new Date(notification.submittedAt).toLocaleString()}
              </div>
            </div>
          </Alert>
        </Snackbar>
      ))}
    </>
  );
};

export default NotificationSnackbar;