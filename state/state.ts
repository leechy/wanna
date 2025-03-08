import * as Crypto from 'expo-crypto';

import { observable } from '@legendapp/state';
import { configureSynced, syncObservable } from '@legendapp/state/sync';
import { observablePersistAsyncStorage } from '@legendapp/state/persist-plugins/async-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

// types
import { User } from '@/types/user';
import { ListState } from '@/types/list';
import { QueuedOperation } from '@/types/QueuedOperation';
import { ConnectionState } from '@/types/ConnectionState';

// provide a function to generate ids locally
export const generateId = () => Crypto.randomUUID();

// configure the AsyncStorage as a persist plugin
export const persistOptions = configureSynced({
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

// here are the lists
export const lists$ = observable<ListState>({} as ListState);

syncObservable(
  lists$,
  persistOptions({
    persist: {
      name: 'lists',
    },
  })
);

// Connection state observable
export const connectionStatus$ = observable<ConnectionState>({
  isConnected: false,
  lastConnected: null,
  errors: [],
});

// an observable for the operation queue
export const queue$ = observable<QueuedOperation[]>([]);

syncObservable(
  queue$,
  persistOptions({
    persist: {
      name: 'offline_queue',
    },
  })
);
