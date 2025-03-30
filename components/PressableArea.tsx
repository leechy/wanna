// hooks
import { useThemeColor } from '@/hooks/useThemeColor';

// components
import { AccessibilityRole, Platform, Pressable } from 'react-native';

interface PressableAreaProps {
  style?: any;
  onPress: () => void;
  rippleColor?: string;
  children: React.ReactNode;
  hitSlop?: { top: number; bottom: number; left: number; right: number };
  iOSOpacityPressed?: number;
  testID?: string;
  accessible: boolean;
  accessibilityRole: AccessibilityRole;
  accessibilityLabel: string;
  accessibilityHint: string;
}

export function PressableArea({
  style,
  onPress,
  rippleColor,
  children,
  hitSlop,
  iOSOpacityPressed,
  testID,
  accessible,
  accessibilityRole,
  accessibilityLabel,
  accessibilityHint,
}: PressableAreaProps) {
  const primaryColor = useThemeColor({}, 'primary');

  return (
    <Pressable
      android_ripple={{
        color: rippleColor || primaryColor + '33',
        borderless: false,
      }}
      style={({ pressed }) => [
        style,
        Platform.select({
          ios: { opacity: pressed ? iOSOpacityPressed || 0.4 : 1 },
        }),
      ]}
      onPress={() => Platform.OS !== 'android' && onPress()}
      onPressOut={() => Platform.OS === 'android' && onPress()}
      testID={testID}
      accessible={accessible}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      hitSlop={hitSlop || { top: 10, bottom: 10, left: 5, right: 5 }}
    >
      {children}
    </Pressable>
  );
}
