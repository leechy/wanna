import {
  Text,
  StyleSheet,
  View,
  useColorScheme,
  TouchableOpacity,
} from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { Colors } from '@/constants/Colors';

interface CollapsibleHeaderProps {
  title: string;
  items?: number;
  color?: string;
  isOpen: boolean;
  onToggle: () => void;
}

export function CollapsibleHeader({
  title,
  items,
  color,
  isOpen,
  onToggle,
}: CollapsibleHeaderProps) {
  const theme = useColorScheme() ?? 'light';
  const titleColor =
    color ?? (theme === 'light' ? Colors.light.text : Colors.dark.text);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.heading}
        onPress={onToggle}
        activeOpacity={0.4}
      >
        <Feather
          name="chevron-right"
          size={24}
          color={theme === 'light' ? Colors.light.text : Colors.dark.text}
          style={[
            styles.chevron,
            { transform: [{ rotate: isOpen ? '90deg' : '0deg' }] },
          ]}
        />
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
    fontFamily: 'Nunito',
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 24,
  },
  number: {
    marginLeft: 8,
    fontFamily: 'Nunito',
    fontSize: 16,
    fontWeight: 'bold',
    opacity: 0.5,
  },
});
