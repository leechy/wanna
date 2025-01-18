import { profile$, user$ as _user$ } from '@/state/state';
import { clearLists } from '@/state/actions-lists';
import { auth } from './firebaseConfig';

/**
 * Creates a new user profile with the name provided in the login screen
 *
 * @param {string} user_id
 * @param {string} name
 */
export async function addUserProfile(uid: string, name: string) {
  // Add the new user to the profiles collection
  profile$.set({
    uid,
    names: name,
  });

  // Create a new default list for the user
  // const listId = await addList({ name: 'Tutorial', type: 'project' });

  // console.log('New tutorial list is created', listId);
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
 * @returns {UserProfile | null}
 */
export function getUserProfile(): any | null {
  return profile$.get() || null;
}

/**
 * Clears all profiles from the state
 *
 * @returns {void}
 */
export function clearProfile() {
  for (const profile of Object.values(profile$)) {
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
  clearProfile();
  clearLists();
  auth.signOut();
}
