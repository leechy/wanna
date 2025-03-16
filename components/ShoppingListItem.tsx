// hooks
import { useThemeColor } from '@/hooks/useThemeColor';

// components
import { ListItem } from '@/types/listItem';
import { StyleProp, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ListItemLabel from './ListItemLabel';

// icons and styles
import CartNotEmptyIcon from '../assets/symbols/cart-not-empty.svg';
import CartIcon from '../assets/symbols/cart.svg';
import ChevronRightIcon from '../assets/symbols/chevron-right.svg';
import RestoreIcon from '../assets/symbols/restore.svg';

import { globalStyles } from '@/constants/GlobalStyles';

interface ShoppingListItemProps {
  item: ListItem;
  actionHandler?: (item: ListItem) => void;
  editHandler?: (item: ListItem) => void;
  checkboxHandler?: (item: ListItem) => void;
  itemBorderRadius: StyleProp<ViewStyle>;
}

export default function ShoppingListItem({
  itemBorderRadius,
  item,
  actionHandler,
  checkboxHandler,
}: ShoppingListItemProps) {
  const backgroundColor = useThemeColor({}, 'listBackground');
  const primaryColor = useThemeColor({}, 'primary');
  const textColor = useThemeColor({}, 'text');
  const touchableColor = useThemeColor({}, 'touchable');
  const barelyVisibleColor = useThemeColor({}, 'barelyVisible');
  const inactiveColor = useThemeColor({}, 'inactive');

  function onItemAction() {
    actionHandler?.(item);
  }

  return (
    <View style={[globalStyles.listItem, { backgroundColor }, itemBorderRadius]}>
      <LinearGradient
        // Item In Progress Linear Gradient
        colors={[backgroundColor + '00', item.ongoing || 0 > 0 ? primaryColor + '1d' : backgroundColor + '00']}
        start={[0, 0]}
        end={[1, 0]}
        style={[globalStyles.listItemGradient, itemBorderRadius]}
      >
        {checkboxHandler && item.completed ? (
          <>
            <TouchableOpacity
              style={globalStyles.listItemLeadButton}
              onPress={() => checkboxHandler(item)}
              activeOpacity={0.4}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={`Check out ${item.label}`}
              accessibilityHint={`Press to check out ${item.label}`}
            >
              <RestoreIcon width={28} height={28} color={touchableColor} />
            </TouchableOpacity>
            <ItemAction onItemAction={onItemAction} itemLabel={item.label} chevronColor={barelyVisibleColor}>
              <ListItemLabel item={item} />
              {item.quantity && (
                <Text style={[globalStyles.itemListProgress, { color: inactiveColor }]}>{`${item.ongoing || 0}/${
                  item.quantity
                }`}</Text>
              )}
            </ItemAction>
          </>
        ) : (
          <ItemAction onItemAction={onItemAction} itemLabel={item.label} chevronColor={barelyVisibleColor}>
            <View style={globalStyles.listItemLeadButton}>
              {item.ongoing || 0 > 0 ? (
                <CartNotEmptyIcon width={28} height={28} color={primaryColor} />
              ) : (
                <CartIcon width={28} height={28} color={textColor} />
              )}
            </View>

            <ListItemLabel item={item} />
            <Text style={[globalStyles.itemListProgress, { color: inactiveColor }]}>
              {item.quantity ? `${item.ongoing || 0}/${item.quantity || 0}` : '0'}
            </Text>
          </ItemAction>
        )}
      </LinearGradient>
    </View>
  );
}

interface ItemActionProps {
  onItemAction: () => void;
  itemLabel: string;
  children: React.ReactNode;
  chevronColor?: string;
}

function ItemAction({ onItemAction, itemLabel, children, chevronColor }: ItemActionProps): React.ReactNode {
  return (
    <TouchableOpacity
      style={globalStyles.listItemAction}
      onPress={onItemAction}
      onLongPress={onItemAction}
      activeOpacity={0.4}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`Open list ${itemLabel}`}
      accessibilityHint={`Press to open ${itemLabel}`}
    >
      {children}
      <ChevronRightIcon width={28} height={28} color={chevronColor} />
    </TouchableOpacity>
  );
}
