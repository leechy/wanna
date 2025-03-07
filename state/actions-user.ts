import { generateId, user$ as _user$ } from '@/state/state';
import { clearLists } from '@/state/actions-lists';
import { queueOperation } from '@/state/actions-queue';

// types
import { User } from '@/types/user';

/**
 * Creates a new user profile with the name provided in the login screen
 *
 * @param {string} names
 */
export async function createUser(names: string) {
  const uid = generateId();
  const auth = generateId();
  // Add the new user to the profiles collection
  _user$.set({
    uid,
    auth,
    names,
    notifyOnListShared: true,
    notifyOnListItemsUpdate: true,
    notifyOnItemStateUpdate: true,
  });

  // add the new user to the server
  // it would be synced with the server later
  queueOperation('auth', { uid, auth, names });

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
 * Updates the user profile with the new data
 *
 * @param {Partial<User>} update
 * @returns {void}
 */
export function updateUser(update: Partial<User>) {
  _user$.assign({
    ...update,
  });
}

/**
 * Clears all profiles from the state
 *
 * @returns {void}
 */
export function clearUser() {
  _user$.delete();
}

/**
 * Logs out the current user
 * and cleans the state afterwards
 *
 * @returns {void}
 */
export function logout() {
  clearUser();
  clearLists();
}
