import { Item } from '@/types/Item';
import { ListItem } from '@/types/listItem';
import { humanDate } from './dates';

/**
 * Converts items from the state to the accordion format
 * ... and sorts them by the createdAt date (for now)
 *
 * @param {Item[]} items  Array of list items in the format of the state/database
 * @returns {ListItem[]}  Array of list items in the format of the interface lists
 */
export function convertItemsToListItems(items?: Item[] | null): ListItem[] {
  if (!items) {
    return [];
  }

  return (
    items
      .filter((item) => item.listItemId && !item.deleted)
      // WIP: sort by sortOrder when it's available and how to mix it with the createdAt
      .sort((a, b) => ((a.createdAt || '') > (b.createdAt || '') ? -1 : 1))
      .map((item) => ({
        type: 'item',
        id: item.listItemId,
        label: item.name,
        listId: item.listId,
        deadline: item.deadline,
        quantity: item.quantity,
        ongoing: item.ongoing,
        assignee: item.assignee,
        assigneeId: item.assigneeId,
        completed: item.completed,
        completedAt: item.completedAt,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        sortOrder: item.sortOrder,
      }))
  );
}

/**
 * Groups the items by the completedAt date
 * all items completed within the 10 minutes will be grouped together
 *
 * @param {ListItem[]} items  Array of list items in the format of the interface lists
 * @returns {ListItem[]}  Array of list items divided by group items with the date/time label
 */
export function groupItemsByCompletedAt(items: ListItem[]): ListItem[] {
  const groups: { [date: string]: ListItem[] } = {};

  function getGroupId(item: ListItem): string {
    if (!item.completedAt || typeof item.completedAt !== 'string') {
      return 'unknown';
    }

    const itemDate = new Date(item.completedAt as string).getTime();
    const groupId = Object.keys(groups).find((groupId) => {
      return Math.abs(itemDate - parseInt(groupId, 10)) < 600000;
    });

    return groupId || itemDate.toString();
  }

  // first sort items by the completedAt date
  items.sort((a, b) => ((a.completedAt || '') > (b.completedAt || '') ? -1 : 1));

  // then group them by the completedAt date
  items.forEach((item) => {
    const groupId = getGroupId(item);
    if (!groups[groupId]) {
      groups[groupId] = [];
    }
    groups[groupId].push(item);
  });

  // finally, return the grouped items
  return Object.keys(groups)
    .sort((a, b) => (parseInt(a, 10) > parseInt(b, 10) ? -1 : 1))
    .reduce((acc, groupId) => {
      if (groups[groupId].length === 0) {
        return acc;
      }
      const groupItem: ListItem = {
        type: 'group',
        id: groupId,
        label: groupId === 'unknown' ? 'Some time ago...' : humanDate(parseInt(groupId, 10), true),
      };
      return [...acc, groupItem, ...groups[groupId]];
    }, [] as ListItem[]);
}
