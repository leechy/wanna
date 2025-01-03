// hooks
import { useThemeColor } from '@/hooks/useThemeColor';

// components
import { Platform, StyleSheet, TextInput, View } from 'react-native';

interface TitleInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (text: string) => void;
}

export default function TitleInput({
  placeholder,
  value,
  onChange,
}: TitleInputProps) {
  const primaryColor = useThemeColor({}, 'primary');
  const inputBackgroundColor = useThemeColor({}, 'inputBackground');

  return (
    <View
      style={[
        styles.titleInputContainer,
        { backgroundColor: inputBackgroundColor },
      ]}
    >
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChange}
        style={[
          styles.titleInput,
          {
            color: primaryColor,
            height: Platform.OS === 'ios' ? 85 : 104,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  titleInputContainer: {
    borderRadius: 12,
    width: '100%',
    height: 85,
    transform: [{ rotate: '-1deg' }],
  },
  titleInput: {
    width: '100%',
    fontFamily: 'GreatVibes-Regular',
    fontSize: 60,
    lineHeight: 76,
  },
});
