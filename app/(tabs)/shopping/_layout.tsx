// hooks
import { useThemeColor } from '@/hooks/useThemeColor';

// components
import HeaderButton from '@/components/HeaderButton';
import { router, Stack } from 'expo-router';
import { Platform } from 'react-native';

export default function ShoppingLayout() {
  const primaryColor = useThemeColor({}, 'primary');
  const backgroundColor = useThemeColor({}, 'background');
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
        options={{
          title: '',
          headerShown: true,
          headerStyle: {
            backgroundColor: toolbarBackgroundColor,
          },
          headerBackTitleStyle: {
            fontFamily: 'Montserrat',
          },
          headerTintColor: backButtonColor,
        }}
      />
      <Stack.Screen
        name="new-list"
        options={{
          title: 'New shopping list',
          presentation: 'modal',
          headerStyle: {
            backgroundColor,
          },
          headerTitleStyle: {
            fontFamily: 'Montserrat',
            fontSize: Platform.OS === 'ios' ? 18 : 20,
            fontWeight: '700',
          },
          headerLeft: () =>
            Platform.OS === 'ios' ? (
              <HeaderButton title="Cancel" color={backButtonColor} onPress={() => router.dismissTo('/shopping')} />
            ) : null,
          headerRight: () => <HeaderButton title="Create" onPress={router.back} />,
        }}
      />
      <Stack.Screen
        name="new-item"
        options={({ route }) => ({
          title: 'New item',
          presentation: 'modal',
          headerStyle: {
            backgroundColor,
          },
          headerTitleStyle: {
            fontFamily: 'Montserrat',
            fontSize: Platform.OS === 'ios' ? 18 : 20,
            fontWeight: '700',
          },
          headerLeft: () =>
            Platform.OS === 'ios' ? (
              <HeaderButton
                title="Cancel"
                color={backButtonColor}
                // @ts-ignore
                onPress={() => router.dismissTo(`/shopping/${route.params?.listId}`)}
              />
            ) : null,
          headerRight: () => <HeaderButton title="Add" onPress={router.back} />,
        })}
      />
      <Stack.Screen
        name="choose-contact"
        options={({ route }) => ({
          title: '',
          headerShown: true,
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
