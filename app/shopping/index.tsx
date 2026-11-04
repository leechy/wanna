// hooks and state
import { useCallback } from 'react';
import { router, useFocusEffect } from 'expo-router';
import { useIsWide } from '@/hooks/useLayout';

// components
import { StyleSheet, View } from 'react-native';
import Page from '@/components/Page';
import { HomeScreen } from '@/components/HomeScreen';
import { ThemedText } from '@/components/ThemedText';
import { ThemedButton } from '@/components/ThemedButton';

// utils
import { defaultListId, openList } from '@/utils/navigation';

/**
 * Narrow screen: the home screen.
 * Wide screen: the home screen is on the left already, here is the place of the list,
 * so the last list (or the first one) is opened, and if there is none — a hint
 */
export default function ShoppingIndex() {
  const wide = useIsWide();

  useFocusEffect(
    useCallback(() => {
      if (!wide) {
        return;
      }
      const listId = defaultListId();
      if (listId) {
        openList(listId);
      }
    }, [wide])
  );

  if (!wide) {
    return <HomeScreen />;
  }

  return (
    <Page>
      <View style={styles.empty}>
        <ThemedText type="subtitle" style={styles.text}>
          Pick a list or create a new one
        </ThemedText>
        <ThemedButton title="New shopping list" onPress={() => router.navigate('/shopping/list-modal')} />
      </View>
    </Page>
  );
}

const styles = StyleSheet.create({
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 16,
  },
  text: {
    textAlign: 'center',
  },
});
