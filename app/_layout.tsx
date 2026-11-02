// hooks
import { useEffect } from 'react';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useFonts } from 'expo-font';

// styles
import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { Montserrat_500Medium, Montserrat_600SemiBold, Montserrat_700Bold } from '@expo-google-fonts/montserrat';

// navigation
import { Stack, router } from 'expo-router';

// state
import '@/state/state';
import { useSelector } from '@legendapp/state/react';
import { lists$, user$ } from '@/state/state';

// system
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Notifications from 'expo-notifications';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';

// services
import { socketService } from '@/services/socketService';
import { registerForPushNotifications } from '@/utils/notifications';
import { trackEvent } from '@/utils/analytics';
import { listPath } from '@/utils/lists';

// the screen under the others when the app opens on a deep link
export const unstable_settings = { anchor: '(tabs)' };

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    'GreatVibes-Regular': require('../assets/fonts/GreatVibes-Regular.ttf'),
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
  });

  const user = useSelector(() => user$.get());

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    if (user?.uid) {
      // Initialize socket when user is authenticated
      socketService.initialize();

      // Clean up on unmount
      return () => {
        socketService.dispose();
      };
    }
  }, [user?.uid]);

  // ask for notifications once there is somebody to get them from
  const hasSharedList = useSelector(() =>
    Object.values(lists$.get() ?? {}).some((list) => !list.deleted && (list.users?.length ?? 0) > 1)
  );
  useEffect(() => {
    if (user?.uid && hasSharedList) {
      registerForPushNotifications();
    }
  }, [user?.uid, hasSharedList]);

  // tapping a notification opens its list
  const notificationResponse = Notifications.useLastNotificationResponse();
  useEffect(() => {
    const data = notificationResponse?.notification.request.content.data;
    const list = typeof data?.listId === 'string' ? lists$[data.listId].peek() : undefined;
    if (list) {
      router.push(listPath(list));
      trackEvent('push_opened', { listId: list.listId }, { action: data?.action ?? null });
    }
  }, [notificationResponse]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="+not-found" />
        <Stack.Screen name="sign-in" />
        <Stack.Screen name="shared/[shareId]" />
      </Stack>
      <StatusBar style="auto" />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
