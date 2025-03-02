import * as Crypto from 'expo-crypto';

import { observable } from '@legendapp/state';
import { synced } from '@legendapp/state/sync';
import { ObservablePersistLocalStorage } from '@legendapp/state/persist-plugins/local-storage';

import { User } from '@/types/user';
import { ListState } from '@/types/list';

// provide a function to generate ids locally
export const generateId = () => Crypto.randomUUID();

// keeps the user state
export const user$ = observable<User>(
  synced({
    initial: null,
    persist: {
      name: 'user',
      plugin: ObservablePersistLocalStorage,
    },
  })
);

export const lists$ = observable<ListState>(
  synced({
    initial: {},
    persist: {
      name: 'lists',
      plugin: ObservablePersistLocalStorage,
    },
  })
);
