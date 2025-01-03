import { useThemeColor } from '@/hooks/useThemeColor';

import { Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';

interface HeaderButtonProps {
  title: string;
  onPress: () => void;
  color?: string;
}

export default function HeaderButton({
  title,
  onPress,
  color,
}: HeaderButtonProps) {
  const primaryColor = useThemeColor({}, 'primary');

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Text
        style={[
          styles.label,
          {
            color: color || primaryColor,
            fontSize: Platform.OS === 'ios' ? 16 : 18,
          },
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 0,
    padding: 0,
  },
  label: {
    fontFamily: 'Montserrat',
    lineHeight: 24,
    fontWeight: '500',
  },
});
