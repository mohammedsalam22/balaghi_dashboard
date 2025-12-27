import type { Dispatch } from '@reduxjs/toolkit';
import { addNotification, setConnected } from '../slices/notificationSlice';
import type { Notification } from '../types';

class NotificationService {
  private ws: WebSocket | null = null;
  private dispatch: Dispatch | null = null;
  private reconnectInterval: number | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 5000; // 5 seconds

  connect(token: string, dispatch: Dispatch) {
    this.dispatch = dispatch;
    // Use token as query parameter (temporary fix until backend supports post-connection auth)
    const url = `ws://localhost:5000/ws/admin/notifications?token=${token}`;
    console.log('Connecting to WebSocket:', url);
    this.ws = new WebSocket(url);

    this.ws.onopen = () => {
      console.log('WebSocket connected successfully');
      this.dispatch?.(setConnected(true));
      this.reconnectAttempts = 0;
    };

    this.ws.onmessage = (event) => {
      try {
        const data: Notification = JSON.parse(event.data);
        // Add unique ID and mark as unread
        const notificationWithId: Notification = {
          ...data,
          id: crypto.randomUUID(),
          read: false
        };
        console.log('Received notification:', notificationWithId);
        this.dispatch?.(addNotification(notificationWithId));
      } catch (error) {
        console.error('Failed to parse notification:', error);
      }
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
      this.dispatch?.(setConnected(false));
      this.attemptReconnect(token);
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      console.error('WebSocket state:', this.ws?.readyState);
      console.error('WebSocket URL:', this.ws?.url);
      // Log additional browser-specific error details
      if (this.ws?.readyState === 3) {
        console.error('Connection closed - possible causes:');
        console.error('1. Backend WebSocket server not running');
        console.error('2. Incorrect WebSocket endpoint path');
        console.error('3. CORS policy blocking connection');
        console.error('4. Firewall/network issues');
      }
    };
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    if (this.reconnectInterval) {
      clearInterval(this.reconnectInterval);
      this.reconnectInterval = null;
    }
    this.dispatch?.(setConnected(false));
  }

  private attemptReconnect(token: string) {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnect attempts reached');
      return;
    }

    this.reconnectInterval = window.setTimeout(() => {
      console.log(`Attempting to reconnect... (${this.reconnectAttempts + 1}/${this.maxReconnectAttempts})`);
      this.reconnectAttempts++;
      this.connect(token, this.dispatch!);
    }, this.reconnectDelay);
  }
}

export const notificationService = new NotificationService();