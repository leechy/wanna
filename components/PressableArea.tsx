// hooks
import { useThemeColor } from '@/hooks/useThemeColor';

// components
import { Platform, Pressable } from 'react-native';

interface PressableAreaProps {
  style?: any;
  onPress: () => void;
  rippleColor?: string;
  children: React.ReactNode;
}

export function PressableArea({ style, onPress, rippleColor, children }: PressableAreaProps) {
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
      onPressOut={onPress}
    >
      {children}
    </Pressable>
  );
}
