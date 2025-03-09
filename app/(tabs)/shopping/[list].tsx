// hooks and state
import { useThemeColor } from '@/hooks/useThemeColor';
import { router, useLocalSearchParams } from 'expo-router';
import { observer } from '@legendapp/state/react';
import { lists$ as _lists$ } from '@/state/state';

// utils
import { copyListLinkToClipboard, shareList } from '@/utils/share';

// components
import { AccordionBlockProps } from '@/components/AccordionBlock';
import { Accordion } from '@/components/Accordion';
import Page from '@/components/Page';
import SmallButton from '@/components/SmallButton';
import { convertItemsToListItems, ListItem } from '@/types/listItem';
import { View } from 'react-native';
import { DropdownMenu } from '@/components/DropdownMenu';

// icons
import BagFillIcon from '@/assets/symbols/bag-fill.svg';
import PersonPlusIcon from '@/assets/symbols/persona-plus.svg';
import ShareIcon from '@/assets/symbols/share.svg';
import CopyLinkIcon from '@/assets/symbols/copy-link.svg';
import ChevronRightIcon from '@/assets/symbols/chevron-right.svg';
import DateSelector from '@/components/DateSelector';
import { updateList } from '@/state/actions-lists';
import { List } from '@/types/list';

function ShoppingListScreen() {
  const primaryColor = useThemeColor({}, 'primary');
  const touchableColor = useThemeColor({}, 'touchable');

  const params = useLocalSearchParams();
  const listId: string = params?.list ? (Array.isArray(params?.list) ? params.list[0] : params.list) : '';
  const listData = listId ? (_lists$[listId]?.get() as List) : null;
  const listItems = listId ? _lists$[listId]?.listItems?.get() : null;

  function updateDeadline(date: string | number | undefined) {
    if (listId) {
      updateList(listId, {
        deadline: date ? new Date(date).toISOString() : undefined,
        updatedAt: new Date().toISOString(),
      });
    }
  }

  function newItem() {
    if (listData) {
      router.navigate({
        pathname: '/shopping/new-item',
        params: {
          listId: listData.listId,
          listName: listData.name,
        },
      });
    }
  }

  function putInCart(item: ListItem) {
    console.log('putInCart', item);
  }

  function checkoutList(item: ListItem) {
    console.log('checkoutList', item);
  }

  function editList() {
    if (listData) {
      router.navigate({
        pathname: '/shopping/new-list',
        params: {
          listId: listData.listId,
          back: `/shopping/${listData.listId}`,
        },
      });
    }
  }

  const openitems = convertItemsToListItems(listItems).filter((item) => !item.completed && !item.ongoing);
  const cartItems = convertItemsToListItems(listItems).filter((item) => !item.completed && item.ongoing);
  const completedItems = convertItemsToListItems(listItems).filter((item) => item.completed);

  const blocks: AccordionBlockProps[] = [
    {
      title: 'Still have to buy',
      newItemLabel: 'New item',
      newItemHandler: newItem,
      actionHandler: putInCart,
      checkboxHandler: checkoutList,
      emptyText: 'List is empty. Add some items!',
      items: openitems,
    },
    {
      title: 'Cart',
      color: primaryColor,
      action: <SmallButton title="Checkout" icon={BagFillIcon} onPress={() => {}} color={primaryColor} />,
      newItemLabel: 'Not planned item in the cart',
      items: cartItems,
      emptyText: 'Cart is still empty',
    },
    {
      title: 'Past purchases',
      items: completedItems,
      emptyText: 'No purchases yet',
    },
  ];

  return (
    <Page hasHeader={true}>
      <View
        style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: 16, paddingBottom: 8, gap: 12 }}
      >
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
      <Accordion
        title={listData?.name + ' ' || 'Shopping list '}
        titleLongPressAction={editList}
        blocks={blocks}
        openBlock={0}
      />
    </Page>
  );
}

export default observer(ShoppingListScreen);
