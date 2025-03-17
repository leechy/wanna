// hooks and state
import { useState } from 'react';
import { useThemeColor } from '@/hooks/useThemeColor';
import { router } from 'expo-router';

// components
import { Accordion } from '@/components/Accordion';
import { AccordionBlockProps } from '@/components/AccordionBlock';
import Page from '@/components/Page';
import SmallButton from '@/components/SmallButton';
import { DropdownMenu } from '@/components/DropdownMenu';

import SortIcon from '@/assets/symbols/sort.svg';
import SettingsIcon from '@/assets/symbols/settings.svg';

export default function HomeScreen() {
  const dangerColor = useThemeColor({}, 'danger');

  const [openDropdown, setOpenDropdown] = useState(false);

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
          ongoing: false,
        },
        {
          type: 'item',
          id: '2',
          label: 'Toast bread',
          deadline: new Date('2024-12-12 12:00').getTime(),
          quantity: 1,
          ongoing: false,
        },
        {
          type: 'item',
          id: '3',
          label: 'Mozarella',
          deadline: new Date('2024-11-21 12:00').getTime(),
          quantity: 2,
          ongoing: true,
        },
      ],
      emptyText: 'Great, no overdue tasks!',
      showEmpty: true,
    },
    {
      title: 'Open items',
      newItemLabel: 'New wish or task',
      action: (
        <DropdownMenu
          open={openDropdown}
          onOpen={() => setOpenDropdown(true)}
          onClose={() => setOpenDropdown(false)}
          items={[
            { label: 'by time added', selected: true, onPress: () => {} },
            { label: 'by name', onPress: () => {} },
            { label: 'by deadline', onPress: () => {} },
            { label: 'by quantity', onPress: () => {} },
          ]}
        >
          <SmallButton title="Latest on top" icon={SortIcon} />
        </DropdownMenu>
      ),
      items: [
        {
          type: 'task',
          id: '1',
          label: 'Mark this item as ongoing and then as completed',
          list: 'Tutorial',
          quantity: 1,
          ongoing: false,
        },
        {
          type: 'item',
          id: '3',
          label: 'Mozarella',
          deadline: Date.now() + 1000 * 60 * 60 * 24 * 2,
          quantity: 2,
          ongoing: true,
        },
        {
          type: 'task',
          id: '4',
          label: 'Attach the neck to the body',
          deadline: new Date('2024-12-24 12:00').getTime(),
          quantity: 1,
          ongoing: true,
          list: 'Neon Guitar',
        },
        {
          type: 'item',
          id: '5',
          label: 'Baguette',
          quantity: 2,
          ongoing: false,
        },
        {
          type: 'item',
          id: '6',
          label: 'Milk 3.5%',
          quantity: 6,
          ongoing: false,
        },
        {
          type: 'item',
          id: '7',
          label: 'Toast bread',
          quantity: 1,
          ongoing: false,
        },
        {
          type: 'item',
          id: '8',
          label: 'Mozarella',
          quantity: 2,
          ongoing: true,
        },
        {
          type: 'task',
          id: '9',
          label: 'Coca Cola Zero',
          quantity: 1,
          ongoing: true,
        },
        {
          type: 'task',
          id: '10',
          label: 'Baguette',
          quantity: 2,
          ongoing: false,
        },
        {
          type: 'item',
          id: '11',
          label: 'Milk 3.5%',
          quantity: 6,
          ongoing: false,
        },
        {
          type: 'item',
          id: '12',
          label: 'Toast bread',
          quantity: 1,
          ongoing: false,
        },
        {
          type: 'item',
          id: '13',
          label: 'Mozarella',
          quantity: 2,
          ongoing: true,
        },
        {
          type: 'item',
          id: '14',
          label: 'Coca Cola Zero',
          quantity: 1,
          ongoing: true,
        },
        {
          type: 'item',
          id: '15',
          label: 'Baguette',
          quantity: 2,
          ongoing: false,
        },
      ],
      emptyText: 'Hm, nothing to do here, add some wishes!',
      showEmpty: true,
    },
    {
      title: 'Recently completed',
      items: [],
      emptyText: 'No completed tasks, no worries!',
      showEmpty: false,
    },
  ];

  function gotoSettings() {
    router.push('/settings');
  }

  return (
    <Page>
      <Accordion
        title="Current wishes"
        titleIcon={SettingsIcon}
        titleAction={gotoSettings}
        blocks={blocks}
        openBlock={0}
      />
    </Page>
  );
}
