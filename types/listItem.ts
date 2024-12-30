export type ListItem = {
  type: 'new' | 'item' | 'task' | 'list';
  id: string;
  label: string;
  quantity?: number;
  inProgress?: boolean;
};
