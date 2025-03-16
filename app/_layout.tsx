// hooks
import { useEffect, useRef, useState } from 'react';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useFonts } from 'expo-font';

// styles
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Montserrat_500Medium, Montserrat_600SemiBold, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import { Colors } from '@/constants/Colors';

// navigation
import { Stack } from 'expo-router';

// state
import '@/state/state';
import { useSelector } from '@legendapp/state/react';
import { user$ } from '@/state/state';

// system
import 'react-native-reanimated';
import * as Notifications from 'expo-notifications';
import * as SplashScreen from 'expo-splash-screen';
import * as NavigationBar from 'expo-navigation-bar';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';

// services
import { socketService } from '@/services/socketService';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // Register for push notifications
  const [notification, setNotification] = useState<Notifications.Notification | undefined>(undefined);
  const notificationListener = useRef<Notifications.EventSubscription>();
  const responseListener = useRef<Notifications.EventSubscription>();

  useEffect(() => {
    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      setNotification(notification);
      console.log('Notification received while in the foreground', notification);
    });

    // This listener is fired whenever a user taps on or interacts with a notification
    // (works when app is foregrounded, backgrounded, or killed)
    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log('Notification tapped', response);
    });

    return () => {
      notificationListener.current && Notifications.removeNotificationSubscription(notificationListener.current);
      responseListener.current && Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    'GreatVibes-Regular': require('../assets/fonts/GreatVibes-Regular.ttf'),
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
  });

  const user = useSelector(() => user$.get());

  // set the color for the navigation bar
  useEffect(() => {
    if (Platform.OS === 'android' && colorScheme) {
      NavigationBar.setBackgroundColorAsync(Colors[colorScheme].tabBarBackground);
    }
  }, [colorScheme]);

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
  }, [user]);

  const primaryColor = useThemeColor({}, 'primary');
  const toolbarBackgroundColor = useThemeColor({}, 'tabBarBackground');
  const backButtonColor = primaryColor + '80';

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="settings"
          options={{
            headerShown: false,
            headerBackTitle: 'Wishes',
            title: '',
            headerStyle: {
              backgroundColor: toolbarBackgroundColor,
            },
            headerBackTitleStyle: {
              fontFamily: 'Montserrat',
            },
            headerTintColor: backButtonColor,
          }}
        />
        <Stack.Screen name="+not-found" />
        <Stack.Screen name="sign-in" options={{ headerShown: false }} />{' '}
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
