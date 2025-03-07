import * as Crypto from 'expo-crypto';

import { observable } from '@legendapp/state';
import { configureSynced, synced, syncObservable } from '@legendapp/state/sync';
import {
  ObservablePersistAsyncStorage,
  observablePersistAsyncStorage,
} from '@legendapp/state/persist-plugins/async-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { User } from '@/types/user';
import { ListState } from '@/types/list';

// provide a function to generate ids locally
export const generateId = () => Crypto.randomUUID();

const persistOptions = configureSynced({
  persist: {
    plugin: observablePersistAsyncStorage({
      AsyncStorage,
    }),
  },
});

// keeps the user state
export const user$ = observable<User>({
  uid: null,
  auth: null,
  names: '',
});

syncObservable(
  user$,
  persistOptions({
    persist: {
      name: 'user',
    },
  })
);

export const lists$ = observable<ListState>(
  synced({
    initial: {},
    persist: {
      name: 'lists',
      plugin: ObservablePersistAsyncStorage,
    },
  })
);
