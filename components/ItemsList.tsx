// hooks
import { useThemeColor } from '@/hooks/useThemeColor';

// components
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

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
import { DropdownMenu } from './DropdownMenu';
import NewItem from './NewItem';
import ShoppingListItem from './ShoppingListItem';
import ProjectListItem from './ProjectListItem';
import ListItemLabel from './ListItemLabel';

// types
import { ListItem } from '@/types/listItem';
import { SvgProps } from 'react-native-svg';
import { useEffect, useState } from 'react';
import ContactListItem from './ContactListItem';

interface ItemsListProps {
  newItemLabel?: string;
  newItemHandler?: () => void;
  newItemIcon?: React.FC<SvgProps>;
  actionHandler?: (item: ListItem) => void;
  checkboxHandler?: (item: ListItem) => void;
  items?: ListItem[];
}

export function ItemsList({
  newItemLabel,
  newItemHandler,
  newItemIcon,
  actionHandler,
  checkboxHandler,
  items,
}: ItemsListProps) {
  const backgroundColor = useThemeColor({}, 'listBackground');
  const borderBottomColor = useThemeColor({}, 'listSeparator');
  const textColor = useThemeColor({}, 'text');
  const primaryColor = useThemeColor({}, 'primary');
  const disabledColor = useThemeColor({}, 'disabled');
  const inactiveColor = useThemeColor({}, 'inactive');
  const barelyVisibleColor = useThemeColor({}, 'barelyVisible');
  const touchableColor = useThemeColor({}, 'touchable');
  const dangerColor = useThemeColor({}, 'danger');

  function onNewItem() {
    console.log('onNewItem');
    newItemHandler?.();
  }

  function onItemAction(item: ListItem) {
    console.log('ItemsList Action item', item, actionHandler);
    actionHandler?.(item);
  }

  function onItemEdit(item: ListItem) {
    console.log('Edit item', item);
  }

  function onCheckboxToggled(item: ListItem) {
    checkboxHandler?.(item);
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
  }, [items]);

  function renderItem({ item, index }: { item: ListItem; index: number }) {
    const itemBorderRadius =
      index === 0
        ? listItems?.length === 1
          ? { borderRadius: 8 }
          : { borderBottomColor, borderTopLeftRadius: 8, borderTopRightRadius: 8 }
        : index === (listItems?.length || 0) - 1
        ? {
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

    return (
      <View style={[styles.item, { backgroundColor }, itemBorderRadius]}>
        <LinearGradient
          // Item In Progress Linear Gradient
          colors={[backgroundColor + '00', item.inProgress ? primaryColor + '1d' : backgroundColor + '00']}
          start={[0, 0]}
          end={[1, 0]}
          style={[styles.gradient, itemBorderRadius]}
        >
          <TouchableOpacity style={styles.button} onPress={() => onCheckboxToggled(item)} activeOpacity={0.4}>
            <SquareIcon width={28} height={28} color={touchableColor} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onItemAction(item)}
            onLongPress={() => onItemEdit(item)}
            activeOpacity={0.4}
            style={styles.labelButton}
          >
            <ListItemLabel item={item} showQuantity={true} />
            {item.type === 'item' ? (
              item.inProgress ? (
                <CartWithItemIcon width={28} height={28} color={primaryColor + '99'} />
              ) : (
                <CartIcon width={28} height={28} color={touchableColor} />
              )
            ) : item.type === 'task' ? (
              item.inProgress ? (
                <PlayFillIcon width={28} height={28} color={primaryColor + '99'} />
              ) : (
                <PlayIcon width={28} height={28} color={touchableColor} />
              )
            ) : null}
          </TouchableOpacity>

          <DropdownMenu
            items={[
              {
                label: 'Rearrange',
                onPress: () => {},
                icon: RearrangeIcon,
              },
              {
                label: 'Edit',
                onPress: () => {},
                icon: EditIcon,
              },
              {
                label: 'Delete',
                onPress: () => {},
                color: dangerColor,
                icon: SquareMinusIcon,
              },
            ]}
          >
            <SubmenuIcon width={28} height={28} color={disabledColor} />
          </DropdownMenu>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList keyExtractor={(item) => item.id} data={listItems} renderItem={renderItem} style={[styles.list]} />
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
