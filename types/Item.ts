export type ItemUser = {
  uid: string;
  names: string;
};

export type Item = {
  itemId: string;
  listItemId: string;
  listId: string;

  name: string;
  type: string;
  units?: string;
  quantity: number;
  deadline?: string;

  active?: boolean;
  public?: boolean;

  ongoing?: boolean;
  assignee?: ItemUser;
  assigneeId?: string;
  completed?: boolean;

  sortOrder?: number;

  deleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
};
