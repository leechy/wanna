import { useCallback } from 'react';
import { AppState } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useSelector } from '@legendapp/state/react';
import { lists$ as _lists$, user$ as _user$ } from '@/state/state';
import { socketService } from '@/services/socketService';

// the server ends a trip after 30 minutes without the list on the shopper's screen
const HEARTBEAT_INTERVAL_MS = 60 * 1000;

/**
 * Keeps the shopping trip going while the list is on the screen
 * and tells who is in the store right now
 *
 * @param {string} listId  list on the screen
 * @returns {{ others: string[], isShopping: boolean }}  names of the other shoppers, and whether the user is one
 */
export function useShoppingTrip(listId: string) {
  useFocusEffect(
    useCallback(() => {
      if (!listId) {
        return;
      }
      const beat = () => socketService.sendNow('session:heartbeat', { listId });
      beat();
      const timer = setInterval(beat, HEARTBEAT_INTERVAL_MS);
      const appState = AppState.addEventListener('change', (state) => {
        if (state === 'active') {
          beat();
        }
      });
      return () => {
        clearInterval(timer);
        appState.remove();
      };
    }, [listId])
  );

  const uid = useSelector(() => _user$.uid?.get());
  const shoppers = useSelector(() => (_lists$[listId]?.sessions.get() ?? []).flatMap((session) => session.shoppers));

  return {
    others: [...new Set(shoppers.filter((shopper) => shopper.uid !== uid).map((shopper) => shopper.names))],
    isShopping: shoppers.some((shopper) => shopper.uid === uid),
  };
}
