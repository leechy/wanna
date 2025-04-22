// hooks
import { useThemeColor } from '@/hooks/useThemeColor';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from '@legendapp/state/react';
import { user$ as _user$ } from '@/state/state';

// components
import { Redirect, Tabs } from 'expo-router';
import { HapticTab } from '@/components/HapticTab';

import WishesIcon from '@/assets/symbols/wishes-icon.svg';
import ShoppingIcon from '@/assets/symbols/shopping-icon.svg';
import ProjectsIcon from '@/assets/symbols/projects-icon.svg';

import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { Platform } from 'react-native';

export const TAB_BAR_HEIGHT = 66;

export const ModalOptions: NativeStackNavigationOptions = {
  presentation: 'modal',
  animation: Platform.OS === 'ios' ? 'slide_from_bottom' : 'fade_from_bottom',
};

export default function TabLayout() {
  const { bottom } = useSafeAreaInsets();
  const tabBarActiveTintColor = useThemeColor({}, 'primary');
  const tabBarBackgroundColor: string = useThemeColor({}, 'tabBarBackground');
  const barelyVisibleColor = useThemeColor({}, 'barelyVisible');

  // in case there is no user, redirect to sign-in
  const user = useSelector(_user$.get());
  if (!user?.uid) {
    return <Redirect href="/sign-in" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: [
          {
            height: TAB_BAR_HEIGHT + bottom,
            backgroundColor: tabBarBackgroundColor,
            borderTopColor: barelyVisibleColor,
            borderTopWidth: 1,
            opacity: 1,
          },
        ],
        tabBarIconStyle: {
          marginTop: 6,
        },
        tabBarLabelStyle: {
          paddingTop: 6,
          fontSize: 10,
          fontFamily: 'Montserrat',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Wishes',
          tabBarIcon: ({ color }) => <WishesIcon width={36} height={36} color={color} />,
          lazy: false,
        }}
      />
      <Tabs.Screen
        name="shopping"
        options={{
          title: 'Shopping',
          tabBarIcon: ({ color }) => <ShoppingIcon width={36} height={36} color={color} />,
          lazy: false,
        }}
      />
      <Tabs.Screen
        name="projects"
        options={{
          title: 'Projects',
          tabBarIcon: ({ color }) => <ProjectsIcon width={36} height={36} color={color} />,
          lazy: false,
        }}
      />
    </Tabs>
  );
}
