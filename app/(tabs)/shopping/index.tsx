import { useThemeColor } from '@/hooks/useThemeColor';
import { AccordionBlockProps } from '@/components/AccordionBlock';
import { Accordion } from '@/components/Accordion';
import Page from '@/components/Page';
import { router } from 'expo-router';
import SmallButton from '@/components/SmallButton';
import BagFillIcon from '@/assets/symbols/bag-fill.svg';

export default function ShoppingScreen() {
  const primaryColor = useThemeColor({}, 'primary');

  function newList() {
    router.navigate('/shopping/new-list');
  }

  const blocks: AccordionBlockProps[] = [
    {
      title: 'Active lists',
      newItemLabel: 'New list',
      newItemHandler: newList,
      items: [
        {
          type: 'list',
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
      emptyText: 'List is empty. Add some items!',
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
    <Page>
      <Accordion title="Shopping Lists" blocks={blocks} openBlock={0} />
    </Page>
  );
}
