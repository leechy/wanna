// hooks
import { useThemeColor } from '@/hooks/useThemeColor';

// components
import { Text, View } from 'react-native';

import CalendarIcon from '@/assets/symbols/square-calendar.svg';
import ListIcon from '@/assets/symbols/square-list.svg';
import PersonaIcon from '@/assets/symbols/persona.svg';
import TwoPersonasIcon from '@/assets/symbols/two-personas.svg';
import ThreePersonasIcon from '@/assets/symbols/three-personas.svg';

// utils
import { humanDate } from '@/utils/dates';
import { globalStyles } from '@/constants/GlobalStyles';

// types
import { ListItem } from '@/types/listItem';

interface ListItemLabelProps {
  item: ListItem;
  showQuantity?: boolean;
  testID?: string;
  testCalendarID?: string;
  testListID?: string;
  testPersonasID?: string;
}

export default function ListItemLabel({
  item,
  showQuantity,
  testID,
  testCalendarID,
  testListID,
  testPersonasID,
}: ListItemLabelProps) {
  const textColor = useThemeColor({}, 'text');
  const touchableColor = useThemeColor({}, 'touchable');
  const dangerColor = useThemeColor({}, 'danger');

  const overdue = ((item.deadline && new Date(item.deadline).getTime()) || 0) < Date.now();

  return (
    <View style={globalStyles.itemListLabelContainer} testID={testID}>
      <Text style={[globalStyles.itemListlabel, { color: textColor }]} adjustsFontSizeToFit={false} numberOfLines={2}>
        {showQuantity && parseInt(item.quantity?.toString() || '0') > 1 && <>{item.quantity} &times; </>}
        {item.label}
      </Text>
      {(item.deadline || item.list || (item.shared?.length || 0) > 0) && (
        <View style={globalStyles.itemListLabelMetaContainer}>
          {item.deadline && (
            <View style={globalStyles.itemListLabelMetaItem} testID={testCalendarID}>
              <CalendarIcon width={14} height={14} color={overdue ? dangerColor : touchableColor} />
              <Text style={[globalStyles.itemListLabelMeta, { color: overdue ? dangerColor : touchableColor }]}>
                {humanDate(new Date(item.deadline).getTime())}
              </Text>
            </View>
          )}

          {item.list && (
            <View style={globalStyles.itemListLabelMetaItem} testID={testListID}>
              <ListIcon width={14} height={14} color={touchableColor} />
              <Text style={[globalStyles.itemListLabelMeta, { color: touchableColor }]}>{item.list}</Text>
            </View>
          )}

          {(item.shared?.length || 0) > 0 && (
            <View style={globalStyles.itemListLabelMetaItem} testID={testPersonasID}>
              {item.shared!.length === 1 ? (
                <>
                  <PersonaIcon width={14} height={14} color={touchableColor} />
                  <Text style={[globalStyles.itemListLabelMeta, { color: touchableColor }]}>{item.shared![0]}</Text>
                </>
              ) : item.shared!.length === 2 ? (
                <>
                  <TwoPersonasIcon width={14} height={14} color={touchableColor} />
                  <Text style={[globalStyles.itemListLabelMeta, { color: touchableColor }]}>
                    {item.shared!.join(' and ')}
                  </Text>
                </>
              ) : (
                <>
                  <ThreePersonasIcon width={14} height={14} color={touchableColor} />
                  <Text style={[globalStyles.itemListLabelMeta, { color: touchableColor }]}>
                    {item.shared!.length} people
                  </Text>
                </>
              )}
            </View>
          )}
        </View>
      )}
    </View>
  );
}
