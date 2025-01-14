// hooks
import { useThemeColor } from '@/hooks/useThemeColor';

// components
import { Platform, Pressable } from 'react-native';

interface PressableAreaProps {
  style?: any;
  onPress: () => void;
  rippleColor?: string;
  children: React.ReactNode;
  testID?: string;
}

export function PressableArea({ style, onPress, rippleColor, children, testID }: PressableAreaProps) {
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
          ios: { opacity: pressed ? 0.4 : 1 },
        }),
      ]}
      onPress={onPress}
      onPressOut={() => Platform.OS === 'android' && onPress()}
      testID={testID}
    >
      {children}
    </Pressable>
  );
}
