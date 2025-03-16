// hooks and state
import { useMemo } from 'react';
import { useThemeColor } from '@/hooks/useThemeColor';
import { router, useLocalSearchParams } from 'expo-router';
import { observer } from '@legendapp/state/react';
import { lists$ as _lists$ } from '@/state/state';
import { markItemAsCompleted, markItemAsDeleted, putItemInCart, updateList } from '@/state/actions-lists';

// utils
import { copyListLinkToClipboard, shareList } from '@/utils/share';
import { convertItemsToListItems, groupItemsByCompletedAt } from '@/utils/lists';

// components
import { AccordionBlockProps } from '@/components/AccordionBlock';
import { Accordion } from '@/components/Accordion';
import Page from '@/components/Page';
import SmallButton from '@/components/SmallButton';
import { ListItem } from '@/types/listItem';
import { Pressable, View } from 'react-native';
import { DropdownMenu } from '@/components/DropdownMenu';
import DateSelector from '@/components/DateSelector';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import ListMenu from '@/components/ListMenu';
import { BackLink } from '@/components/BackLink';

// icons
import BagFillIcon from '@/assets/symbols/bag-fill.svg';
import PersonPlusIcon from '@/assets/symbols/persona-plus.svg';
import ShareIcon from '@/assets/symbols/share.svg';
import CopyLinkIcon from '@/assets/symbols/copy-link.svg';
import ChevronRightIcon from '@/assets/symbols/chevron-right.svg';
import CartNotEmptyIcon from '@/assets/symbols/cart-not-empty.svg';
import CartIcon from '@/assets/symbols/cart.svg';
import SquareCheckIcon from '@/assets/symbols/square-check.svg';

import { globalStyles } from '@/constants/GlobalStyles';

function ShoppingListScreen() {
  const primaryColor = useThemeColor({}, 'primary');
  const touchableColor = useThemeColor({}, 'touchable');

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
    putItemInCart(listId, item.id, item.ongoing ? false : true);
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
        pathname: '/shopping/list-modal',
        params: {
          listId: listData.listId,
          back: `/shopping/${listData.listId}`,
        },
      });
    }
  }

  const blocks: AccordionBlockProps[] = [
    {
      title: 'Still have to buy',
      newItemLabel: 'New item',
      newItemHandler: newItem,
      actionHandler: toggleCart,
      checkboxHandler: checkoutItem,
      longPressHandler: editItem,
      editHandler: editItem,
      deleteHandler: deleteItem,
      emptyText: 'List is empty. Add some items!',
      items: openitems,
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
      newItemLabel: 'Not planned item in the cart',
      newItemHandler: newItem,
      actionHandler: toggleCart,
      checkboxHandler: checkoutItem,
      longPressHandler: editItem,
      editHandler: editItem,
      deleteHandler: deleteItem,
      items: cartItems,
      emptyText: 'The cart is empty',
    },
    {
      title: 'Past purchases',
      actionHandler: restoreItem,
      checkboxHandler: restoreItem,
      deleteHandler: deleteItem,
      items: completedItems,
      emptyText: 'No purchases yet',
    },
  ];

  return (
    <Page hasHeader={false}>
      <View style={globalStyles.customHeader}>
        {router.canGoBack() && <BackLink />}
        <ListMenu listId={listId} isHeaderMenu={false} />
      </View>
      <ThemedView style={globalStyles.titleContainer}>
        <View style={globalStyles.listTitleContainer}>
          {cartItems.length < 1 && completedItems.length < 1 && !listData?.completed ? (
            <CartIcon width={18} height={18} color={primaryColor} style={globalStyles.listTitleIcon} />
          ) : listData?.completed ? (
            <SquareCheckIcon width={18} height={18} color={touchableColor} style={globalStyles.listTitleIcon} />
          ) : (
            <CartNotEmptyIcon width={18} height={18} color={primaryColor} style={globalStyles.listTitleIcon} />
          )}

          <Pressable
            onLongPress={editList}
            style={{ flex: 1 }}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Settings"
            accessibilityHint="Press and hold to open settings"
            hitSlop={8}
          >
            <ThemedText type={listData?.completed ? 'completed-title' : 'title'}>
              {listData?.name + ' ' || 'Shopping list '}
            </ThemedText>
          </Pressable>
        </View>
      </ThemedView>
      <View style={globalStyles.listProperties}>
        <DateSelector placeholder="No deadline" value={listData?.deadline || undefined} onChange={updateDeadline} />
        <DropdownMenu
          items={[
            {
              label: 'Share link',
              onPress: () => {
                if (listData?.shareId) {
                  setTimeout(() => {
                    shareList(listData.shareId);
                  }, 600);
                }
              },
              disabled: !listData?.shareId,
              icon: ShareIcon,
            },
            {
              label: 'Copy link',
              onPress: () => {
                if (listData?.shareId) {
                  copyListLinkToClipboard(listData.shareId);
                }
              },
              disabled: !listData?.shareId,
              icon: CopyLinkIcon,
            },
            {
              label: 'Share with',
            },
            {
              label: 'Soulntse',
              onPress: () => {
                console.log('Share list with Soulntse');
              },
              icon: PersonPlusIcon,
            },
            {
              label: 'Vicky',
              onPress: () => {
                console.log('Share list with Vicky');
              },
              icon: PersonPlusIcon,
            },
            {
              label: 'Djawaharlal Nehru the second',
              onPress: () => {
                console.log('Share list with Djawaharlal');
              },
              icon: PersonPlusIcon,
            },
            {
              label: 'Choose contact',
              onPress: () => {
                // @ts-ignore
                router.push({
                  pathname: '/shopping/choose-contact',
                  params: {
                    listId: listData?.listId,
                    listName: 'Home groceries',
                  },
                });
              },
              disabled: !listData?.listId,
              icon: ChevronRightIcon,
              color: touchableColor,
            },
          ]}
        >
          <SmallButton icon={PersonPlusIcon} title="Not shared" />
        </DropdownMenu>
      </View>
      <Accordion blocks={blocks} openBlock={0} />
    </Page>
  );
}

export default observer(ShoppingListScreen);
