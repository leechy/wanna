export type User = {
  uid: string;

  // auth string;
  auth: string;

  // user name
  names: string;

  // notification tokens
  expo_push_token?: string;
  device_push_token?: string;

  // settings
  notifyOnListShared: boolean;
  notifyOnListItemsUpdate: boolean;
  notifyOnItemStateUpdate: boolean;
};

export type UserState = {
  session: User | null;
  id: string | null;
  expoPushToken: string;
  devicePushToken: string;
  notificationStatus: 'undetermined' | 'granted' | 'denied' | 'not-supported';
};

export type UserProfiles = {
  [id: string]: UserProfile;
};

export type UserProfile = {
  id: string;
  user_id: string;
  names: string | null;
};
