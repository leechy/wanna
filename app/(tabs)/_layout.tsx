// hooks
import { useThemeColor } from '@/hooks/useThemeColor';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// components
import { Tabs } from 'expo-router';
import { HapticTab } from '@/components/HapticTab';

import WishesIcon from '@/assets/symbols/wishes-icon.svg';
import ShoppingIcon from '@/assets/symbols/shopping-icon.svg';
import ProjectsIcon from '@/assets/symbols/projects-icon.svg';

export default function TabLayout() {
  const { bottom } = useSafeAreaInsets();
  const tabBarActiveTintColor = useThemeColor({}, 'primary');
  const tabBarBackgroundColor: string = useThemeColor({}, 'tabBarBackground');
  const barelyVisibleColor = useThemeColor({}, 'barelyVisible');

  return (
    <Tabs
      screenOptions={{
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: [
          {
            height: 66 + bottom,
            paddingTop: 9,
            backgroundColor: tabBarBackgroundColor,
            borderTopColor: barelyVisibleColor,
            borderTopWidth: 1,
            opacity: 1,
          },
        ],
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
          tabBarIcon: ({ color }) => (
            <WishesIcon width={36} height={36} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="shopping"
        options={{
          title: 'Shopping',
          tabBarIcon: ({ color }) => (
            <ShoppingIcon width={36} height={36} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="projects"
        options={{
          title: 'Projects',
          tabBarIcon: ({ color }) => (
            <ProjectsIcon width={36} height={36} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
