// hooks and state
import { useEffect } from 'react';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { useSelector } from '@legendapp/state/react';
import { lists$ as _lists$, pendingShare$, user$ as _user$ } from '@/state/state';
import { queueOperation } from '@/state/actions-queue';

// utils
import { listPath } from '@/utils/lists';

// components
import { StyleSheet } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedButton } from '@/components/ThemedButton';

/**
 * Opens a list shared by the link https://app.wanna-wanna.com/shared/<shareId>,
 * joining it first when the user is not a member yet
 */
export default function SharedListScreen() {
  const params = useLocalSearchParams<{ shareId: string }>();
  const shareId = params.shareId ?? '';

  const uid = useSelector(() => _user$.uid?.get());
  const list = useSelector(() =>
    Object.values(_lists$.get() ?? {}).find((l) => l.shareId === shareId && !l.deleted)
  );
  const error = useSelector(() => pendingShare$.error.get());

  useEffect(() => {
    pendingShare$.set({ shareId, error: null });
  }, [shareId]);

  useEffect(() => {
    // joining twice is fine, the server answers with the list either way
    if (uid && shareId && !list) {
      queueOperation('list:join', { shareId });
    }
  }, [uid, shareId, list]);

  // the sign-in screen brings the user back here
  if (!uid) {
    return <Redirect href="/sign-in" />;
  }

  if (list) {
    pendingShare$.set({ shareId: null, error: null });
    return <Redirect href={listPath(list)} />;
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle" style={styles.text}>
        {error ? "This list can't be opened, maybe it was deleted" : 'Opening the list…'}
      </ThemedText>
      {error && <ThemedButton title="Go to my lists" onPress={() => router.replace('/(tabs)/wishes')} />}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 24,
  },
  text: {
    textAlign: 'center',
  },
});
