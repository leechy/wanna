import { generateId, profiles$, supabase, user$ } from '@/state/state';
import { addList, clearLists } from '@/state/actions-lists';
import { UserProfile } from '@/types/user';

/**
 * Creates a new user profile with the name provided in the login screen
 *
 * @param {string} user_id
 * @param {string} name
 */
export async function addUserProfile(user_id: string, name: string) {
  // Add the new user to the profiles collection
  const profileId = generateId();
  profiles$[profileId].set({
    id: profileId,
    user_id,
    names: name,
  });

  // Create a new default list for the user
  const listId = await addList({ name: 'Tutorial', type: 'project' });

  console.log('New tutorial list is created', listId);
  // Add a few default items to the default list
  // addListItem(listId, 'Mark this item as ongoing, and then as completed');
  // addListItem(listId, 'Swipe left to delete this item');
  // addListItem(
  //   listId,
  //   'Create a new item by tapping on the “New Item” placeholder at the top'
  // );
  // addListItem(listId, 'Create a new list from the Lists screen');
}

/**
 * Returns the profile id for the given user id
 * if user id is not found, returns profile of the current user
 *
 * @param {string} user_id
 * @returns {UserProfile | null}
 */
export function getUserProfile(user_id?: string): UserProfile | null {
  const profiles = profiles$.get();
  if (!profiles) {
    return null;
  }
  const userId = user_id || user$.get().id;
  const profileId = Object.keys(profiles).find((pid) => profiles[pid].user_id === userId);
  return profileId ? profiles[profileId] : null;
}

/**
 * Clears all profiles from the state
 *
 * @returns {void}
 */
export function clearProfiles() {
  for (const profile of Object.values(profiles$)) {
    profile.delete();
  }
}

/**
 * Logs out the current user
 * and cleans the state afterwards
 *
 * @returns {void}
 */
export function logout() {
  supabase.auth.signOut();
  clearProfiles();
  clearLists();
}
