import { List } from '@/types/list';
import { generateId, lists$ as _lists$, user$ as _user$ } from './state';
import { queueOperation } from './actions-queue';
import { getHRID } from '@/utils/human-readable-ids';
import { Item } from '@/types/Item';

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
 * @param {boolean} fromServer  whether the update is coming from the server (will not be sent back)
 * @returns {void}
 */
export async function updateList(listId: string, update: Partial<List>, fromServer = false) {
  const { users, listItems, ...updatedData } = update;
  // check that the list exists in the state
  // and if not, create one instead
  if (!_lists$[listId]) {
    console.error('List not found', { listId, update });
    addList({ listId, ...update }, false);
    return;
  }
  // check that the incoming list data from the server is not older
  const stateUpdatedAt = _lists$[listId]?.updatedAt?.get();
  if (update.updatedAt && stateUpdatedAt && update.updatedAt <= stateUpdatedAt) {
    return;
  }

  _lists$[listId]?.assign({
    ...update,
  });

  // recreate lists to trigger reactivity
  _lists$.set({ ..._lists$.get() });

  // and the updates should go to the server
  if (!fromServer) {
    queueOperation('list:update', {
      listId,
      ...updatedData,
    });
  }
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

/**
 * Adds a new item to the list
 *
 * @param {string} listId  list id
 * @param {Partial<ListItem>} item  item props
 * @returns {string}  item id
 */
export async function addItem(listId: string, item: Partial<Item>) {
  const listItemId: string = item.listItemId || generateId();
  const itemId: string = item.itemId || generateId();
  const type: string = item.type || 'item';
  const now = new Date().toISOString();

  const newItem = {
    listItemId,
    itemId,
    listId,
    type,
    name: item.name || 'New Item',
    quantity: item.quantity || 1,
    createdAt: now,
    updatedAt: now,
  };

  _lists$[listId].listItems.push(newItem);

  // add the new item to the server
  queueOperation('item:create', newItem);

  return itemId;
}
