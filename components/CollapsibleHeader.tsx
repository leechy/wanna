// hooks
import { useThemeColor } from '@/hooks/useThemeColor';

// components
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native';

// icons
import ChevronRightIcon from '@/assets/symbols/chevron-right.svg';
import ChevronDownIcon from '@/assets/symbols/chevron-down.svg';

interface CollapsibleHeaderProps {
  title: string;
  items?: number;
  color?: string;
  isOpen: boolean;
  clickable?: boolean;
  onToggle: () => void;
}

export function CollapsibleHeader({
  title,
  items,
  color,
  isOpen = false,
  clickable = true,
  onToggle,
}: CollapsibleHeaderProps) {
  const chevronColor = useThemeColor({}, 'text');

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.heading}
        onPress={onToggle}
        activeOpacity={0.4}
        disabled={!clickable}
      >
        {isOpen ? (
          <ChevronDownIcon width={24} height={24} color={chevronColor} />
        ) : (
          <ChevronRightIcon width={24} height={24} color={chevronColor} />
        )}
        <Text style={[styles.title, { color }]}>{title}</Text>
        <Text style={[styles.number, { color }]}>{items}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 0,
    padding: 0,
    borderRightWidth: 1,
    borderRightColor: 'transparent',
  },
  chevron: {
    width: 24,
    height: 24,
  },
  heading: {
    paddingTop: 18,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 4,
  },
  title: {
    fontFamily: 'Montserrat',
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 24,
  },
  number: {
    marginLeft: 8,
    paddingTop: 2,
    fontFamily: 'Montserrat',
    fontSize: 16,
    fontWeight: '500',
    opacity: 0.5,
  },
});
