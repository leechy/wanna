// hooks
import { useThemeColor } from '@/hooks/useThemeColor';
import { useEffect, useState } from 'react';

// components
import { FlatList, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { DropdownMenu } from './DropdownMenu';
import NewItem from './NewItem';
import ShoppingListItem from './ShoppingListItem';
import ProjectListItem from './ProjectListItem';
import ListItemLabel from './ListItemLabel';
import ContactListItem from './ContactListItem';
import GroupItem from './GroupItem';

// icons
import SquareIcon from '../assets/symbols/square.svg';
import PlayIcon from '../assets/symbols/square-play.svg';
import PlayFillIcon from '../assets/symbols/square-play-fill.svg';
import CartIcon from '../assets/symbols/cart-arr-down.svg';
import CartWithItemIcon from '../assets/symbols/cart-item-fill.svg';
import SquareMinusIcon from '../assets/symbols/square-minus.svg';
import EditIcon from '../assets/symbols/edit.svg';
import RearrangeIcon from '../assets/symbols/rearrange.svg';
import SubmenuIcon from './SubmenuIcon';
import SquareCheckIcon from '../assets/symbols/square-check.svg';
import RestoreIcon from '../assets/symbols/restore.svg';

// types
import { ListItem } from '@/types/listItem';
import { SvgProps } from 'react-native-svg';
import { DropdownItem } from '@/types/DropdownItem';

interface ItemsListProps {
  newItemLabel?: string;
  newItemHandler?: () => void;
  newItemIcon?: React.FC<SvgProps>;
  actionHandler?: (item: ListItem) => void;
  checkboxHandler?: (item: ListItem) => void;
  longPressHandler?: (item: ListItem) => void;
  editHandler?: (item: ListItem) => void;
  deleteHandler?: (item: ListItem) => void;
  items?: ListItem[];
  inverted?: boolean;
  actionIcon?: boolean;
  submenu?: boolean;
  style?: ViewStyle;
}

export function ItemsList({
  newItemLabel,
  newItemHandler,
  newItemIcon,
  actionHandler,
  checkboxHandler,
  longPressHandler,
  editHandler,
  deleteHandler,
  items,
  inverted = false,
  actionIcon = true,
  submenu = true,
  style,
}: ItemsListProps) {
  const backgroundColor = useThemeColor({}, 'listBackground');
  const borderBottomColor = useThemeColor({}, 'listSeparator');
  const primaryColor = useThemeColor({}, 'primary');
  const disabledColor = useThemeColor({}, 'disabled');
  const touchableColor = useThemeColor({}, 'touchable');
  const dangerColor = useThemeColor({}, 'danger');

  function onNewItem() {
    newItemHandler?.();
  }

  function onItemAction(item: ListItem) {
    actionHandler?.(item);
  }

  function onItemLongPress(item: ListItem) {
    longPressHandler?.(item);
  }

  function onCheckboxToggled(item: ListItem) {
    checkboxHandler?.(item);
  }

  function onEditItem(item: ListItem) {
    editHandler?.(item);
  }

  function onDeleteItem(item: ListItem) {
    deleteHandler?.(item);
  }

  const getListItems = (incomingItems?: ListItem[]) => {
    return [
      ...((newItemLabel
        ? [
            {
              id: 'new',
              label: newItemLabel,
              type: 'new',
            },
          ]
        : []) as ListItem[]),
      ...(incomingItems || []),
    ];
  };
  const [listItems, setListItems] = useState<ListItem[]>(getListItems(items));
  useEffect(() => {
    setListItems(getListItems(items));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  function renderItem({ item, index }: { item: ListItem; index: number }) {
    const itemBorderRadius =
      index === 0
        ? listItems?.length === 1
          ? { borderRadius: 8, borderBottomWidth: 0 }
          : inverted
          ? { borderBottomLeftRadius: 8, borderBottomRightRadius: 8, borderBottomWidth: 0 }
          : { borderBottomColor, borderTopLeftRadius: 8, borderTopRightRadius: 8 }
        : index === (listItems?.length || 0) - 1
        ? inverted
          ? { borderBottomColor, borderTopLeftRadius: 8, borderTopRightRadius: 8 }
          : {
              borderBottomLeftRadius: 8,
              borderBottomRightRadius: 8,
              borderBottomWidth: 0,
            }
        : { borderBottomColor };

    if (item.type === 'new') {
      return <NewItem item={item} icon={newItemIcon} itemBorderRadius={itemBorderRadius} actionHandler={onNewItem} />;
    }
    if (item.type === 'shopping-list') {
      return (
        <ShoppingListItem
          item={item}
          itemBorderRadius={itemBorderRadius}
          actionHandler={(item) => onItemAction(item)}
          checkboxHandler={(item) => onCheckboxToggled(item)}
        />
      );
    }
    if (item.type === 'project') {
      return (
        <ProjectListItem item={item} itemBorderRadius={itemBorderRadius} actionHandler={(item) => onItemAction(item)} />
      );
    }
    if (item.type === 'contact') {
      return (
        <ContactListItem item={item} itemBorderRadius={itemBorderRadius} actionHandler={(item) => onItemAction(item)} />
      );
    }
    if (item.type === 'group') {
      return <GroupItem item={item} itemBorderRadius={itemBorderRadius} />;
    }

    return (
      <View style={[styles.item, { backgroundColor }, itemBorderRadius]}>
        <LinearGradient
          // Item In Progress Linear Gradient
          colors={[backgroundColor + '00', item.ongoing ? primaryColor + '1d' : backgroundColor + '00']}
          start={[0, 0]}
          end={[1, 0]}
          style={[styles.gradient, itemBorderRadius]}
        >
          {checkboxHandler ? (
            <TouchableOpacity
              style={styles.button}
              onPress={() => onCheckboxToggled(item)}
              activeOpacity={0.4}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={`Check out ${item.label}`}
              accessibilityHint={`Press to check out ${item.label}`}
            >
              {item.completed ? (
                <SquareCheckIcon width={28} height={28} color={touchableColor} />
              ) : (
                <SquareIcon width={28} height={28} color={touchableColor} />
              )}
            </TouchableOpacity>
          ) : (
            <View style={styles.button}>
              <SquareIcon width={28} height={28} color={disabledColor} />
            </View>
          )}
          <TouchableOpacity
            onPress={() => onItemAction(item)}
            onLongPress={() => onItemLongPress(item)}
            activeOpacity={0.4}
            style={styles.labelButton}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={
              item.type === 'item'
                ? item.ongoing
                  ? `Remove ${item.label} from the cart`
                  : `Put ${item.label} in the cart`
                : item.ongoing
                ? `Pause ${item.label}`
                : `Start ${item.label}`
            }
            accessibilityHint={
              item.type === 'item'
                ? item.ongoing
                  ? 'Press to remove from the cart'
                  : 'Press to put in the cart'
                : item.ongoing
                ? 'Press to put on pause'
                : 'Press to start'
            }
          >
            <ListItemLabel item={item} showQuantity={true} />
            {!actionIcon ? null : item.completed ? (
              <RestoreIcon width={28} height={28} color={touchableColor} />
            ) : item.type === 'item' ? (
              item.ongoing ? (
                <CartWithItemIcon width={28} height={28} color={primaryColor + '99'} />
              ) : (
                <CartIcon width={28} height={28} color={touchableColor} />
              )
            ) : item.type === 'task' ? (
              item.ongoing ? (
                <PlayFillIcon width={28} height={28} color={primaryColor + '99'} />
              ) : (
                <PlayIcon width={28} height={28} color={touchableColor} />
              )
            ) : null}
          </TouchableOpacity>
          {submenu && (
            <DropdownMenu
              items={
                [
                  !item.completed && {
                    label: 'Rearrange',
                    onPress: () => {},
                    icon: RearrangeIcon,
                    disabled: true,
                  },
                  !item.completed && {
                    label: 'Edit',
                    onPress: () => onEditItem(item),
                    icon: EditIcon,
                  },
                  {
                    label: 'Delete',
                    onPress: () => onDeleteItem(item),
                    color: dangerColor,
                    icon: SquareMinusIcon,
                  },
                ].filter((item) => item) as DropdownItem[]
              }
            >
              <SubmenuIcon width={28} height={28} color={disabledColor} />
            </DropdownMenu>
          )}
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <FlatList
        keyExtractor={(item) => item.id}
        data={listItems}
        renderItem={renderItem}
        style={[styles.list]}
        inverted={inverted}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
  },
  list: {
    height: '100%',
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 56,
    borderBottomWidth: 1,
    overflow: 'hidden',
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 56,
  },
  labelButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelContainer: {
    flex: 1,
    flexDirection: 'column',
    alignContent: 'center',
    // borderWidth: 1,
  },
  label: {
    paddingTop: 3,
    fontFamily: 'Montserrat',
    fontSize: 16,
    lineHeight: 16,
  },
  button: {
    padding: 5,
  },
  chevron: {
    padding: 0,
  },
});
