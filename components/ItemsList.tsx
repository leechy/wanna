// hooks
import { useThemeColor } from '@/hooks/useThemeColor';

// components
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// icons
import SquareIcon from '../assets/symbols/square.svg';
import PlusIcon from '../assets/symbols/square-plus.svg';
import CartIcon from '../assets/symbols/cart-arr-down.svg';
import CartWithItemIcon from '../assets/symbols/cart-item-fill.svg';
import SubmenuIOS from '../assets/symbols/submenu-ios.svg';
import SubmenuAndroid from '../assets/symbols/submenu-android.svg';
import ChevronRightIcon from '../assets/symbols/chevron-right.svg';

// types
import { ListItem } from '@/types/listItem';

interface ItemsListProps {
  newItemLabel?: string;
  items?: ListItem[];
}

export function ItemsList({ newItemLabel, items }: ItemsListProps) {
  const backgroundColor = useThemeColor({}, 'listBackground');
  const borderBottomColor = useThemeColor({}, 'listSeparator');
  const textColor = useThemeColor({}, 'text');
  const primaryColor = useThemeColor({}, 'primary');
  const disabledColor = useThemeColor({}, 'disabled');
  const inactiveColor = useThemeColor({}, 'inactive');
  const barelyVisibleColor = useThemeColor({}, 'barelyVisible');
  const touchableColor = useThemeColor({}, 'touchable');

  const onNewItem = () => {
    console.log('onNewItem');
  };

  function renderItem({ item, index }: { item: ListItem; index: number }) {
    const itemBorderRadius =
      index === 0
        ? { borderBottomColor, borderTopLeftRadius: 8, borderTopRightRadius: 8 }
        : index === items?.length
        ? {
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8,
            borderBottomWidth: 0,
          }
        : { borderBottomColor };
    return (
      <View style={[styles.item, { backgroundColor }, itemBorderRadius]}>
        <LinearGradient
          // Item In Progress Linear Gradient
          colors={[
            backgroundColor + '00',
            item.inProgress ? primaryColor + '1d' : backgroundColor + '00',
          ]}
          start={[0, 0]}
          end={[1, 0]}
          style={[styles.gradient, itemBorderRadius]}
        >
          <TouchableOpacity
            style={styles.button}
            onPress={onNewItem}
            activeOpacity={0.4}
          >
            <SquareIcon
              width={28}
              height={28}
              color={item.type === 'new' ? inactiveColor : touchableColor}
            />
          </TouchableOpacity>
          <View style={styles.labelContainer}>
            <Text
              style={[
                styles.label,
                { color: item.type === 'new' ? inactiveColor : textColor },
              ]}
            >
              {(item.quantity || 0) > 1 && <>{item.quantity} &times; </>}
              {item.label}
            </Text>
          </View>
          {item.type === 'new' ? (
            <SubmenuIcon width={28} height={28} color={disabledColor} />
          ) : item.type === 'item' ? (
            <>
              {item.inProgress ? (
                <CartWithItemIcon width={28} height={28} color={primaryColor} />
              ) : (
                <CartIcon width={28} height={28} color={touchableColor} />
              )}
              <SubmenuIcon width={28} height={28} color={disabledColor} />
            </>
          ) : (
            <ChevronRightIcon
              width={28}
              height={28}
              color={barelyVisibleColor}
            />
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
          {
            id: 'new',
            label: newItemLabel || 'New item',
            type: 'new',
          },
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
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 48,
  },
  labelContainer: {
    flex: 1,
    flexDirection: 'column',
    alignContent: 'center',
    // borderWidth: 1,
  },
  label: {
    fontFamily: 'Montserrat',
    fontSize: 16,
    lineHeight: 19,
  },
  button: {
    padding: 5,
  },
  chevron: {
    padding: 0,
  },
});

function SubmenuIcon({
  width,
  height,
  color,
}: {
  width: number;
  height: number;
  color: string;
}) {
  return Platform.OS === 'ios' || Platform.OS === 'macos' ? (
    <SubmenuIOS width={width || 28} height={height || 28} color={color} />
  ) : (
    <SubmenuAndroid width={width || 28} height={height || 28} color={color} />
  );
}
