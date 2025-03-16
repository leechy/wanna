// hooks
import { useThemeColor } from '@/hooks/useThemeColor';

// components
import { Stack } from 'expo-router';
import ListMenu from '@/components/ListMenu';

export default function ShoppingLayout() {
  const primaryColor = useThemeColor({}, 'primary');
  const toolbarBackgroundColor = useThemeColor({}, 'tabBarBackground');
  const backButtonColor = primaryColor + '80';

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Shopping',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="[list]"
        options={({ route }) => ({
          title: '',
          headerShown: false,
          headerStyle: {
            backgroundColor: toolbarBackgroundColor,
          },
          headerBackTitleStyle: {
            fontFamily: 'Montserrat',
          },
          headerTintColor: backButtonColor,
          // @ts-ignore
          headerRight: () => <ListMenu listId={route.params?.list} />,
        })}
      />
      <Stack.Screen
        name="list-modal"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="item-modal"
        options={{
          headerShown: false,
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="choose-contact"
        options={({ route }) => ({
          title: '',
          headerShown: false,
          headerStyle: {
            backgroundColor: toolbarBackgroundColor,
          },
          // @ts-ignore
          headerBackTitle: route.params?.listName || 'Back',
          headerBackTitleStyle: {
            fontFamily: 'Montserrat',
          },
          headerTintColor: backButtonColor,
        })}
      />
    </Stack>
  );
}
