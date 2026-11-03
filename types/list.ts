import { Item } from '@/types/Item';

export type List = {
  listId: string;
  shareId: string;
  name: string;
  type: 'project' | 'shopping-list' | 'recipe';
  // 'cart': picked items wait in the cart until the trip ends, 'direct': bought right away
  cartMode?: 'cart' | 'direct';
  deadline?: string | null;

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
  // invited and not joined yet, set by the server
  invited?: ListUser[];
  listItems?: Item[];
  // active shopping trips, set by the server
  sessions?: ListSession[];
};

// a list someone invited the user to, with its data to look at before joining
export type Invitation = {
  listId: string;
  invitedBy: string;
  createdAt: string;
  list: List;
};

export type ListUser = {
  uid: string;
  names: string;
};

export type ListSession = {
  sessionId: string;
  startedAt: string;
  shoppers: (ListUser & { lastSeenAt: string })[];
};

export type ListState = {
  [id: string]: List;
};
