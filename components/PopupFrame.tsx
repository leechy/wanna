// hooks
import { createContext, useContext } from 'react';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useIsWide } from '@/hooks/useLayout';
import { router } from 'expo-router';

// components
import { Pressable, StyleSheet, View } from 'react-native';

// the popup is a card on a wide screen: its header is drawn inside the card, not by the system
const PopupCardContext = createContext(false);

export function useInPopupCard(): boolean {
  return useContext(PopupCardContext);
}

function close() {
  if (router.canGoBack()) {
    router.back();
  } else if (router.canDismiss()) {
    router.dismiss();
  } else {
    router.replace('/shopping');
  }
}

interface PopupFrameProps {
  // the height of the card on a wide screen, it never gets taller than 90% of the space
  height?: number;
  children: React.ReactNode;
}

/**
 * The frame of a popup screen.
 * Narrow screen: nothing, the screen is the system modal.
 * Wide screen: a card in the middle of the stack the popup is opened in,
 * the stack dimmed around it, a tap there closes the popup
 */
export function PopupFrame({ height = 560, children }: PopupFrameProps) {
  const wide = useIsWide();
  const backgroundColor = useThemeColor({}, 'background');

  // the same tree on both sizes, so turning the device keeps what was typed
  return (
    <View style={wide ? styles.backdrop : styles.full}>
      {wide && (
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={close}
          accessibilityRole="button"
          accessibilityLabel="Close"
          accessibilityHint="Closes the popup without saving"
        />
      )}
      <View style={wide ? [styles.card, { backgroundColor, height }] : styles.full}>
        <PopupCardContext.Provider value={wide}>{children}</PopupCardContext.Provider>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  full: {
    flex: 1,
  },
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  card: {
    width: '100%',
    maxWidth: 540,
    maxHeight: '90%',
    borderRadius: 16,
    overflow: 'hidden',
  },
});

/**
 * Wraps a popup screen in the PopupFrame
 *
 * @param {React.ComponentType} Screen  the screen of the popup
 * @param {number} height  the height of the card on a wide screen
 */
export function withPopupFrame<P extends object>(Screen: React.ComponentType<P>, height?: number) {
  function PopupScreen(props: P) {
    return (
      <PopupFrame height={height}>
        <Screen {...props} />
      </PopupFrame>
    );
  }
  PopupScreen.displayName = `Popup(${Screen.displayName ?? Screen.name ?? 'Screen'})`;
  return PopupScreen;
}
