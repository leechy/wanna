import { useThemeColor } from '@/hooks/useThemeColor';

import { Text, TouchableOpacity, StyleSheet, Platform, StyleProp, ViewStyle } from 'react-native';
import { SvgProps } from 'react-native-svg';

interface HeaderButtonProps {
  title: string;
  icon?: React.FC<SvgProps>;
  iconPosition?: 'start' | 'end';
  onPress: () => void;
  color?: string;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export default function HeaderButton({
  title,
  icon: Icon,
  iconPosition = 'start',
  onPress,
  color,
  style,
  accessibilityLabel = 'Go back',
  accessibilityHint = 'Press to go to the previous screen',
}: HeaderButtonProps) {
  const primaryColor = useThemeColor({}, 'primary');

  return (
    <TouchableOpacity
      style={[styles.container, style || {}]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
    >
      {Icon && iconPosition === 'start' && <Icon width={24} height={24} color={color || primaryColor} />}
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontFamily: 'Montserrat',
    lineHeight: 24,
    fontWeight: '500',
  },
});
