import { Item } from '@/types/Item';

export type ListItem = {
  type: // item types
  | 'new'
    | 'item'
    | 'task'
    // list types
    | 'shopping-list'
    | 'project'
    | 'recipe'
    // other types
    | 'contact'
    | 'group';
  id: string;
  label: string;
  list?: string;
  shared?: string[];
  deadline?: string | number | null;
  quantity?: number;
  ongoing?: boolean | number; // replacement for the progress property
  completed?: boolean | number;
  updatedAt?: string;
  sortOrder?: number;
  completedAt?: string | null;
  assignee?: string | null;
  assigneeId?: string | null;
};

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
