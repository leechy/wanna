// hooks
import { useEffect } from 'react';
import 'react-native-reanimated';

// styles
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useFonts } from 'expo-font';
import {
  Nunito_500Medium,
  Nunito_800ExtraBold,
} from '@expo-google-fonts/nunito';

// navigation
import { Redirect, Stack } from 'expo-router';

// state
import { initSupabase } from '@/state/supabase';
import { useSelector } from '@legendapp/state/react';
import { user$ } from '@/state/user';

// system
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Initialize Supabase at the root of the app
export const supabase = initSupabase();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    'GreatVibes-Regular': require('../assets/fonts/GreatVibes-Regular.ttf'),
    Nunito_500Medium,
    Nunito_800ExtraBold,
  });

  const user = useSelector(user$);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  console.log('user session', user.session);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {/* TODO: improve the login system */}
      <Stack>
        <Stack.Screen name="sign-in" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      {(user?.session || null) === null ? (
        <Redirect href="/sign-in" />
      ) : (
        <Redirect href="/(tabs)" />
      )}
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
