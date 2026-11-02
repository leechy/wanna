import { SvgProps } from 'react-native-svg';
import { ListItem } from '@/types/listItem';
import type { ShoppingItemActions } from '@/components/ShoppingItemRow';

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
  // shopping items: tap, swipes and the long press menu instead of the handlers above
  shoppingActions?: ShoppingItemActions;
  items: ListItem[];
  onToggle?: () => void;
  isOpen?: boolean;
  showEmpty?: boolean;
  emptyText?: string;
  onNew?: () => void;
};
