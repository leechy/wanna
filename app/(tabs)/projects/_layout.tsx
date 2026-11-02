// components
import { Stack } from 'expo-router';
import { ModalOptions } from '@/app/(tabs)/_layout';

// the screen under the others when the app opens on a deep link
export const unstable_settings = { anchor: 'index' };

export default function ProjectsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="index"
        options={{
          title: 'Projects',
        }}
      />
      <Stack.Screen name="[list]" />
      <Stack.Screen name="list-modal" options={ModalOptions} />
      <Stack.Screen name="item-modal" options={ModalOptions} />
      <Stack.Screen name="choose-contact" />
    </Stack>
  );
}
