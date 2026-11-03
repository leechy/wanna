// hooks and state
import { router, useLocalSearchParams } from 'expo-router';
import { useSelector } from '@legendapp/state/react';
import { useThemeColor } from '@/hooks/useThemeColor';
import { invitations$ as _invitations$ } from '@/state/state';
import { trackEvent } from '@/utils/analytics';

// utils
import { convertItemsToListItems } from '@/utils/lists';

// components
import { ScrollView, StyleSheet, View } from 'react-native';
import Page from '@/components/Page';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ItemsList } from '@/components/ItemsList';
import { BackLink } from '@/components/BackLink';
import SmallButton from '@/components/SmallButton';
import { globalStyles } from '@/constants/GlobalStyles';

/**
 * A list someone invited the user to: what is in it and who is there,
 * joining goes the same way as a shared link
 */
export default function InvitationScreen() {
  const { listId } = useLocalSearchParams<{ listId: string }>();
  const invitation = useSelector(() => _invitations$[listId]?.get());

  const warningColor = useThemeColor({}, 'warning');
  const onWarningColor = useThemeColor({}, 'onWarning');

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
          <BackLink noTitle={true} />
        </View>
        <ThemedText style={styles.message}>This invitation isn't there any more</ThemedText>
      </Page>
    );
  }

  const { list, invitedBy } = invitation;
  const items = convertItemsToListItems(list.listItems).filter((item) => !item.completed);
  const members = list.users?.map((user) => user.names).join(', ');

  return (
    <Page hasHeader={false}>
      <View style={[globalStyles.customHeader, globalStyles.customPageHeader]}>
        <BackLink noTitle={true} />
        <View style={globalStyles.listProperties}>
          <SmallButton title="Join" onPress={join} color={onWarningColor} backgroundColor={warningColor} />
        </View>
      </View>

      <ThemedView style={globalStyles.titleContainer}>
        <ThemedText type="title">{list.name + ' '}</ThemedText>
      </ThemedView>

      <ScrollView contentContainerStyle={styles.container}>
        <ThemedText>
          {invitedBy} invited you{members ? `, ${members} ${list.users?.length === 1 ? 'is' : 'are'} in the list` : ''}
        </ThemedText>
        {items.length ? (
          <ItemsList items={items} />
        ) : (
          <ThemedText style={styles.message}>The list is empty for now</ThemedText>
        )}
      </ScrollView>
    </Page>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  message: {
    padding: 16,
    textAlign: 'center',
  },
});
