import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState } from 'react-native';
import * as Crypto from 'expo-crypto';
import { createClient, Session } from '@supabase/supabase-js';

import { observable, ObservableObject } from '@legendapp/state';
import { configureSynced, syncObservable } from '@legendapp/state/sync';
import { configureSyncedSupabase, syncedSupabase } from '@legendapp/state/sync-plugins/supabase';
import { observablePersistAsyncStorage } from '@legendapp/state/persist-plugins/async-storage';

import { Database } from './database.types';
import { UserState } from '@/types/user';

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

// Initialize Supabase
export const supabase = initSupabase();

// provide a function to generate ids locally
export const generateId = () => Crypto.randomUUID();

// pass the generateId function to the syncedSupabase plugin
configureSyncedSupabase({ generateId });

// Create a configured sync function
export const customSynced = configureSynced(syncedSupabase, {
  // Use React Native Async Storage
  persist: {
    plugin: observablePersistAsyncStorage({
      AsyncStorage,
    }),
  },
  generateId,
  supabase,
  changesSince: 'last-sync',
  fieldCreatedAt: 'created_at',
  fieldUpdatedAt: 'updated_at',
  // Optionally enable soft deletes
  fieldDeleted: 'deleted',
});

// configuration for the AsyncStorage plugin
export const persistOptions = configureSynced({
  persist: {
    plugin: observablePersistAsyncStorage({
      AsyncStorage,
    }),
  },
});

/**
 * User, profile and session data
 */
/**
 * User and session data
 *
 * @type {ObservableObject}
 */
export const user$: ObservableObject<UserState> = observable({
  id: null,
  session: null as Session | null,
  expoPushToken: '',
  devicePushToken: '',
  notificationStatus: 'undetermined',
});

// Persist user data observable in AsyncStorage
syncObservable(
  user$,
  persistOptions({
    persist: {
      plugin: observablePersistAsyncStorage({
        AsyncStorage,
      }),
    },
  })
);

/**
 * User profile data
 * for now it will keep only the name,
 * but in the future we can store a lot more, like all settings:
 * language, units, etc.
 *
 * @type {ObservableObject}
 */
export const profiles$ = observable(
  customSynced({
    supabase,
    collection: 'user_profiles',
    select: (from) => from.select('id, user_id, names'),
    // TODO: Filter only the users that we are sharing lists with
    // filter: (select) => select.eq('user_id', user$.id.get() || ''),
    // Don't allow delete
    actions: ['read', 'create', 'update'],
    // Realtime filter by user_id
    // TODO: not just current user, but all users we are sharing lists with
    // realtime: { filter: `user_id=eq.${user$.id.get()}` },
    realtime: true,
    // Persist data and pending changes locally
    persist: { name: 'profiles', retrySync: true },
    retry: { infinite: true },
    // Sync only diffs
    changesSince: 'last-sync',
  })
);

/**
 * Set the user id from the Supabase session
 *
 * @param {Session | null} session
 * @returns {void}
 */
export function setSession(session: Session | null) {
  // set id - we are going to use this a lot
  user$.id.set(session?.user.id || null);
  // the rest of the session we'll keep for the future
  user$.session.set(session);
}

/**
 * User lists
 * selecting everything from the lists table
 * TODO: filter out the lists that are not shared with the current user
 *       in the realtime sections
 *
 * @type {ObservableObject}
 */
export const lists$ = observable(
  customSynced({
    supabase,
    collection: 'lists',
    select: (from) => from.select('*'),
    filter: (select) => select.contains('user_ids', [user$.id.get() || '']),
    actions: ['create', 'read', 'update', 'delete'],
    // Realtime filter by user_id
    // TODO: not just current user, but all users we are sharing lists with
    // realtime: { filter: `user_ids=cs.[${user$.get().id || ''}]`, },
    realtime: true,
    // Persist data and pending changes locally
    persist: { name: 'lists', retrySync: true },
    retry: { infinite: true },
    // Sync only diffs
    changesSince: 'last-sync',
    transform: {
      load(value, method) {
        console.log('lists$ load user id', user$.get().id);
        console.log('load', value, method);
        return value;
      },
      save(value) {
        console.log('lists$ save user id', user$.get().id);
        console.log('save', value);
        return value;
      },
    },
  })
);
