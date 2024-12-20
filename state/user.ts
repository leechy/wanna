import { observable, ObservableObject } from '@legendapp/state';

// types
import { Session } from '@supabase/supabase-js';
import { UserState } from '@/types/user';

/**
 * User and session data
 *
 * @type {ObservableObject}
 */
export const user$: ObservableObject<UserState> = observable({
  id: null,
  session: null as Session | null,
});

/**
 * Set the user id from the Supabase session
 *
 * @param {Session | null} session
 * @returns {void}
 */
export function setSession(session: Session | null) {
  // set id - we are going to use this a lot
  user$.id.set(session?.user.id || null);
  // the rest of the session we'll keep for the future
  user$.session.set(session);
}
