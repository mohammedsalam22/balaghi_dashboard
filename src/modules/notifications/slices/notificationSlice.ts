import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { Notification } from '../types';

// Load notifications from localStorage on initialization
const loadNotificationsFromStorage = (): Notification[] => {
  try {
    const stored = localStorage.getItem('notifications');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load notifications from localStorage:', error);
    return [];
  }
};

// Save notifications to localStorage
const saveNotificationsToStorage = (notifications: Notification[]) => {
  try {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  } catch (error) {
    console.error('Failed to save notifications to localStorage:', error);
  }
};

interface NotificationsState {
  notifications: Notification[];
  isConnected: boolean;
}

const initialState: NotificationsState = {
  notifications: loadNotificationsFromStorage(),
  isConnected: false,
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.push(action.payload);
      saveNotificationsToStorage(state.notifications);
    },
    clearNotifications: (state) => {
      state.notifications = [];
      saveNotificationsToStorage(state.notifications);
    },
    removeNotification: (state, action: PayloadAction<number>) => {
      state.notifications.splice(action.payload, 1);
      saveNotificationsToStorage(state.notifications);
    },
    removeNotificationById: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      );
      saveNotificationsToStorage(state.notifications);
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(
        notification => notification.id === action.payload
      );
      if (notification) {
        notification.read = true;
        saveNotificationsToStorage(state.notifications);
      }
    },
    setConnected: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
    },
  },
});

export const { 
  addNotification, 
  clearNotifications, 
  removeNotification, 
  removeNotificationById, 
  markAsRead, 
  setConnected 
} = notificationsSlice.actions;
export default notificationsSlice.reducer;