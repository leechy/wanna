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
  listId?: string;
  listType?: 'project' | 'shopping-list' | 'recipe';
  shared?: string[];
  deadline?: string | number | null;
  quantity?: string | number;
  ongoing?: boolean | number; // replacement for the progress property
  completed?: boolean | number;
  createdAt?: string;
  updatedAt?: string;
  sortOrder?: number;
  completedAt?: string | null;
  assignee?: string | null;
  assigneeId?: string | null;
};
