// hooks and utils
import { useEffect } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { copyListLinkToClipboard } from '@/utils/share';
import { lists$ as _lists$ } from '@/state/state';

// components
import Page from '@/components/Page';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { globalStyles } from '@/constants/GlobalStyles';
import { ItemsList } from '@/components/ItemsList';
import { View } from 'react-native';

// icons
import CopyLinkIcon from '@/assets/symbols/copy-link.svg';

// types
import { List } from '@/types/list';
import { BackLink } from '@/components/BackLink';

export default function ChooseContactScreen() {
  const { listId } = useLocalSearchParams();
  const listData = (_lists$[listId as string]?.get() as List) || null;

  useEffect(() => {
    if (listId) {
      console.log('ChooseContactScreen', listId, listData);
    }
  }, [listId, listData]);

  function onCopyLink() {
    copyListLinkToClipboard(listData?.shareId);
  }

  function selectContact(item: any) {
    console.log('selectContact', item);
    router.back();
  }

  return (
    <Page hasHeader={false}>
      <View style={[globalStyles.customHeader, globalStyles.customPageHeader]}>
        {router.canGoBack() && <BackLink listId={listId as string} />}
      </View>
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
