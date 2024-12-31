export type ListItem = {
  type: 'new' | 'item' | 'task' | 'list';
  id: string;
  label: string;
  list?: string;
  deadline?: number;
  quantity?: number;
  inProgress?: boolean;
};
