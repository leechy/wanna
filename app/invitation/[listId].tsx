// hooks and state
import { router, useLocalSearchParams } from 'expo-router';
import { useSelector } from '@legendapp/state/react';
import { invitations$ as _invitations$ } from '@/state/state';
import { trackEvent } from '@/utils/analytics';

// utils
import { convertItemsToListItems } from '@/utils/lists';

// components
import { StyleSheet, View } from 'react-native';
import Page from '@/components/Page';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ItemsList } from '@/components/ItemsList';
import { BackLink } from '@/components/BackLink';
import { ThemedButton } from '@/components/ThemedButton';
import { globalStyles } from '@/constants/GlobalStyles';

/**
 * A list someone invited the user to: what is in it and who is there,
 * joining goes the same way as a shared link
 */
export default function InvitationScreen() {
  const { listId } = useLocalSearchParams<{ listId: string }>();
  const invitation = useSelector(() => _invitations$[listId]?.get());

  function join() {
    if (invitation?.list.shareId) {
      trackEvent('list.join_started', { listId }, { method: 'invitation' });
      router.replace({ pathname: '/shared/[shareId]', params: { shareId: invitation.list.shareId } });
    }
  }

  // joined on another device, or the list is gone
  if (!invitation) {
    return (
      <Page hasHeader={false}>
        <View style={[globalStyles.customHeader, globalStyles.customPageHeader]}>
          <BackLink parentTitle="Back" fallbackPath="/" />
        </View>
        <ThemedText style={styles.message}>This invitation isn't there any more</ThemedText>
      </Page>
    );
  }

  const { list, invitedBy } = invitation;
  const items = convertItemsToListItems(list.listItems).filter((item) => !item.completed);

  return (
    <Page hasHeader={false}>
      <View style={[globalStyles.customHeader, globalStyles.customPageHeader]}>
        <BackLink parentTitle="Back" fallbackPath="/" />
        <ThemedButton title="Join" size="small" onPress={join} />
      </View>

      <ThemedView style={globalStyles.titleContainer}>
        <ThemedText type="title">{list.name + ' '}</ThemedText>
      </ThemedView>

      {/* only the list scrolls */}
      <View style={styles.container}>
        <ThemedText>
          <ThemedText type="defaultSemiBold">{invitedBy}</ThemedText> invited you
        </ThemedText>
        {items.length ? (
          <ItemsList items={items} readOnly={true} style={styles.list} />
        ) : (
          <ThemedText style={styles.message}>The list is empty for now</ThemedText>
        )}
      </View>
    </Page>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    // the line about the invitation belongs to the title
    paddingTop: 0,
    gap: 16,
  },
  list: {
    flex: 1,
    // the list has its own side padding
    marginHorizontal: -16,
  },
  message: {
    padding: 16,
    textAlign: 'center',
  },
});
