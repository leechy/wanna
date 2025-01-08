import { useThemeColor } from '@/hooks/useThemeColor';
import { AccordionBlockProps } from '@/components/AccordionBlock';
import { Accordion } from '@/components/Accordion';
import Page from '@/components/Page';
import { router } from 'expo-router';
import SmallButton from '@/components/SmallButton';
import BagFillIcon from '@/assets/symbols/bag-fill.svg';
import { ListItem } from '@/types/listItem';

export default function ShoppingScreen() {
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
      title: 'Active lists',
      newItemLabel: 'New list',
      newItemHandler: newList,
      actionHandler: goToList,
      checkboxHandler: checkoutList,
      items: [
        {
          type: 'shopping-list',
          id: '1',
          label: 'Home groceries',
          quantity: 14,
          inProgress: 3,
        },
        {
          type: 'shopping-list',
          id: '2',
          label: 'Materials for the bathroom renovation',
          deadline: 1740441600000,
          shared: ['John', 'Letitia'],
          quantity: 8,
          inProgress: false,
        },
      ],
      emptyText: 'No Lists here! Create a new one to start shopping!',
    },
    {
      title: 'Cart',
      color: primaryColor,
      action: <SmallButton title="Checkout" icon={BagFillIcon} onPress={() => {}} color={primaryColor} />,
      newItemLabel: 'Not planned item in the cart',
      items: [
        {
          type: 'shopping-list',
          id: '3',
          label: 'Mozarella',
          quantity: 2,
          inProgress: true,
        },
        {
          type: 'shopping-list',
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
    <Page>
      <Accordion title="Shopping Lists" blocks={blocks} openBlock={0} />
    </Page>
  );
}
