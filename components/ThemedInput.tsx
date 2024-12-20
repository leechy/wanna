import {
  Text,
  type ViewStyle,
  StyleSheet,
  Pressable,
  Platform,
  View,
  TextInput,
  TextStyle,
} from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedInputProps = {
  style?: TextStyle;
  containerStyle?: ViewStyle;
  lightColor?: string;
  darkColor?: string;
  placeholder: string;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
  value: string;
  onChange?: (value: string) => void;
};

export function ThemedInput({
  style,
  containerStyle,
  lightColor,
  darkColor,
  placeholder,
  keyboardType,
  value,
  onChange,
}: ThemedInputProps) {
  const color = useThemeColor(
    { light: lightColor, dark: darkColor },
    'inputText'
  );
  const inputPlaceholder = useThemeColor(
    { light: lightColor, dark: darkColor },
    'inputPlaceholder'
  );
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    'inputBackground'
  );
  const cursorColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    'cursorColor'
  );

  return (
    <View style={[styles.container, containerStyle]}>
      <TextInput
        style={[styles.input, { backgroundColor, color }, style]}
        onChangeText={onChange}
        value={value}
        placeholder={placeholder}
        placeholderTextColor={inputPlaceholder}
        keyboardType={keyboardType ?? 'default'}
        selectionColor={cursorColor}
        cursorColor={cursorColor}
        autoFocus={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    alignSelf: 'stretch',
    padding: 0,
  },
  input: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 0,
    borderRadius: 8,
    fontFamily: 'Nunito',
    fontSize: 18,
  },
});
