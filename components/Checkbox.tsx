import { useThemeColor } from '@/hooks/useThemeColor';
import { Platform, StyleProp, StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';

import SquareIcon from '@/assets/symbols/square.svg';
import CheckIcon from '@/assets/symbols/square-check.svg';
import { useEffect, useState } from 'react';
import { extractText } from '@/utils/text';

interface CheckboxProps {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  color?: string;
  testID?: string;
  children?: React.ReactNode;
}

export default function Checkbox({ checked, onChange, style, labelStyle, color, testID, children }: CheckboxProps) {
  const primaryColor = useThemeColor({}, 'primary');
  const textColor = useThemeColor({}, 'text');

  const [localState, setLocalState] = useState<boolean>(checked);
  useEffect(() => {
    setLocalState(checked);
  }, [checked]);

  function updateState(newState: boolean) {
    setLocalState(newState);
    onChange?.(newState);
  }

  return (
    <TouchableOpacity
      onPress={() => updateState(!localState)}
      // TODO: this is a workaround for the onPress not working on Android
      // check the production builds for better behavior
      onPressOut={() => Platform.OS === 'android' && updateState(!localState)}
      style={[styles.container, style]}
      testID={testID}
      activeOpacity={0.4}
      accessibilityRole="checkbox"
      accessibilityLabel={`Checkbox for ${extractText(children)}`}
      accessibilityHint={`Press to ${localState ? 'uncheck' : 'check'}`}
    >
      <View style={styles.checkbox}>
        {localState ? (
          <CheckIcon width={28} height={28} color={color || primaryColor} />
        ) : (
          <SquareIcon width={28} height={28} color={color || primaryColor} />
        )}
      </View>
      <Text style={[styles.label, { color: textColor }, labelStyle]}>{children}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
    alignSelf: 'stretch',
  },
  checkbox: {
    marginRight: 8,
    alignSelf: 'flex-start',
  },
  label: {
    flex: 1,
    marginVertical: 3,
    fontFamily: 'Montserrat',
    fontSize: 16,
    lineHeight: 22,
  },
});
