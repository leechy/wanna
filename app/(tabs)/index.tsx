// hooks and state
import { useState } from 'react';
import { useThemeColor } from '@/hooks/useThemeColor';
import { router } from 'expo-router';
import { lists$ as _lists$ } from '@/state/state';

// components
import { Accordion } from '@/components/Accordion';
import { AccordionBlockProps } from '@/components/AccordionBlock';
import Page from '@/components/Page';
import SmallButton from '@/components/SmallButton';
import { DropdownMenu } from '@/components/DropdownMenu';

import SortIcon from '@/assets/symbols/sort.svg';
import SettingsIcon from '@/assets/symbols/settings.svg';
import { ListItem } from '@/types/listItem';
import { convertItemToListItem } from '@/utils/lists';
import { markItemAsCompleted, updateItemOngoingStatus } from '@/state/actions-lists';
import { observer } from '@legendapp/state/react';

const sortTypes: { [value: string]: { title: string; label: string } } = {
  latest: {
    title: 'Latest on top',
    label: 'by time added',
  },
  name: {
    title: 'A-Z',
    label: 'by name',
  },
  deadline: {
    title: 'Sooner the due',
    label: 'by deadline',
  },
};

function HomeScreen() {
  const dangerColor = useThemeColor({}, 'danger');

  const [sortType, setSortType] = useState('latest');

  function goToList(item: ListItem) {
    router.navigate(`/${item.type === 'item' ? 'shopping' : 'projects'}/${item.listId}`);
  }

  function toggleOngoing(item: ListItem) {
    console.log('toggle ongoing', item);
    updateItemOngoingStatus(item.listId!, item.id, item.ongoing ? false : true);
  }

  function checkoutItem(item: ListItem) {
    markItemAsCompleted(item.listId!, item.id);
  }

  function restoreItem(item: ListItem) {
    markItemAsCompleted(item.listId!, item.id, false);
  }

  const lists = _lists$.get();

  // get all items from all lists that are not completed
  const pastDeadline: ListItem[] = [];
  const openItems: ListItem[] = [];
  const recentlyCompleted: ListItem[] = [];

  const recentDate = new Date().getTime() - 1000 * 60 * 60 * 24 * 7;
  const now = new Date().toISOString();

  if (lists) {
    Object.keys(lists).forEach((listId) => {
      const list = lists[listId];
      if (list.deleted) {
        return;
      }

      const listItems = _lists$[listId]?.listItems.get() || [];

      listItems?.forEach((item) => {
        if (item.deleted) {
          return;
        }
        if (item.completed) {
          if (item.completedAt && new Date(item.completedAt).getTime() > recentDate) {
            recentlyCompleted.push(convertItemToListItem(item, { list: list.name, listId, listType: list.type }));
          }
        } else {
          if (item.deadline && item.deadline < now) {
            pastDeadline.push(convertItemToListItem(item, { list: list.name, listId, listType: list.type }));
          }
          openItems.push(convertItemToListItem(item, { list: list.name, listId, listType: list.type }));
        }
      });
    });
  }

  const blocks: AccordionBlockProps[] = [
    {
      title: 'Past deadline',
      color: dangerColor,
      items: pastDeadline,
      emptyText: 'Great, no overdue tasks!',
      showEmpty: false,
      actionHandler: toggleOngoing,
      checkboxHandler: checkoutItem,
      longPressHandler: goToList,
    },
    {
      title: 'Open items',
      newItemLabel: 'New wish or task',
      action: (
        <DropdownMenu
          items={Object.keys(sortTypes).map((sortId) => ({
            label: sortTypes[sortId].label,
            selected: sortId === sortType,
            onPress: () => setSortType(sortId),
          }))}
        >
          <SmallButton title={sortTypes[sortType].title} icon={SortIcon} />
        </DropdownMenu>
      ),
      items: openItems,
      emptyText: 'Hm, nothing to do here, add some wishes!',
      showEmpty: true,
      actionHandler: toggleOngoing,
      checkboxHandler: checkoutItem,
      longPressHandler: goToList,
    },
    {
      title: 'Recently completed',
      items: recentlyCompleted,
      emptyText: 'No completed tasks, no worries!',
      showEmpty: false,
      actionHandler: restoreItem,
      longPressHandler: goToList,
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

export default observer(HomeScreen);
