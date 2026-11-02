export type User = {
  uid: string | null;

  // auth string;
  auth: string | null;

  // user name
  names: string;

  // notification tokens
  expo_push_token?: string;
  device_push_token?: string;
  notificationStatus?: NotificationStatus;

  // settings
  notifyOnListShared?: boolean;
  notifyOnListItemsUpdate?: boolean;
  notifyOnItemStateUpdate?: boolean;
} | null;

export type NotificationStatus = 'undetermined' | 'granted' | 'denied' | 'not-supported';
