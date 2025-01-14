// hooks
import { useThemeColor } from '@/hooks/useThemeColor';

// components
import { Platform, StyleSheet, TextInput, View } from 'react-native';

interface TitleInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (text: string) => void;
}

export default function TitleInput({ placeholder, value, onChange }: TitleInputProps) {
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
        style={[styles.titleInput, { color: primaryColor }]}
        autoFocus={true}
        accessible={true}
        accessibilityRole="text"
        accessibilityLabel={placeholder}
        accessibilityHint={`Tap to enter ${placeholder}`}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  titleInputContainer: {
    borderRadius: 12,
    width: '100%',
    transform: [{ rotate: '-1deg' }],
  },
  titleInput: {
    width: '100%',
    height: 100,
    fontFamily: 'GreatVibes-Regular',
    fontSize: Platform.OS === 'ios' ? 60 : 52,
    lineHeight: Platform.OS === 'ios' ? 76 : 66,
  },
});
