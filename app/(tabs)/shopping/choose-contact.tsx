import { useThemeColor } from '@/hooks/useThemeColor';

import Page from '@/components/Page';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { globalStyles } from '@/constants/GlobalStyles';
import { ItemsList } from '@/components/ItemsList';
import { copyListLinkToClipboard } from '@/utils/share';
import { View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import CopyLinkIcon from '@/assets/symbols/copy-link.svg';

export default function ChooseContactScreen() {
  const primaryColor = useThemeColor({}, 'primary');

  const { listId } = useLocalSearchParams();

  useEffect(() => {
    if (listId) {
      console.log('ChooseContactScreen', listId);
    }
  }, [listId]);

  function onCopyLink() {
    copyListLinkToClipboard(listId as string);
  }

  function selectContact(item: any) {
    console.log('selectContact', item);
    router.back();
  }

  return (
    <Page hasHeader={true}>
      <ThemedView style={globalStyles.titleContainer}>
        <ThemedText type="title">Who to share with? </ThemedText>
      </ThemedView>
      <View style={{ paddingVertical: 8, paddingHorizontal: 16 }}>
        <ThemedText>
          Choose from the ones you shared lists with in the past, or copy link and send it to someone new
        </ThemedText>
      </View>
      {/* <Accordion title="Shopping Lists" blocks={blocks} openBlock={0} /> */}
      <View style={{ paddingVertical: 16 }}>
        <ItemsList
          newItemLabel="Copy link"
          newItemHandler={onCopyLink}
          newItemIcon={CopyLinkIcon}
          actionHandler={selectContact}
          items={[
            {
              type: 'contact',
              id: '1',
              label: 'Isabelle',
              quantity: 1,
            },
            {
              type: 'contact',
              id: '2',
              label: 'Soulntse',
              quantity: 6,
            },
          ]}
        />
      </View>
    </Page>
  );
}
