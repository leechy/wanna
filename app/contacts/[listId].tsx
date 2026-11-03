// hooks and state
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from '@legendapp/state/react';
import { lists$ as _lists$, user$ as _user$ } from '@/state/state';
import { inviteToList } from '@/state/actions-invitations';

// utils
import { copyListLinkToClipboard } from '@/utils/share';
import { getContacts } from '@/utils/contacts';

// components
import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ItemsList } from '@/components/ItemsList';
import { BackLink } from '@/components/BackLink';
import SmallButton from '@/components/SmallButton';
import { globalStyles } from '@/constants/GlobalStyles';

// icons
import CopyLinkIcon from '@/assets/symbols/copy-link.svg';
import QrCodeIcon from '@/assets/symbols/qr-code.svg';

// types
import { ListItem } from '@/types/listItem';

/**
 * Everyone the user shares lists with, to invite to this list,
 * the ones with the most shared lists first
 */
export default function ContactsScreen() {
  const { listId } = useLocalSearchParams<{ listId: string }>();
  const { top: safeT } = useSafeAreaInsets();

  const uid = useSelector(() => _user$.uid?.get());
  const list = useSelector(() => _lists$[listId]?.get());
  const contacts = useSelector(() =>
    uid ? getContacts(Object.values(_lists$.get() ?? {}), uid, list) : []
  );

  const items: ListItem[] = contacts.map((contact) => ({
    type: 'contact',
    id: contact.uid,
    label: contact.names,
    // how many lists are shared with them
    quantity: contact.sharedLists,
  }));

  function invite(item: ListItem) {
    const contact = contacts.find((c) => c.uid === item.id);
    if (contact) {
      inviteToList(listId, contact);
      router.back();
    }
  }

  function showQrCode() {
    if (list?.shareId) {
      router.push({ pathname: '/qr/[shareId]', params: { shareId: list.shareId, name: list.name } });
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={[globalStyles.customHeader, Platform.OS === 'android' ? { paddingTop: safeT + 12 } : {}]}>
        <BackLink noIcon={true} parentTitle="Cancel" />
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <ThemedText type="subtitle">Who to share with?</ThemedText>
        <ThemedText>
          {items.length
            ? 'Choose from the ones you share other lists with, or send the link to someone new'
            : 'Send the link or show the QR code to someone new'}
        </ThemedText>
        <ItemsList
          newItemLabel="Copy link"
          newItemHandler={() => copyListLinkToClipboard(list?.shareId)}
          newItemIcon={CopyLinkIcon}
          actionHandler={invite}
          items={items}
        />
        <View style={styles.buttons}>
          <SmallButton title="Show QR code" icon={QrCodeIcon} onPress={showQrCode} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 24,
    gap: 16,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
