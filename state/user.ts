import { observable, ObservableObject } from '@legendapp/state';

// types
import { Session } from '@supabase/supabase-js';
import { UserState } from '@/types/user';
import { generateId } from './state';
import { syncedSupabase } from '@legendapp/state/sync-plugins/supabase';
import { supabase } from '@/app/_layout';

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
 * User profile data
 * for now it will keep only the name,
 * but in the future we can store a lot more, like all settings:
 * language, units, etc.
 *
 * @type {ObservableObject}
 */
const profiles$ = observable(
  syncedSupabase({
    supabase,
    collection: 'user_profiles',
    // Optional:
    // Select only id and text fields
    select: (from) => from.select('id, user_id, names, is_active, is_public'),
    // TODO: Filter only the users that we are sharing lists with
    // filter: (select) => select.eq('user_id', user$.id.get() || ''),
    // Don't allow delete
    actions: ['read', 'create', 'update'],
    // Realtime filter by user_id
    // TODO: not just current user, but all users we are sharing lists with
    realtime: { filter: `user_id=eq.${user$.id.get()}` },
    // Persist data and pending changes locally
    persist: { name: 'profiles', retrySync: true },
    // Sync only diffs
    changesSince: 'last-sync',
  })
);

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

export async function addUserProfile(user_id: string, name: string) {
  // Add the new user to the profiles collection
  const profileId = generateId();
  profiles$[profileId].assign({
    id: profileId,
    user_id,
    names: name,
    is_active: true,
    is_public: false,
  });
  // TODO: Implement addList and addListItem actions
  // Create a new default list for the user
  // const listId = await addList('Tutorial', 'project');
  // Add a few default items to the default list
  // addListItem(listId, 'Mark this item as ongoing, and then as completed');
  // addListItem(listId, 'Swipe left to delete this item');
  // addListItem(
  //   listId,
  //   'Create a new item by tapping on the “New Item” placeholder at the top'
  // );
  // addListItem(listId, 'Create a new list from the Lists screen');
}
