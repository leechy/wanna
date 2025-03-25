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
    console.warn('List not found, creating new one', { listId, update });
    addList({ listId, ...update }, false);
    return;
  }
  // check that the incoming list data from the server is not older to update
  const stateUpdatedAt = _lists$[listId]?.updatedAt?.get();
  if (update.updatedAt && stateUpdatedAt && update.updatedAt < stateUpdatedAt) {
    console.warn('Incoming list data is older', listId + ':', update.updatedAt, '<=', stateUpdatedAt);
  } else {
    _lists$[listId]?.assign({
      ...update,
    });

    // and the updates should go to the server
    if (!fromServer) {
      queueOperation('list:update', {
        listId,
        ...updatedData,
      });
    }

    // recreate lists to trigger reactivity
    _lists$.set({ ..._lists$.get() });
  }

  // update the items in the list
  listItems?.forEach((item) => {
    updateItem(listId, item.listItemId, item, fromServer);
  });

  return listId;
}

/**
 * Deletes a list from the state
 *
 * @param {string} listId
 * @returns {void}
 */
export async function deleteList(listId: string) {
  updateList(
    listId,
    {
      deleted: true,
      updatedAt: new Date().toISOString(),
    },
    false
  );
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
  const type: 'item' | 'task' = item.type || 'item';
  const now = new Date().toISOString();

  const newItem: Item = {
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

/**
 * Update an item in the list
 *
 * @param {string} listId  list id
 * @param {string} listItemId  item id
 * @param {Partial<Item>} update  item props to update
 * @returns {void}
 */
export async function updateItem(listId: string, listItemId: string, update: Partial<Item>, fromServer = false) {
  const listItems = _lists$[listId]?.listItems.get();
  if (!listItems) {
    console.warn('No list items found for the list:', listId, '. List item not updated:', listItemId);
    return;
  }

  const itemIndex = listItems.findIndex((item) => item.listItemId === listItemId);
  if (itemIndex < 0) {
    console.warn('Item not found and not updated', listItemId);
    return;
  }

  const stateUpdatedAt = _lists$[listId]?.listItems[itemIndex].updatedAt?.get();
  if (stateUpdatedAt && update.updatedAt && stateUpdatedAt > update.updatedAt) {
    console.warn('Incoming item data is older', listItemId + ':', update.updatedAt, '<=', stateUpdatedAt);
    return;
  }

  // update the item in the state
  _lists$[listId].listItems[itemIndex].assign({
    ...update,
  });

  // recreate items to trigger reactivity
  _lists$[listId].listItems.set([...(_lists$[listId].listItems.get() || [])]);

  if (!fromServer) {
    // update the item on the server
    queueOperation('item:update', {
      listId,
      listItemId,
      ...update,
    });
  }
}

/**
 * Mark an item as completed
 *
 * @param {string} listId  list id
 * @param {string} listItemId  item id
 * @param {boolean} completed  whether the item is completed
 * @returns {void}
 */
export async function markItemAsCompleted(listId: string, listItemId: string, completed: boolean = true) {
  const listItems = _lists$[listId].listItems.get();
  if (!listItems) {
    console.warn('No list items found for the list:', listId, '. List item not updated:', listItemId);
    return;
  }

  const itemIndex = listItems.findIndex((item) => item.listItemId === listItemId);
  if (itemIndex < 0) {
    console.warn('Item not found and not updated', listItemId);
    return;
  }

  const updatedItem: Partial<Item> = {
    completed,
    ongoing: false,
    completedAt: completed ? new Date().toISOString() : null,
    updatedAt: new Date().toISOString(),
  };
  if (completed === false) {
    updatedItem.assigneeId = null;
    updatedItem.assignee = null;
  }

  _lists$[listId].listItems[itemIndex].assign(updatedItem);

  // recreate items to trigger reactivity
  _lists$[listId].listItems.set([...(_lists$[listId].listItems.get() || [])]);

  // update the item on the server
  queueOperation('listItem:update', {
    listId,
    listItemId,
    ...updatedItem,
  });

  // check if the all the items in the list are completed, then mark the list as completed
  const allItemsCompleted = _lists$[listId].listItems.get()?.every((item) => item.deleted || item.completed);
  const listData = _lists$[listId].get();

  if (allItemsCompleted && !listData.completed) {
    updateList(listId, {
      completed: true,
      completedAt: new Date().toISOString(),
    });
  }
}

/**
 * Puts item in cart
 * and sets the current user as an asignee
 *
 * @param {string} listId  list id
 * @param {string} listItemId  item id
 * @param {boolean} ongoing  whether the item is in progress
 * @returns {void}
 */
export async function updateItemOngoingStatus(listId: string, listItemId: string, ongoing: boolean = true) {
  const listItems = _lists$[listId].listItems.get();
  if (!listItems) {
    console.warn('No list items found for the list:', listId, '. List item not updated:', listItemId);
    return;
  }

  const itemIndex = listItems.findIndex((item) => item.listItemId === listItemId);
  if (itemIndex < 0) {
    console.warn('Item not found and not updated', listItemId);
    return;
  }

  const assigneeId = _user$.uid?.get();
  const assignee = _user$.names?.get();
  const updatedAt = new Date().toISOString();

  _lists$[listId].listItems[itemIndex].assign({
    ongoing,
    assigneeId,
    assignee,
    updatedAt,
  });

  // recreate items to trigger reactivity
  _lists$[listId].listItems.set([...(_lists$[listId].listItems.get() || [])]);

  // update the item on the server
  queueOperation('listItem:update', {
    listId,
    listItemId,
    assigneeId,
    ongoing,
    updatedAt,
  });
}

/**
 * Mark item as deleted
 *
 * @param {string} listId  list id
 * @param {string} listItemId  item id
 * @returns {void}
 */
export async function markItemAsDeleted(listId: string, listItemId: string) {
  const listItems = _lists$[listId].listItems.get();
  if (!listItems) {
    console.warn('No list items found for the list:', listId, '. List item not updated:', listItemId);
    return;
  }

  const itemIndex = listItems.findIndex((item) => item.listItemId === listItemId);
  if (itemIndex < 0) {
    console.warn('Item not found and not updated', listItemId);
    return;
  }

  const updatedAt = new Date().toISOString();
  _lists$[listId].listItems[itemIndex].assign({
    deleted: true,
    updatedAt,
  });

  // update the item on the server
  queueOperation('listItem:update', {
    listId,
    listItemId,
    deleted: true,
    updatedAt,
  });
}

/**
 * Duplicate completed item
 * and mark it as not completed and not ongoing
 * and not assigned to anyone
 *
 * @param {string} listId  list id
 * @param {string} listItemId  item id
 * @returns {void}
 */
export async function duplicateCompletedItem(listId: string, listItemId: string) {
  const listItems = _lists$[listId].listItems.get();
  if (!listItems) {
    console.warn('No list items found for the list:', listId, '. List item not updated:', listItemId);
    return;
  }

  const itemIndex = listItems.findIndex((item) => item.listItemId === listItemId);
  if (itemIndex < 0) {
    console.warn('Item not found and not updated', listItemId);
    return;
  }

  const item = listItems[itemIndex];
  const newItem: Partial<Item> = {
    ...item,
    listItemId: generateId(),
    completed: false,
    completedAt: null,
    ongoing: false,
    assigneeId: null,
    assignee: null,
    updatedAt: new Date().toISOString(),
  };

  addItem(listId, newItem);
}
