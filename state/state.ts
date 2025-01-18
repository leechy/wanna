import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import { auth, database } from './firebaseConfig';

import { observable, ObservableObject } from '@legendapp/state';
import { configureSynced, syncObservable } from '@legendapp/state/sync';
import { configureSyncedFirebase, syncedFirebase } from '@legendapp/state/sync-plugins/firebase';
import { observablePersistAsyncStorage } from '@legendapp/state/persist-plugins/async-storage';

import { UserProfiles, UserState } from '@/types/user';
import { User, UserProfile } from 'firebase/auth';
import { equalTo, orderByChild, query, ref } from 'firebase/database';

// provide a function to generate ids locally
export const generateId = () => Crypto.randomUUID();

configureSyncedFirebase({
  realtime: true,
  requireAuth: true,
});

// Listen for auth state changes
auth.onAuthStateChanged((user) => {
  if (user) {
    // user$.session.set(user);
    user$.id.set(user.uid);
  } else {
    user$.id.set(null);
    // user$.session.set(null);
  }
});

// Create a configured sync function
export const customSynced = configureSynced(syncedFirebase, {
  // Use React Native Async Storage
  persist: {
    plugin: observablePersistAsyncStorage({
      AsyncStorage,
    }),
  },
  generateId,
  initial: {},
  requireAuth: true,
  realtime: true,
  changesSince: 'last-sync',
  fieldCreatedAt: 'createdAt',
  fieldUpdatedAt: 'updatedAt',
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
  session: null as User | null,
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
export const profile$: ObservableObject<UserProfile> = observable(
  customSynced({
    refPath: () => `/userNames/${user$.id.get() || 'default'}`,
    waitForSet: () => user$.id.get(),
    onSaved: (params) => {
      console.log('profile$ saved', params);
    },
    persist: { name: 'profiles', retrySync: true },
    retry: { infinite: true },
    changesSince: 'last-sync',
  })
);

/**
 * Set the user id from the Firebase user object
 *
 * @param {Session | null} session
 * @returns {void}
 */
export function setSession(session: User | null) {
  // set id - we are going to use this a lot
  user$.id.set(session?.uid || null);
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
    refPath: () => `/lists`,
    waitForSet: () => profile$.lists.get(),
    realtime: true,
    query: () => query(ref(database, 'lists'), orderByChild('users/id'), equalTo(user$.id.get())),
    persist: { name: 'lists', retrySync: true },
    retry: { infinite: true },
    changesSince: 'last-sync',
  })
);
