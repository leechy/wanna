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

  sortOrder?: number;

  deleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
};
