import { Session } from '@supabase/supabase-js';

export type UserState = {
  session: Session | null;
  id: string | null;
};
