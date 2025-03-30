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
import { Columns } from '@/components/Columns';
import Page from '@/components/Page';
import { Pressable, View } from 'react-native';
import DateSelector from '@/components/DateSelector';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import ListMenu from '@/components/ListMenu';
import { BackLink } from '@/components/BackLink';

// styles
import { globalStyles } from '@/constants/GlobalStyles';

// types
import { ListItem } from '@/types/listItem';
import { ColumnData } from '@/types/ColumnData';
import ListButtons from '@/components/ListButtons';

function ProjectScreen() {
  const params = useLocalSearchParams();
  const listId: string = params?.list ? (Array.isArray(params?.list) ? params.list[0] : params.list) : '';
  const listData = listId ? _lists$[listId]?.get() : null;

  const items = convertItemsToListItems(_lists$[listId]?.listItems.get() || []);

  const openitems = useMemo(() => items.filter((item) => !item.completed), [items]);
  const cartItems = useMemo(
    () => items.filter((item) => item.type === 'item' && !item.completed && item.ongoing),
    [items]
  );
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
        pathname: '/projects/item-modal',
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
        pathname: '/projects/item-modal',
        params: {
          listId: listData.listId,
          listName: listData.name,
          listItemId: item.id,
        },
      });
    }
  }

  function toggleOngoing(item: ListItem) {
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
        pathname: '/projects/list-modal',
        params: {
          listId: listData.listId,
          back: `/projects/${listData.listId}`,
        },
      });
    }
  }

  const blocks: ColumnData[] = [
    {
      title: "What's up?",
      actionHandler: toggleOngoing,
      checkboxHandler: checkoutItem,
      longPressHandler: editItem,
      editHandler: editItem,
      deleteHandler: deleteItem,
      resetHandler: restoreItem,
      emptyText: 'List is empty. Add some tasks to do!',
      items: openitems,
      showEmpty: listData?.completed ? false : true,
    },
    {
      title: 'Done',
      actionHandler: duplicateItem,
      checkboxHandler: restoreItem,
      deleteHandler: deleteItem,
      resetHandler: restoreItem,
      items: completedItems,
      emptyText: 'Nothing was done for this project.',
      showEmpty: listData?.completed ? true : false,
    },
  ];

  return (
    <Page hasHeader={false}>
      <View style={[globalStyles.customHeader, globalStyles.customPageHeader]}>
        {router.canGoBack() && <BackLink path="/projects" noTitle={true} />}
        <View style={globalStyles.listProperties}>
          <DateSelector placeholder="No deadline" value={listData?.deadline || undefined} onChange={updateDeadline} />
          {/* <ShareMenu listId={listId} listName={listData?.name} shareId={listData?.shareId} /> */}
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
              {listData?.name + ' ' || 'Project '}
            </ThemedText>
          </Pressable>
        </View>
      </ThemedView>

      <Columns blocks={listData?.completed ? blocks.reverse() : blocks} paddingBottom={64} openBlock={0} />
      {!listData?.completed && (
        <ListButtons
          newItem={newItem}
          checkoutBasket={checkoutBasket}
          newItemTitle={openitems?.length > 0 ? 'I also wanna do...' : 'I wanna do...'}
          cartItems={cartItems?.length || 0}
        />
      )}
    </Page>
  );
}

export default observer(ProjectScreen);
