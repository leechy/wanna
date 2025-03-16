// components
import { Stack } from 'expo-router';

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
      <Stack.Screen
        name="list-modal"
        options={{
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="item-modal"
        options={{
          presentation: 'modal',
        }}
      />
      <Stack.Screen name="choose-contact" />
    </Stack>
  );
}
