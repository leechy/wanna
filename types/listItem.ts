export type ListItem = {
  type: 'new' | 'item' | 'task' | 'shopping-list' | 'project' | 'contact' | 'group';
  id: string;
  label: string;
  list?: string;
  shared?: string[];
  deadline?: string | number | null;
  quantity?: number;
  inProgress?: boolean | number; // deprecated, use ongoing instead
  ongoing?: boolean | number; // replacement for the progress property
  completed?: boolean | number;
};
