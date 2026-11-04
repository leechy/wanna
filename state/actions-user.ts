import { generateId, pendingShare$, ui$, user$ as _user$ } from '@/state/state';
import { addList, clearLists } from '@/state/actions-lists';
import { clearInvitations } from '@/state/actions-invitations';
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
  queueOperation('auth', { uid, auth, names });

  // the first list to start with, unless the user came by a link to a list:
  // that list is theirs in a moment, a second empty one would only confuse
  if (!pendingShare$.shareId.peek()) {
    addList({ name: 'Shopping', type: 'shopping-list' });
  }
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
  ui$.lastListId.set(null);
  clearInvitations();
}
