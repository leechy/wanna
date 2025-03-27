import { SvgProps } from 'react-native-svg';
import { ListItem } from '@/types/listItem';

export type ColumnData = {
  title: string;
  color?: string;
  action?: React.ReactNode;
  newItemLabel?: string;
  newItemHandler?: () => void;
  newItemIcon?: React.FC<SvgProps>;
  actionHandler?: (item: ListItem) => void;
  checkboxHandler?: (item: ListItem) => void;
  longPressHandler?: (item: ListItem) => void;
  editHandler?: (item: ListItem) => void;
  deleteHandler?: (item: ListItem) => void;
  resetHandler?: (item: ListItem) => void;
  items: ListItem[];
  onToggle?: () => void;
  isOpen?: boolean;
  showEmpty?: boolean;
  emptyText?: string;
  onNew?: () => void;
};
