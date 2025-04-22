// components
import { Stack } from 'expo-router';
import { ModalOptions } from '@/app/(tabs)/_layout';

export default function ShoppingLayout() {
  return (
    <Stack initialRouteName="index" screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="index"
        options={{
          title: 'Shopping',
        }}
      />
      <Stack.Screen name="[list]" />
      <Stack.Screen name="list-modal" options={ModalOptions} />
      <Stack.Screen name="item-modal" options={ModalOptions} />
      <Stack.Screen name="choose-contact" />
    </Stack>
  );
}
