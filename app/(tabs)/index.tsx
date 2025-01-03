// hooks and state
import { useSelector } from '@legendapp/state/react';
import { profiles$ } from '@/state/user';

// components
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { Accordion } from '@/components/Accordion';
import { useThemeColor } from '@/hooks/useThemeColor';
import { AccordionBlockProps } from '@/components/AccordionBlock';
import Page from '@/components/Page';

export default function HomeScreen() {
  const profiles = useSelector(profiles$);
  const displayProfiles = () => {
    console.log('profiles', profiles);
  };

  const dangerColor = useThemeColor({}, 'danger');

  const blocks: AccordionBlockProps[] = [
    {
      title: 'Past deadline',
      color: dangerColor,
      items: [
        {
          type: 'item',
          id: '1',
          label: 'Milk 3.5%',
          deadline: new Date('2024-12-24 12:00').getTime(),
          quantity: 6,
          inProgress: false,
        },
        {
          type: 'item',
          id: '2',
          label: 'Toast bread',
          deadline: new Date('2024-12-12 12:00').getTime(),
          quantity: 1,
          inProgress: false,
        },
        {
          type: 'item',
          id: '3',
          label: 'Mozarella',
          deadline: new Date('2024-11-21 12:00').getTime(),
          quantity: 2,
          inProgress: true,
        },
      ],
      emptyText: 'Great, no overdue tasks!',
    },
    {
      title: 'Open items',
      newItemLabel: 'New wish or task',
      items: [
        {
          type: 'task',
          id: '1',
          label: 'Mark this item as ongoing and then as completed',
          list: 'Tutorial',
          quantity: 1,
          inProgress: false,
        },
        {
          type: 'item',
          id: '3',
          label: 'Mozarella',
          deadline: Date.now() + 1000 * 60 * 60 * 24 * 2,
          quantity: 2,
          inProgress: true,
        },
        {
          type: 'item',
          id: '4',
          label: 'Coca Cola Zero',
          deadline: new Date('2024-12-24 12:00').getTime(),
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
      emptyText: 'Hm, nothing to do here, add some wishes!',
    },
    {
      title: 'Recently completed',
      items: [],
      emptyText: 'No completed tasks, no worries!',
    },
  ];

  return (
    <Page>
      <Accordion title="Current wishes" blocks={blocks} openBlock={0} />
    </Page>
  );
}
