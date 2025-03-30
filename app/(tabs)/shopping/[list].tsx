// hooks and state
import { useMemo } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { observer } from '@legendapp/state/react';
import { lists$ as _lists$ } from '@/state/state';
import {
  duplicateCompletedItem,
  markItemAsCompleted,
  markItemAsDeleted,
  updateItemOngoingStatus,
  updateList,
} from '@/state/actions-lists';

// utils
import { convertItemsToListItems, groupItemsByCompletedAt } from '@/utils/lists';

// components
import Page from '@/components/Page';
import { Columns } from '@/components/Columns';
import { Pressable, View } from 'react-native';
import DateSelector from '@/components/DateSelector';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import ListMenu from '@/components/ListMenu';
import { BackLink } from '@/components/BackLink';
import ShareMenu from '@/components/ShareMenu';

import { globalStyles } from '@/constants/GlobalStyles';

// types
import { ListItem } from '@/types/listItem';
import { ColumnData } from '@/types/ColumnData';
import ListButtons from '@/components/ListButtons';

function ShoppingListScreen() {
  const params = useLocalSearchParams();
  const listId: string = params?.list ? (Array.isArray(params?.list) ? params.list[0] : params.list) : '';
  const listData = listId ? _lists$[listId]?.get() : null;

  const items = convertItemsToListItems(_lists$[listId]?.listItems.get() || []);

  const openitems = useMemo(() => items.filter((item) => !item.completed), [items]);
  const cartItems = useMemo(() => items.filter((item) => !item.completed && item.ongoing), [items]);
  const completedItems = useMemo(() => groupItemsByCompletedAt(items.filter((item) => item.completed)), [items]);

  function updateDeadline(date: string | number | undefined) {
    if (listId) {
      updateList(listId, {
        deadline: date ? new Date(date).toISOString() : null,
        updatedAt: new Date().toISOString(),
      });
    }
  }

  function newItem() {
    if (listData) {
      router.navigate({
        pathname: '/shopping/item-modal',
        params: {
          listId: listData.listId,
          listName: listData.name,
        },
      });
    }
  }

  function editItem(item: ListItem) {
    if (listData) {
      router.navigate({
        pathname: '/shopping/item-modal',
        params: {
          listId: listData.listId,
          listName: listData.name,
          listItemId: item.id,
        },
      });
    }
  }

  function toggleCart(item: ListItem) {
    updateItemOngoingStatus(listId, item.id, item.ongoing ? false : true);
  }

  function checkoutItem(item: ListItem) {
    markItemAsCompleted(listId, item.id);
  }

  function checkoutBasket() {
    cartItems?.forEach((item) => markItemAsCompleted(listId, item.id, true));
  }

  function restoreItem(item: ListItem) {
    markItemAsCompleted(listId, item.id, false);
  }

  function deleteItem(item: ListItem) {
    markItemAsDeleted(listId, item.id);
  }

  function duplicateItem(item: ListItem) {
    duplicateCompletedItem(listId, item.id);
  }

  function editList() {
    if (listData) {
      router.navigate({
        pathname: '/shopping/list-modal',
        params: {
          listId: listData.listId,
          back: `/shopping/${listData.listId}`,
        },
      });
    }
  }

  const blocks: ColumnData[] = [
    {
      title: 'Still wanna',
      actionHandler: toggleCart,
      checkboxHandler: checkoutItem,
      longPressHandler: editItem,
      editHandler: editItem,
      deleteHandler: deleteItem,
      emptyText: 'List is empty. Add some items!',
      items: openitems,
      showEmpty: listData?.completed ? false : true,
    },
    {
      // title: 'Completed', but in the style of the 'Still wanna' phrase
      title: 'Already got',
      actionHandler: duplicateItem,
      checkboxHandler: restoreItem,
      deleteHandler: deleteItem,
      items: completedItems,
      emptyText: 'No purchases were made.',
      showEmpty: listData?.completed ? true : false,
    },
  ];

  return (
    <Page hasHeader={false}>
      <View style={[globalStyles.customHeader, globalStyles.customPageHeader]}>
        {router.canGoBack() && <BackLink path="/shopping" noTitle={true} />}

        <View style={globalStyles.listProperties}>
          <DateSelector placeholder="No deadline" value={listData?.deadline || undefined} onChange={updateDeadline} />
          <ShareMenu listId={listId} listName={listData?.name} shareId={listData?.shareId} />
          <ListMenu listId={listId} isHeaderMenu={false} />
        </View>
      </View>

      <ThemedView style={globalStyles.titleContainer}>
        <View style={globalStyles.listTitleContainer}>
          <Pressable
            onLongPress={editList}
            style={{ flex: 1 }}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Edit list"
            accessibilityHint="Press and hold to edit the list"
            hitSlop={8}
          >
            <ThemedText type={listData?.completed ? 'completed-title' : 'title'}>
              {listData?.name + ' ' || 'Shopping list '}
            </ThemedText>
          </Pressable>
        </View>
      </ThemedView>

      <Columns blocks={listData?.completed ? blocks.reverse() : blocks} paddingBottom={64} openBlock={0} />
      {!listData?.completed && (
        <ListButtons
          newItem={newItem}
          checkoutBasket={checkoutBasket}
          newItemTitle={openitems?.length > 0 ? 'I also wanna...' : 'I wanna...'}
          cartItems={cartItems?.length || 0}
        />
      )}
    </Page>
  );
}

export default observer(ShoppingListScreen);
