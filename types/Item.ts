export type ItemUser = {
  uid: string;
  names: string;
};

export type Item = {
  itemId: string;
  listItemId: string;
  listId: string;

  name: string;
  type: 'item' | 'task';
  units?: string;
  quantity: string | number;
  deadline?: string;

  active?: boolean;
  public?: boolean;

  ongoing?: boolean;
  assignee?: string | null;
  assigneeId?: string | null;
  completed?: boolean;
  completedAt?: string | null;

  // who added the item, gets asked when it's out of stock
  addedById?: string | null;
  unavailable?: boolean;
  unavailableAt?: string | null;
  unavailableNote?: string | null;
  unavailableReply?: string | null;
  // the shopping trip the item was picked in
  sessionId?: string | null;

  sortOrder?: number;

  deleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
};
