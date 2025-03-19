// hooks and state
import { useMemo } from 'react';
import { useThemeColor } from '@/hooks/useThemeColor';
import { router, useLocalSearchParams } from 'expo-router';
import { observer } from '@legendapp/state/react';
import { lists$ as _lists$ } from '@/state/state';
import { markItemAsCompleted, markItemAsDeleted, updateItemOngoingStatus, updateList } from '@/state/actions-lists';

// utils
import { convertItemsToListItems, groupItemsByCompletedAt } from '@/utils/lists';

// components
import { AccordionBlockProps } from '@/components/AccordionBlock';
import { Accordion } from '@/components/Accordion';
import Page from '@/components/Page';
import SmallButton from '@/components/SmallButton';
import { ListItem } from '@/types/listItem';
import { Pressable, View } from 'react-native';
import DateSelector from '@/components/DateSelector';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import ListMenu from '@/components/ListMenu';
import { BackLink } from '@/components/BackLink';

// icons
import BagFillIcon from '@/assets/symbols/bag-fill.svg';
import SquareIcon from '@/assets/symbols/square.svg';
import SquareCheckIcon from '@/assets/symbols/square-check.svg';
import SquarePlayIcon from '@/assets/symbols/square-play.svg';

import { globalStyles } from '@/constants/GlobalStyles';

function ProjectScreen() {
  const primaryColor = useThemeColor({}, 'primary');
  const touchableColor = useThemeColor({}, 'touchable');

  const params = useLocalSearchParams();
  const listId: string = params?.list ? (Array.isArray(params?.list) ? params.list[0] : params.list) : '';
  const listData = listId ? _lists$[listId]?.get() : null;

  const items = convertItemsToListItems(_lists$[listId]?.listItems.get() || []);

  const openitems = useMemo(() => items.filter((item) => !item.completed), [items]);
  const ongoingItems = useMemo(
    () => items.filter((item) => item.type === 'task' && !item.completed && item.assignee),
    [items]
  );
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

  const blocks: AccordionBlockProps[] = [
    {
      title: "What's next",
      newItemLabel: 'New item',
      newItemHandler: newItem,
      actionHandler: toggleOngoing,
      checkboxHandler: checkoutItem,
      longPressHandler: editItem,
      editHandler: editItem,
      deleteHandler: deleteItem,
      resetHandler: restoreItem,
      emptyText: 'List is empty. Add some tasks to do!',
      items: openitems,
      showEmpty: true,
    },
    {
      title: 'In progress',
      color: primaryColor,
      actionHandler: toggleOngoing,
      checkboxHandler: checkoutItem,
      longPressHandler: editItem,
      editHandler: editItem,
      deleteHandler: deleteItem,
      resetHandler: restoreItem,
      items: ongoingItems,
      emptyText: 'Hurry up to finish the list!',
      showEmpty: false,
    },
    {
      title: 'Cart',
      color: primaryColor,
      action: (
        <SmallButton
          title="Checkout"
          icon={BagFillIcon}
          onPress={checkoutBasket}
          color={primaryColor}
          disabled={cartItems.length === 0}
        />
      ),
      actionHandler: toggleOngoing,
      checkboxHandler: checkoutItem,
      longPressHandler: editItem,
      editHandler: editItem,
      deleteHandler: deleteItem,
      resetHandler: restoreItem,
      items: cartItems,
      emptyText: 'The cart is empty',
      showEmpty: false,
    },
    {
      title: 'Already done',
      actionHandler: restoreItem,
      checkboxHandler: restoreItem,
      deleteHandler: deleteItem,
      resetHandler: restoreItem,
      items: completedItems,
      emptyText: 'Nothing done yet :-((',
      showEmpty: true,
    },
  ];

  return (
    <Page hasHeader={false}>
      <View style={globalStyles.customHeader}>
        {router.canGoBack() && <BackLink path="/projects" />}
        <ListMenu listId={listId} isHeaderMenu={false} />
      </View>
      <ThemedView style={globalStyles.titleContainer}>
        <View style={globalStyles.listTitleContainer}>
          {cartItems.length < 1 && completedItems.length < 1 && !listData?.completed ? (
            <SquareIcon width={18} height={18} color={primaryColor} style={globalStyles.listTitleIcon} />
          ) : listData?.completed ? (
            <SquareCheckIcon width={18} height={18} color={touchableColor} style={globalStyles.listTitleIcon} />
          ) : (
            <SquarePlayIcon width={18} height={18} color={primaryColor} style={globalStyles.listTitleIcon} />
          )}

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
      <View style={globalStyles.listProperties}>
        <DateSelector placeholder="No deadline" value={listData?.deadline || undefined} onChange={updateDeadline} />
        {/* <ShareMenu listId={listId} listName={listData?.name} shareId={listData?.shareId} /> */}
      </View>
      <Accordion blocks={blocks} openBlock={0} />
    </Page>
  );
}

export default observer(ProjectScreen);
