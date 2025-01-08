// hooks
import { useThemeColor } from '@/hooks/useThemeColor';

// components
import { StyleProp, Text, TouchableOpacity, View, ViewStyle } from 'react-native';

// styles and icons
import { globalStyles } from '@/constants/GlobalStyles';
import PlusIcon from '@/assets/symbols/square-plus.svg';

// types
import { ListItem } from '@/types/listItem';

interface NewItemProps {
  item: ListItem;
  actionHandler?: (item: ListItem) => void;
  itemBorderRadius: StyleProp<ViewStyle>;
}

export default function NewItem({ item, itemBorderRadius, actionHandler }: NewItemProps) {
  const backgroundColor = useThemeColor({}, 'listBackground');
  const inactiveColor = useThemeColor({}, 'inactive');

  function onItemAction() {
    console.log('ItemsList Action item', item, actionHandler);
    actionHandler?.(item);
  }

  return (
    <View style={[globalStyles.listItem, { backgroundColor }, itemBorderRadius]}>
      <TouchableOpacity style={globalStyles.listItemAction} onPress={onItemAction} activeOpacity={0.4}>
        <View style={globalStyles.listItemLeadButton}>
          <PlusIcon width={28} height={28} color={inactiveColor} />
        </View>
        <View style={globalStyles.itemListLabelContainer}>
          <Text
            style={[globalStyles.itemListlabel, { color: inactiveColor }]}
            adjustsFontSizeToFit={true}
            numberOfLines={2}
          >
            {item.label}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}
