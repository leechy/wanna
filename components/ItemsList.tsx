import { useThemeColor } from '@/hooks/useThemeColor';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import SquareIcon from '../assets/symbols/square.svg';
import PlusIcon from '../assets/symbols/square-plus.svg';
import CartIcon from '../assets/symbols/cart-arr-down.svg';
import SubmenuIOS from '../assets/symbols/submenu-ios.svg';
import SubmenuAndroid from '../assets/symbols/submenu-android.svg';
import ChevronRightIcon from '../assets/symbols/chevron-right.svg';

export function ItemsList() {
  const backgroundColor = useThemeColor({}, 'listBackground');
  const textColor = useThemeColor({}, 'text');
  const primaryColor = useThemeColor({}, 'primary');
  const disabledColor = useThemeColor({}, 'disabled');
  const inactiveColor = useThemeColor({}, 'inactive');
  const barelyVisibleColor = useThemeColor({}, 'barelyVisible');

  const onNewItem = () => {
    console.log('onNewItem');
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.item}>
        <TouchableOpacity
          style={styles.button}
          onPress={onNewItem}
          activeOpacity={0.4}
        >
          <PlusIcon width={28} height={28} color={inactiveColor} />
        </TouchableOpacity>
        <Text style={[styles.label, { color: inactiveColor, flex: 1 }]}>
          New Item
        </Text>
        {Platform.OS === 'ios' || Platform.OS === 'macos' ? (
          <SubmenuIOS width={28} height={28} color={disabledColor} />
        ) : (
          <SubmenuAndroid width={28} height={28} color={disabledColor} />
        )}
      </View>
      <View style={styles.item}>
        <TouchableOpacity
          style={styles.button}
          onPress={onNewItem}
          activeOpacity={0.4}
        >
          <SquareIcon width={28} height={28} color={textColor} />
        </TouchableOpacity>
        <View style={styles.labelContainer}>
          <Text style={[styles.label, { color: textColor }]}>
            6 &times; Milk 1,5%
          </Text>
        </View>
        <ChevronRightIcon width={28} height={28} color={barelyVisibleColor} />
      </View>
      <View style={styles.item}>
        <Text>ItemsList</Text>
      </View>
      <View style={styles.item}>
        <Text>ItemsList</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
    borderRadius: 8,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 48,
    borderBottomWidth: 1,
    borderBottomColor: '#d6d6d6',
  },
  labelContainer: {
    flex: 1,
    flexDirection: 'column',
    alignContent: 'center',
    borderWidth: 1,
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
