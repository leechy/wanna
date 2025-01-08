// hooks
import { useThemeColor } from '@/hooks/useThemeColor';

// components
import { FlatList, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// icons
import SquareIcon from '../assets/symbols/square.svg';
import PlusIcon from '../assets/symbols/square-plus.svg';
import PlayIcon from '../assets/symbols/square-play.svg';
import PlayFillIcon from '../assets/symbols/square-play-fill.svg';
import CartIcon from '../assets/symbols/cart-arr-down.svg';
import CartWithItemIcon from '../assets/symbols/cart-item-fill.svg';
import ChevronRightIcon from '../assets/symbols/chevron-right.svg';
import CalendarIcon from '../assets/symbols/square-calendar.svg';
import ListIcon from '../assets/symbols/square-list.svg';
import SquareMinusIcon from '../assets/symbols/square-minus.svg';
import EditIcon from '../assets/symbols/edit.svg';
import RearrangeIcon from '../assets/symbols/rearrange.svg';

// types
import { ListItem } from '@/types/listItem';
import { humanDate } from '@/utils/dates';
import SubmenuIcon from './SubmenuIcon';
import { DropdownMenu } from './DropdownMenu';

interface ItemsListProps {
  newItemLabel?: string;
  newItemHandler?: () => void;
  items?: ListItem[];
}

export function ItemsList({ newItemLabel, newItemHandler, items }: ItemsListProps) {
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

  function onItemChecked(item: ListItem) {
    console.log('onItemChecked', item);
  }

  function onItemToggled(item: ListItem) {
    console.log('onItemToggled', item);
  }

  function onItemEdit(item: ListItem) {
    console.log('onItemEdit', item);
  }

  function renderItem({ item, index }: { item: ListItem; index: number }) {
    const itemBorderRadius =
      index === 0
        ? { borderBottomColor, borderTopLeftRadius: 8, borderTopRightRadius: 8 }
        : index === (items?.length || 0) - (newItemLabel !== undefined ? 0 : 1)
        ? {
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8,
            borderBottomWidth: 0,
          }
        : { borderBottomColor };

    const overdue = (item.deadline || 0) < Date.now();

    return (
      <View style={[styles.item, { backgroundColor }, itemBorderRadius]}>
        <LinearGradient
          // Item In Progress Linear Gradient
          colors={[backgroundColor + '00', item.inProgress ? primaryColor + '1d' : backgroundColor + '00']}
          start={[0, 0]}
          end={[1, 0]}
          style={[styles.gradient, itemBorderRadius]}
        >
          <TouchableOpacity
            style={styles.button}
            onPress={item.type === 'new' ? onNewItem : () => onItemChecked(item)}
            activeOpacity={0.4}
          >
            {item.type === 'new' ? (
              <PlusIcon width={28} height={28} color={inactiveColor} />
            ) : (
              <SquareIcon width={28} height={28} color={touchableColor} />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={item.type === 'new' ? onNewItem : () => onItemToggled(item)}
            onLongPress={() => onItemEdit(item)}
            activeOpacity={0.4}
            style={styles.labelButton}
          >
            <View style={styles.labelContainer}>
              <Text
                style={[styles.label, { color: item.type === 'new' ? inactiveColor : textColor }]}
                adjustsFontSizeToFit={true}
                numberOfLines={2}
              >
                {(item.quantity || 0) > 1 && <>{item.quantity} &times; </>}
                {item.label}
              </Text>
              {(item.deadline || item.list) && (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginStart: -2,
                    opacity: 0.6,
                  }}
                >
                  {item.deadline && (
                    <>
                      <CalendarIcon width={14} height={14} color={overdue ? dangerColor : touchableColor} />
                      <Text
                        style={{
                          fontFamily: 'Montserrat',
                          fontSize: 11,
                          color: overdue ? dangerColor : touchableColor,
                        }}
                      >
                        {humanDate(item.deadline)}
                      </Text>
                    </>
                  )}

                  {item.list && (
                    <>
                      <ListIcon width={14} height={14} color={touchableColor} />
                      <Text
                        style={{
                          fontFamily: 'Montserrat',
                          fontSize: 11,
                          color: touchableColor,
                        }}
                      >
                        {item.list}
                      </Text>
                    </>
                  )}
                </View>
              )}
            </View>
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
            ) : item.type === 'list' ? (
              <ChevronRightIcon width={28} height={28} color={barelyVisibleColor} />
            ) : null}
          </TouchableOpacity>
          {item.type !== 'list' && (
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
          )}
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        keyExtractor={(item) => item.id}
        data={[
          ...((newItemLabel
            ? [
                {
                  id: 'new',
                  label: newItemLabel,
                  type: 'new',
                },
              ]
            : []) as ListItem[]),
          ...(items || []),
        ]}
        renderItem={renderItem}
        style={[styles.list]}
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
    minHeight: 48,
    borderBottomWidth: 1,
    overflow: 'hidden',
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 52,
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
