import { Keyboard, TextInput, View, type GestureResponderEvent } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface PageProps {
  hasHeader?: boolean;
  // a tap anywhere but the field being typed in hides the keyboard, e.g. a note typed right in a list item
  dismissKeyboardOnTap?: boolean;
  children: React.ReactNode;
}

function dismissKeyboard(event: GestureResponderEvent) {
  const focused = TextInput.State.currentlyFocusedInput();
  if (focused && event.target !== focused) {
    Keyboard.dismiss();
  }
}

export default function Page({ hasHeader, dismissKeyboardOnTap, children }: PageProps) {
  const { top } = useSafeAreaInsets();

  return (
    <View
      style={{ marginTop: hasHeader ? 0 : top, flex: 1 }}
      // only watches the touches, the buttons under the finger still get them
      onTouchEnd={dismissKeyboardOnTap ? dismissKeyboard : undefined}
    >
      {children}
    </View>
  );
}
