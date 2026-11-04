import { Keyboard, TextInput, View, type GestureResponderEvent } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useInPopupCard } from '@/components/PopupFrame';

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
  // a card in the middle of a wide screen is far from the status bar
  const inCard = useInPopupCard();

  return (
    <View
      style={{ marginTop: hasHeader || inCard ? 0 : top, flex: 1 }}
      // only watches the touches, the buttons under the finger still get them
      onTouchEnd={dismissKeyboardOnTap ? dismissKeyboard : undefined}
    >
      {children}
    </View>
  );
}
