import { useThemeColor } from '@/hooks/useThemeColor';

import {
  Text,
  type ViewStyle,
  StyleSheet,
  Pressable,
  Platform,
  View,
  useColorScheme,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { fullButtonBackgrounds } from '@/constants/Colors';

export type ThemedButtonProps = {
  style?: ViewStyle;
  lightColor?: string;
  darkColor?: string;
  title: String;
  onPress?: () => void;
};

export function ThemedButton({
  style,
  lightColor,
  darkColor,
  title,
  onPress,
}: ThemedButtonProps) {
  const fullButtonText = useThemeColor(
    { light: lightColor, dark: darkColor },
    'fullButtonText'
  );
  const theme = useColorScheme() ?? 'light';
  const fullButtonBackground = fullButtonBackgrounds[theme];

  return (
    <View style={[styles.container, style]}>
      <Pressable
        android_ripple={{
          color: fullButtonText,
        }}
        style={({ pressed }) => [
          Platform.select({
            ios: {
              opacity: pressed ? 0.6 : 1,
            },
          }),
        ]}
        onPress={onPress}
      >
        <LinearGradient
          // Button Linear Gradient
          colors={fullButtonBackground as [string, string, ...string[]]}
          locations={[0, 0.23, 1]}
          start={[0.3, -0.3]}
          end={[0.302, 1]}
          style={styles.button}
        >
          <Text
            style={[
              {
                color: fullButtonText,
              },
              styles.text,
            ]}
          >
            {title}
          </Text>
        </LinearGradient>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    marginVertical: 12,
    borderRadius: 8,
    shadowColor: '#000',
    boxShadow: '0px 0px 4px 1px rgba(0, 0, 0, 0.25)',
  },
  button: {
    minHeight: 52,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  text: {
    fontFamily: 'Nunito',
    fontSize: 21,
    fontWeight: '900',
    lineHeight: 32,
    textAlign: 'center',
  },
});
