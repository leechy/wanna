import { List } from '@/types/list';
import { generateId, lists$ as _lists$, user$ as _user$ } from './state';

/**
 * Add new list to the state
 *
 * @param {Partial<List>} list  list props
 * @returns
 */
export async function addList(list: Partial<List>) {
  const uid = _user$.get()?.id;
  if (!uid) {
    throw new Error('No user id');
  }
  const listId = generateId();
  const shareId = generateId();
  const now = new Date().toISOString();
  const userId = new Array(uid);
  // _lists$.assign({
  _lists$[listId].set({
    id: list.id || listId,
    share_id: list.share_id || shareId,
    name: list.name || 'New List',
    type: list.type || 'project',
    deadline: list.deadline || null,
    is_active: list.is_active || true,
    hide_completed: list.hide_completed || true,
    notify_on_list_items_update: list.notify_on_list_items_update || true,
    notify_on_item_state_update: list.notify_on_item_state_update || true,
    notify_on_user_at_location: list.notify_on_user_at_location || true,
    user_ids: userId,
    created_at: now,
    updated_at: now,
    deleted: false,
  });
  return listId;
}

/**
 * Update list in the state
 *
 * @param {string} listId  list id
 * @param {Partial<List>} update  props to update
 * @returns {void}
 */
export async function updateList(listId: string, update: Partial<List>) {
  const list = _lists$[listId].get();
  _lists$[listId].set({
    ...list,
    ...update,
  });
}

/**
 * Deletes a list from the state
 *
 * @param {string} listId
 * @returns {void}
 */
export async function deleteList(listId: string) {
  _lists$[listId].delete();
}

/**
 * Clear all lists from the state
 *
 * @returns {void}
 */
export function clearLists() {
  for (const list of Object.values(_lists$)) {
    list.delete();
  }
}
