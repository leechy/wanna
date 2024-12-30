import { configureSyncedSupabase } from '@legendapp/state/sync-plugins/supabase';
import { observablePersistAsyncStorage } from '@legendapp/state/persist-plugins/async-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

// utils
import * as Crypto from 'expo-crypto';
import { configureSynced } from '@legendapp/state/sync';

// provide a function to generate ids locally
export const generateId = () => Crypto.randomUUID();

// pass the generateId function to the syncedSupabase plugin
configureSyncedSupabase({ generateId });

// configuration for the AsyncStorage plugin
export const persistOptions = configureSynced({
  persist: {
    plugin: observablePersistAsyncStorage({
      AsyncStorage,
    }),
  },
});
