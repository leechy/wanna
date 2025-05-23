// hooks
import { useThemeColor } from '@/hooks/useThemeColor';

// components
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';

// styles and icons
import { globalStyles } from '@/constants/GlobalStyles';
import PurchaseIcon from '@/assets/symbols/bag-fill.svg';

// types
import { ListItem } from '@/types/listItem';

interface GroupItemProps {
  item: ListItem;
  itemBorderRadius: StyleProp<ViewStyle>;
  testId?: string;
}

export default function GroupItem({ item, itemBorderRadius, testId }: GroupItemProps) {
  const backgroundColor = useThemeColor({}, 'listBackground');
  const inactiveColor = useThemeColor({}, 'inactive');

  return (
    <View style={[styles.groupItem, { backgroundColor, minHeight: 20 }, itemBorderRadius]} testID={testId}>
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
