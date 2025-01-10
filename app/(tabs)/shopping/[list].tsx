// hooks
import { useThemeColor } from '@/hooks/useThemeColor';

import { router } from 'expo-router';

// components
import { AccordionBlockProps } from '@/components/AccordionBlock';
import { Accordion } from '@/components/Accordion';
import Page from '@/components/Page';
import SmallButton from '@/components/SmallButton';
import { ListItem } from '@/types/listItem';
import { View } from 'react-native';

// icons
import BagFillIcon from '@/assets/symbols/bag-fill.svg';
import PersonPlusIcon from '@/assets/symbols/person-plus.svg';
import { DropdownMenu } from '@/components/DropdownMenu';
import { copyListLinkToClipboard, shareList } from '@/utils/share';

export default function ShoppingListScreen() {
  const primaryColor = useThemeColor({}, 'primary');

  function newList() {
    router.navigate('/shopping/new-list');
  }

  function goToList(item: ListItem) {
    router.navigate(`/shopping/${item.id}`);
  }

  function checkoutList(item: ListItem) {
    console.log('checkoutList', item);
  }

  const blocks: AccordionBlockProps[] = [
    {
      title: 'Still have to buy',
      newItemLabel: 'New item',
      newItemHandler: newList,
      actionHandler: goToList,
      checkboxHandler: checkoutList,
      emptyText: 'List is empty. Add some items!',
      items: [
        {
          type: 'item',
          id: '1',
          label: 'Milk 3.5%',
          quantity: 6,
          inProgress: false,
        },
        {
          type: 'item',
          id: '2',
          label: 'Toast bread',
          quantity: 1,
          inProgress: false,
        },
        {
          type: 'item',
          id: '3',
          label: 'Mozarella',
          quantity: 2,
          inProgress: true,
        },
        {
          type: 'item',
          id: '4',
          label: 'Coca Cola Zero',
          quantity: 1,
          inProgress: true,
        },
        {
          type: 'item',
          id: '5',
          label: 'Baguette',
          quantity: 2,
          inProgress: false,
        },
        {
          type: 'item',
          id: '6',
          label: 'Milk 3.5%',
          quantity: 6,
          inProgress: false,
        },
        {
          type: 'item',
          id: '7',
          label: 'Toast bread',
          quantity: 1,
          inProgress: false,
        },
        {
          type: 'item',
          id: '8',
          label: 'Mozarella',
          quantity: 2,
          inProgress: true,
        },
        {
          type: 'item',
          id: '9',
          label: 'Coca Cola Zero',
          quantity: 1,
          inProgress: true,
        },
        {
          type: 'item',
          id: '10',
          label: 'Baguette',
          quantity: 2,
          inProgress: false,
        },
        {
          type: 'item',
          id: '11',
          label: 'Milk 3.5%',
          quantity: 6,
          inProgress: false,
        },
        {
          type: 'item',
          id: '12',
          label: 'Toast bread',
          quantity: 1,
          inProgress: false,
        },
        {
          type: 'item',
          id: '13',
          label: 'Mozarella',
          quantity: 2,
          inProgress: true,
        },
        {
          type: 'item',
          id: '14',
          label: 'Coca Cola Zero',
          quantity: 1,
          inProgress: true,
        },
        {
          type: 'item',
          id: '15',
          label: 'Baguette',
          quantity: 2,
          inProgress: false,
        },
      ],
    },
    {
      title: 'Cart',
      color: primaryColor,
      action: <SmallButton title="Checkout" icon={BagFillIcon} onPress={() => {}} color={primaryColor} />,
      newItemLabel: 'Not planned item in the cart',
      items: [
        {
          type: 'item',
          id: '3',
          label: 'Mozarella',
          quantity: 2,
          inProgress: true,
        },
        {
          type: 'item',
          id: '4',
          label: 'Coca Cola Zero',
          quantity: 1,
          inProgress: true,
        },
      ],
      emptyText: 'Cart is still empty',
    },
    {
      title: 'Past purchases',
      items: [],
      emptyText: 'No purchases yet',
    },
  ];

  return (
    <Page hasHeader={true}>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: 16 }}>
        <DropdownMenu
          items={[
            {
              label: 'Share link',
              onPress: () => {
                console.log('Share link');
                shareList('123');
              },
            },
            {
              label: 'Copy link',
              onPress: () => {
                console.log('Copy link');
                copyListLinkToClipboard('123');
              },
            },
          ]}
        >
          <SmallButton icon={PersonPlusIcon} title="Not shared" />
        </DropdownMenu>
      </View>
      <Accordion title="Home groceries" blocks={blocks} openBlock={0} />
    </Page>
  );
}
