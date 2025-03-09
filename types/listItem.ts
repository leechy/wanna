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
  inProgress?: boolean | number; // deprecated, use ongoing instead
  ongoing?: boolean | number; // replacement for the progress property
  completed?: boolean | number;
  updatedAt?: string;
  sortOrder?: number;
  completedAt?: string;
};

export function convertItemsToListItems(items?: Item[] | null): ListItem[] {
  if (!items) {
    return [];
  }

  return items.map((item) => {
    return {
      type: 'item',
      id: item.listItemId,
      label: item.name,
      listId: item.listId,
      deadline: item.deadline,
      quantity: item.quantity,
      ongoing: item.ongoing,
      completed: item.completed,
      updatedAt: item.updatedAt,
      sortOrder: item.sortOrder,
    };
  });
}
