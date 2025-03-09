import { List } from '@/types/list';
import { generateId, lists$ as _lists$, user$ as _user$ } from './state';
import { queueOperation } from './actions-queue';
import { getHRID } from '@/utils/human-readable-ids';

/**
 * Add new list to the state
 *
 * @param {Partial<List>} list  list props
 * @returns
 */
export async function addList(list: Partial<List>, updateServer = true) {
  const uid = _user$.uid?.get();
  if (!uid) {
    throw new Error('No user id');
  }

  const listId = list.listId || generateId();
  const shareId = list.shareId || getHRID();
  const name = list.name || 'New List';
  const type = list.type || 'project';
  const now = new Date().toISOString();

  console.log('Creating new list', { listId, shareId, name, type });

  _lists$[listId].assign({
    listId,
    shareId,
    name,
    type,
    deadline: list.deadline,
    active: list.active || true,
    hideCompleted: list.hideCompleted || true,
    notifyOnListItemsUpdate: list.notifyOnListItemsUpdate || true,
    notifyOnItemStateUpdate: list.notifyOnItemStateUpdate || true,
    notifyOnListShared: list.notifyOnListShared || true,
    createdAt: now,
    updatedAt: now,
    deleted: false,
  });

  // add the new list to the server
  if (updateServer) {
    queueOperation('list:create', {
      listId,
      shareId,
      name,
      type,
      deadline: list.deadline,
      notifyOnListItemsUpdate: list.notifyOnListItemsUpdate || true,
      notifyOnItemStateUpdate: list.notifyOnItemStateUpdate || true,
      notifyOnListShared: list.notifyOnListShared || true,
    });
  }

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
  // check that the list exists in the state
  // and if not, create one instead
  if (!_lists$[listId]) {
    console.error('List not found', { listId, update });
    addList({ listId, ...update }, false);
    return;
  }
  // check that the incoming list data from the server is not older
  const stateUpdatedAt = _lists$[listId]?.updatedAt?.get();
  if (update.updatedAt && stateUpdatedAt && update.updatedAt < stateUpdatedAt) {
    console.log('Incoming list data is older', { listId, update });
    return;
  }

  _lists$[listId]?.assign({
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
