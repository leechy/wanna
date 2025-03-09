import { ListItem } from '@/types/listItem';

export type List = {
  listId: string;
  shareId: string;
  name: string;
  type: 'project' | 'shopping-list' | 'recipe';
  deadline?: string;

  active: boolean;
  completed: boolean;
  completedAt?: string;
  hideCompleted?: boolean;

  sortOrder?: number;
  notifyOnListShared?: boolean;
  notifyOnListItemsUpdate?: boolean;
  notifyOnItemStateUpdate?: boolean;

  deleted: boolean;
  createdAt: string;
  updatedAt: string;

  users?: ListUser[];
  listItems?: ListItem[];
};

export type ListUser = {
  uid: string;
  names: string;
};

export type ListState = {
  [id: string]: List;
};
