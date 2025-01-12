export type ListItem = {
  type: 'new' | 'item' | 'task' | 'shopping-list' | 'project' | 'contact' | 'group';
  id: string;
  label: string;
  list?: string;
  shared?: string[];
  deadline?: number;
  quantity?: number;
  inProgress?: boolean | number;
  completed?: boolean | number;
};
