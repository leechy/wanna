import { AppState } from 'react-native';

import { setSession } from './user';

import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Database } from './database.types';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

// create supabase client
export function initSupabase() {
  const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });

  // Tells Supabase Auth to continuously refresh the session automatically if
  // the app is in the foreground. When this is added, you will continue to receive
  // `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_OUT` event
  // if the user's session is terminated. This should only be registered once.
  AppState.addEventListener('change', (state) => {
    if (state === 'active') {
      supabase.auth.startAutoRefresh();
    } else {
      supabase.auth.stopAutoRefresh();
    }
  });

  // Get the user session once the app is loaded
  supabase.auth.getSession().then(({ data: { session } }) => {
    console.log('get session', session?.user?.id);
    setSession(session);
  });

  // Listen to auth state changes
  supabase.auth.onAuthStateChange((_event, session) => {
    console.log('onAuthStateChange', session?.user?.id);
    setSession(session);
  });

  return supabase;
}
