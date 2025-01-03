import HeaderButton from '@/components/HeaderButton';
import { useThemeColor } from '@/hooks/useThemeColor';
import { router, Stack } from 'expo-router';
import { Button, Platform } from 'react-native';

export default function ShoppingLayout() {
  const primaryColor = useThemeColor({}, 'primary');
  const backButtonColor = useThemeColor({}, 'inactive');
  const backgroundColor = useThemeColor({}, 'background');

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
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
              <HeaderButton
                title="Cancel"
                color={backButtonColor}
                onPress={() => router.dismissTo('/shopping')}
              />
            ) : null,
          headerRight: () => (
            <HeaderButton title="Create" onPress={router.back} />
          ),
        }}
      />
    </Stack>
  );
}
