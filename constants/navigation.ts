import { Platform } from 'react-native';
import type { NativeStackNavigationOptions } from 'expo-router';

/**
 * A popup on a narrow screen: the system modal.
 * On iOS the header is native, its buttons come from ModalHeader
 */
export const ModalOptions: NativeStackNavigationOptions = {
  presentation: 'modal',
  headerShown: Platform.OS === 'ios',
  animation: Platform.OS === 'ios' ? 'slide_from_bottom' : 'fade_from_bottom',
};

/**
 * A popup on a wide screen: a card in the middle of the stack it is opened in,
 * so a popup of the list stays over the list and doesn't cover the home screen,
 * the card itself is drawn by PopupFrame
 */
export const CardOptions: NativeStackNavigationOptions = {
  presentation: 'containedTransparentModal',
  headerShown: false,
  animation: 'fade',
};

/**
 * The options of a popup screen: the system modal on a narrow screen,
 * a card on a wide one, the screen itself is wrapped in withPopupFrame
 *
 * @param {boolean} wide  the window is wide, see useIsWide
 */
export function popupOptions(wide: boolean): NativeStackNavigationOptions {
  return wide ? CardOptions : ModalOptions;
}
