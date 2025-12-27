export interface Notification {
  id: string;
  type: string;
  trackingNumber: string;
  complaintType: string;
  submittedAt: string;
  read: boolean;
}

export type NotificationType = 'NewComplaint';