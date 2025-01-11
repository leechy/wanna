// hooks
import { useThemeColor } from '@/hooks/useThemeColor';

// components
import { ListItem } from '@/types/listItem';
import { StyleProp, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import ListItemLabel from './ListItemLabel';

// icons and styles
import PersonIcon from '@/assets/symbols/persona.svg';

import { globalStyles } from '@/constants/GlobalStyles';

interface ContactListItemProps {
  item: ListItem;
  actionHandler?: (item: ListItem) => void;
  editHandler?: (item: ListItem) => void;
  itemBorderRadius: StyleProp<ViewStyle>;
}

export default function ContactListItem({ itemBorderRadius, item, actionHandler }: ContactListItemProps) {
  const backgroundColor = useThemeColor({}, 'listBackground');
  const textColor = useThemeColor({}, 'text');
  const inactiveColor = useThemeColor({}, 'inactive');

  function onItemAction() {
    actionHandler?.(item);
  }

  return (
    <View style={[globalStyles.listItem, { backgroundColor }, itemBorderRadius]}>
      <TouchableOpacity style={globalStyles.listItemAction} onPress={onItemAction} activeOpacity={0.4}>
        <View style={globalStyles.listItemLeadButton}>
          <PersonIcon width={28} height={28} color={textColor} />
        </View>

        <ListItemLabel item={item} />
        {item.quantity && (
          <Text style={[globalStyles.itemListProgress, { color: inactiveColor }]}>{item.quantity}</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
