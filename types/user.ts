export type User = {
  uid: string | null;

  // auth string;
  auth: string | null;

  // user name
  names: string;

  // notification tokens
  expo_push_token?: string;
  device_push_token?: string;

  // settings
  notifyOnListShared?: boolean;
  notifyOnListItemsUpdate?: boolean;
  notifyOnItemStateUpdate?: boolean;
} | null;

export type UserState = {
  session: User | null;
  id: string | null;
  expoPushToken: string;
  devicePushToken: string;
  notificationStatus: 'undetermined' | 'granted' | 'denied' | 'not-supported';
};
