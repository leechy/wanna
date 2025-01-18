import { User } from 'firebase/auth';

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
