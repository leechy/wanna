// hooks and state
import { useCallback, useMemo, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { observer } from '@legendapp/state/react';
import { lists$ as _lists$, user$ as _user$ } from '@/state/state';
import {
  checkoutCart,
  duplicateCompletedItem,
  markItemAsCompleted,
  markItemAsDeleted,
  replyToUnavailable,
  restoreDeletedItem,
  setItemUnavailable,
  setUnavailableNote,
  updateItemOngoingStatus,
  updateList,
} from '@/state/actions-lists';

// utils
import { convertItemsToListItems, groupItemsByCompletedAt } from '@/utils/lists';
import { useShoppingTrip } from '@/hooks/useShoppingTrip';

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
import { ShoppingNow } from '@/components/ShoppingNow';
import { UndoBar } from '@/components/UndoBar';
import { TextPrompt } from '@/components/TextPrompt';
import type { ShoppingItemActions } from '@/components/ShoppingItemRow';

import { globalStyles } from '@/constants/GlobalStyles';

// types
import { ListItem } from '@/types/listItem';
import { ColumnData } from '@/types/ColumnData';
import ListButtons from '@/components/ListButtons';

function ShoppingListScreen() {
  const params = useLocalSearchParams();
  const listId: string = params?.list ? (Array.isArray(params?.list) ? params.list[0] : params.list) : '';
  const listData = listId ? _lists$[listId]?.get() : null;

  const trip = useShoppingTrip(listId);

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
    checkoutCart(listId);
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

  // the last deleted item, until the undo bar is gone
  const [deleted, setDeleted] = useState<ListItem | null>(null);
  const hideUndo = useCallback(() => setDeleted(null), []);
  // asking for the out of stock note or a custom reply
  const [prompt, setPrompt] = useState<{ kind: 'note' | 'reply'; item: ListItem } | null>(null);

  function submitPrompt(text: string) {
    if (prompt?.kind === 'note') {
      setUnavailableNote(listId, prompt.item.id, text);
    } else if (prompt?.kind === 'reply' && text) {
      replyToUnavailable(listId, prompt.item.id, text);
    }
    setPrompt(null);
  }

  const shoppingActions: ShoppingItemActions = {
    uid: _user$.uid?.get(),
    onToggle: toggleCart,
    onEdit: editItem,
    onDelete: (item) => {
      markItemAsDeleted(listId, item.id);
      setDeleted(item);
    },
    onUnavailable: (item, unavailable) => setItemUnavailable(listId, item.id, unavailable),
    onNote: (item) => setPrompt({ kind: 'note', item }),
    onReply: (item, reply) =>
      reply ? replyToUnavailable(listId, item.id, reply) : setPrompt({ kind: 'reply', item }),
    onRestore: restoreItem,
    onBuyAgain: duplicateItem,
  };

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
      shoppingActions,
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
      shoppingActions,
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
          <ShareMenu
            listId={listId}
            listName={listData?.name}
            shareId={listData?.shareId}
          />
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
      <ShoppingNow names={trip.others} />

      <Columns
        blocks={listData?.completed ? blocks.reverse() : blocks}
        paddingBottom={64}
        openBlock={0}
        swipeTabs={false}
      />
      {!listData?.completed && (
        <ListButtons
          newItem={newItem}
          checkoutBasket={checkoutBasket}
          newItemTitle={openitems?.length > 0 ? 'I also wanna...' : 'I wanna...'}
          cartItems={cartItems?.length || 0}
        />
      )}
      <UndoBar
        message={deleted ? `Deleted ${deleted.label}` : null}
        onUndo={() => deleted && restoreDeletedItem(listId, deleted.id)}
        onHide={hideUndo}
      />
      <TextPrompt
        key={prompt ? `${prompt.kind}-${prompt.item.id}` : 'none'}
        visible={prompt !== null}
        title={prompt?.kind === 'note' ? `What was on the shelf instead of ${prompt.item.label}?` : `Reply about ${prompt?.item.label}`}
        placeholder={prompt?.kind === 'note' ? 'e.g. only 3.2%' : 'e.g. take the bigger one'}
        initialValue={prompt?.kind === 'note' ? prompt.item.unavailableNote ?? '' : ''}
        submitTitle={prompt?.kind === 'note' ? 'Save' : 'Send'}
        onSubmit={submitPrompt}
        onCancel={() => setPrompt(null)}
      />
    </Page>
  );
}

export default observer(ShoppingListScreen);
