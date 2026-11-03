// components
import { Platform } from 'react-native';
import { Stack } from 'expo-router';
import { ModalOptions } from '@/app/(tabs)/_layout';

// the screen under the others when the app opens on a deep link
export const unstable_settings = { anchor: 'index' };

export default function ShoppingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="index"
        options={{
          title: 'Shopping',
        }}
      />
      <Stack.Screen name="[list]" />
      {/* on iOS the header is native: its buttons come from Stack.Toolbar in the screen */}
      <Stack.Screen name="list-modal" options={{ ...ModalOptions, headerShown: Platform.OS === 'ios' }} />
      <Stack.Screen name="item-modal" options={ModalOptions} />
    </Stack>
  );
}
