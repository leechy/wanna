// hooks
import { useThemeColor } from '@/hooks/useThemeColor';

// components
import { Platform, StyleSheet, TextInput, View } from 'react-native';

interface TitleInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (text: string) => void;
  onSubmit?: () => void;
}

export default function TitleInput({ placeholder, value, onChange, onSubmit }: TitleInputProps) {
  const primaryColor = useThemeColor({}, 'primary');
  const inputPlaceholderColor = useThemeColor({}, 'inputPlaceholder');
  const inputBackgroundColor = useThemeColor({}, 'inputBackground');

  return (
    <View style={[styles.titleInputContainer, { backgroundColor: inputBackgroundColor }]}>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={inputPlaceholderColor}
        cursorColor={primaryColor}
        selectionColor={primaryColor + '66'}
        selectionHandleColor={primaryColor}
        value={value}
        onChangeText={onChange}
        onSubmitEditing={onSubmit}
        style={[styles.titleInput, { color: primaryColor }]}
        autoFocus={true}
        accessible={true}
        accessibilityRole="text"
        accessibilityLabel={placeholder}
        accessibilityHint={`Tap to enter ${placeholder}`}
        numberOfLines={1}
        allowFontScaling={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  titleInputContainer: {
    borderRadius: 12,
    width: '100%',
    transform: [{ rotate: '-1deg' }],
    paddingHorizontal: 8,
    paddingVertical: Platform.OS === 'ios' ? 8 : 0,
  },
  titleInput: {
    width: '100%',
    maxHeight: 100,
    fontFamily: 'GreatVibes-Regular',
    fontSize: 46,
    lineHeight: Platform.OS === 'ios' ? 64 : 76,
    // marginVertical: Platform.OS === 'ios' ? undefined : -4,
    padding: 2,
  },
});
