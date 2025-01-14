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

import { globalStyles } from '@/constants/GlobalStyles';

interface ShoppingListItemProps {
  item: ListItem;
  actionHandler?: (item: ListItem) => void;
  editHandler?: (item: ListItem) => void;
  itemBorderRadius: StyleProp<ViewStyle>;
}

export default function ShoppingListItem({ itemBorderRadius, item, actionHandler }: ShoppingListItemProps) {
  const backgroundColor = useThemeColor({}, 'listBackground');
  const primaryColor = useThemeColor({}, 'primary');
  const textColor = useThemeColor({}, 'text');
  const barelyVisibleColor = useThemeColor({}, 'barelyVisible');
  const inactiveColor = useThemeColor({}, 'inactive');

  function onItemAction() {
    actionHandler?.(item);
  }

  return (
    <View style={[globalStyles.listItem, { backgroundColor }, itemBorderRadius]}>
      <LinearGradient
        // Item In Progress Linear Gradient
        colors={[backgroundColor + '00', item.inProgress || 0 > 0 ? primaryColor + '1d' : backgroundColor + '00']}
        start={[0, 0]}
        end={[1, 0]}
        style={[globalStyles.listItemGradient, itemBorderRadius]}
      >
        <TouchableOpacity
          style={globalStyles.listItemAction}
          onPress={onItemAction}
          onLongPress={onItemAction}
          activeOpacity={0.4}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={`Open shopping list ${item.label}`}
          accessibilityHint={`Press to open ${item.label}`}
        >
          <View style={globalStyles.listItemLeadButton}>
            {item.inProgress || 0 > 0 ? (
              <CartNotEmptyIcon width={28} height={28} color={primaryColor} />
            ) : (
              <CartIcon width={28} height={28} color={textColor} />
            )}
          </View>

          <ListItemLabel item={item} />
          {item.quantity && (
            <Text style={[globalStyles.itemListProgress, { color: inactiveColor }]}>{`${item.inProgress || 0}/${
              item.quantity
            }`}</Text>
          )}
          <ChevronRightIcon width={28} height={28} color={barelyVisibleColor} />
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
}
