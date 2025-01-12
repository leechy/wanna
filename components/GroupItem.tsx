// hooks
import { useThemeColor } from '@/hooks/useThemeColor';

// components
import { StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';

// styles and icons
import { globalStyles } from '@/constants/GlobalStyles';
import PurchaseIcon from '@/assets/symbols/bag-fill.svg';

// types
import { ListItem } from '@/types/listItem';

interface GroupItemProps {
  item: ListItem;
  actionHandler?: (item: ListItem) => void;
  itemBorderRadius: StyleProp<ViewStyle>;
}

export default function GroupItem({ item, itemBorderRadius, actionHandler }: GroupItemProps) {
  const backgroundColor = useThemeColor({}, 'listBackground');
  const inactiveColor = useThemeColor({}, 'inactive');

  function onItemAction() {
    console.log('ItemsList Action item', item, actionHandler);
    actionHandler?.(item);
  }

  return (
    <View style={[styles.groupItem, { backgroundColor, minHeight: 20 }, itemBorderRadius]}>
      <View style={globalStyles.listItemLeadButton}>
        <PurchaseIcon width={20} height={20} color={inactiveColor} />
      </View>
      <View style={globalStyles.itemListLabelContainer}>
        <Text
          style={[globalStyles.itemListlabel, { color: inactiveColor, fontSize: 14 }]}
          adjustsFontSizeToFit={true}
          numberOfLines={2}
        >
          {item.label}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  groupItem: {
    ...globalStyles.listItem,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
