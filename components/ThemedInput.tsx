import { useThemeColor } from '@/hooks/useThemeColor';

import { type ViewStyle, StyleSheet, View, TextInput, TextStyle } from 'react-native';

export type ThemedInputProps = {
  style?: TextStyle;
  containerStyle?: ViewStyle;
  lightColor?: string;
  darkColor?: string;
  placeholder: string;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
  enterKeyHint?: 'done' | 'enter' | 'go' | 'next' | 'previous' | 'search' | 'send';
  value: string;
  onChange?: (value: string) => void;
  onSubmit?: () => void;
};

export function ThemedInput({
  style,
  containerStyle,
  lightColor,
  darkColor,
  placeholder,
  keyboardType,
  enterKeyHint = 'go',
  value,
  onChange,
  onSubmit,
}: ThemedInputProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'inputText');
  const inputPlaceholder = useThemeColor({ light: lightColor, dark: darkColor }, 'inputPlaceholder');
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'inputBackground');
  const cursorColor = useThemeColor({ light: lightColor, dark: darkColor }, 'cursorColor');

  return (
    <View style={[styles.container, containerStyle]}>
      <TextInput
        style={[styles.input, { backgroundColor, color }, style]}
        onChangeText={onChange}
        value={value}
        placeholder={placeholder}
        placeholderTextColor={inputPlaceholder}
        keyboardType={keyboardType ?? 'default'}
        enterKeyHint={enterKeyHint}
        selectionColor={cursorColor}
        cursorColor={cursorColor}
        autoFocus={true}
        accessible
        accessibilityRole="text"
        accessibilityLabel={inputPlaceholder}
        accessibilityHint={`Tap to enter ${inputPlaceholder}`}
        onSubmitEditing={onSubmit}
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
    fontFamily: 'Montserrat',
    fontSize: 18,
    lineHeight: 24,
    height: 56,
  },
});
