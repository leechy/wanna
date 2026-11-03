import { useThemeColor } from '@/hooks/useThemeColor';
import { useColorScheme } from '@/hooks/useColorScheme';

import { Text, type ViewStyle, StyleSheet, Pressable, Platform, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { fullButtonBackgrounds } from '@/constants/Colors';

export type ThemedButtonProps = {
  style?: ViewStyle;
  lightColor?: string;
  darkColor?: string;
  title: string;
  onPress?: () => void;
  // small fits into a header next to the other buttons
  size?: 'default' | 'small';
};

export function ThemedButton({ style, lightColor, darkColor, title, onPress, size = 'default' }: ThemedButtonProps) {
  const small = size === 'small';
  const fullButtonText = useThemeColor({ light: lightColor, dark: darkColor }, 'fullButtonText');
  const theme = useColorScheme();
  const fullButtonBackground = fullButtonBackgrounds[theme];

  return (
    <View style={[styles.container, small && styles.smallContainer, style]}>
      <LinearGradient
        // Button Linear Gradient
        colors={fullButtonBackground as [string, string, ...string[]]}
        locations={[0, 0.23, 1]}
        start={[0.3, -0.3]}
        end={[0.302, 1]}
        style={styles.background}
      >
        <Pressable
          android_ripple={{
            color: '#3a1fc133',
          }}
          style={({ pressed }) => [
            styles.button,
            small && styles.smallButton,
            Platform.select({
              ios: {
                opacity: pressed ? 0.4 : 1,
                backgroundColor: pressed ? '#ffffff' : 'transparent',
              },
            }),
          ]}
          onPress={onPress}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={title}
          accessibilityHint={`Press to ${title}`}
        >
          <Text
            style={[
              {
                color: fullButtonText,
              },
              styles.text,
              small && styles.smallText,
            ]}
          >
            {title}
          </Text>
        </Pressable>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    marginVertical: 12,
    borderRadius: 8,
    shadowColor: '#000',
    boxShadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.25)',
  },
  background: {
    borderRadius: 8,
  },
  button: {
    minHeight: 52,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  smallContainer: {
    alignSelf: 'auto',
    marginVertical: 0,
  },
  smallButton: {
    minHeight: 34,
    width: 'auto',
    paddingHorizontal: 18,
  },
  smallText: {
    fontSize: 17,
    lineHeight: 24,
  },
  text: {
    fontFamily: 'Nunito',
    fontSize: 21,
    // iOS draws the same weight much heavier
    fontWeight: Platform.OS === 'ios' ? '700' : '900',
    lineHeight: 32,
    textAlign: 'center',
  },
});
