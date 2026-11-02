// hooks
import { useThemeColor } from '@/hooks/useThemeColor';

// components
import { AccessibilityRole, Platform, Pressable, type PressableProps } from 'react-native';

interface PressableAreaProps {
  style?: any;
  onPress: () => void;
  onLongPress?: () => void;
  accessibilityActions?: PressableProps['accessibilityActions'];
  onAccessibilityAction?: PressableProps['onAccessibilityAction'];
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
  onLongPress,
  accessibilityActions,
  onAccessibilityAction,
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
      // on Android the press fires on release to show the ripple, unless
      // there is a long press, which must not trigger the press as well
      onPress={() => (Platform.OS !== 'android' || onLongPress) && onPress()}
      onPressOut={() => Platform.OS === 'android' && !onLongPress && onPress()}
      onLongPress={onLongPress}
      accessibilityActions={accessibilityActions}
      onAccessibilityAction={onAccessibilityAction}
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
