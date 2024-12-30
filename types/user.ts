import { Session } from '@supabase/supabase-js';

export type UserState = {
  session: Session | null;
  id: string | null;
  expoPushToken: string;
  devicePushToken: string;
  notificationStatus: 'undetermined' | 'granted' | 'denied' | 'not-supported';
};
