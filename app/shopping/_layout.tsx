// hooks and state
import { useSelector } from '@legendapp/state/react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColor } from '@/hooks/useThemeColor';
import { NAV_PANE_WIDTH, useIsWide } from '@/hooks/useLayout';
import { user$ as _user$ } from '@/state/state';

// components
import { Redirect, Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { HomeScreen } from '@/components/HomeScreen';
import { popupOptions } from '@/constants/navigation';

// the screen under the others when the app opens on a deep link
export const unstable_settings = { anchor: 'index' };

/**
 * Narrow screen: the home screen and the lists in one stack.
 * Wide screen: the home screen on the left as navigation, the stack of the list on the right.
 * The stack stays in the same place of the tree, so turning the phone or opening a foldable
 * doesn't lose the open list, its scroll or a half-typed text
 */
export default function ShoppingLayout() {
  const wide = useIsWide();
  const { left, right } = useSafeAreaInsets();
  const borderColor = useThemeColor({}, 'barelyVisible');

  // in case there is no user, redirect to sign-in
  const uid = useSelector(() => _user$.uid?.get());
  if (!uid) {
    return <Redirect href="/sign-in" />;
  }

  return (
    <View style={[styles.row, { paddingLeft: left, paddingRight: right }]}>
      {wide && (
        <View style={[styles.nav, { borderRightColor: borderColor }]}>
          <HomeScreen asNavigation={true} />
        </View>
      )}
      <View style={styles.main}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" options={{ title: 'Shopping' }} />
          <Stack.Screen name="[list]" options={{ animation: wide ? 'none' : 'default' }} />
          <Stack.Screen name="list-modal" options={popupOptions(wide)} />
          <Stack.Screen name="item-modal" options={popupOptions(wide)} />
        </Stack>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  nav: {
    width: NAV_PANE_WIDTH,
    borderRightWidth: StyleSheet.hairlineWidth,
  },
  main: {
    flex: 1,
  },
});
