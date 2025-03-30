// hooks and state
import { useMemo } from 'react';
import { observer } from '@legendapp/state/react';
import { lists$ as _lists$ } from '@/state/state';
import { updateList } from '@/state/actions-lists';
import { router } from 'expo-router';

// components
import { View } from 'react-native';
import { Columns } from '@/components/Columns';
import Page from '@/components/Page';
import ListButtons from '@/components/ListButtons';

// types
import { ListItem } from '@/types/listItem';
import { ColumnData } from '@/types/ColumnData';

function ProjectsScreen() {
  function newList() {
    router.navigate('/projects/list-modal');
  }

  function goToList(item: ListItem) {
    router.navigate(`/projects/${item.id}`);
  }

  function restoreList(item: ListItem) {
    if (item.id) {
      updateList(item.id, {
        completed: false,
        completedAt: undefined,
        updatedAt: new Date().toISOString(),
      });
    }
  }

  const lists = _lists$.get();

  const [projects, completedLists] = useMemo(() => {
    if (lists) {
      const newCompletedLists: ListItem[] = [];
      const newProjects: ListItem[] = [];
      Object.keys(lists)
        .filter((listId) => lists[listId].type === 'project' && !lists[listId].deleted)
        .map((listId) => {
          const list = lists[listId];
          const listItem: ListItem = {
            id: listId,
            type: list.type as ListItem['type'],
            label: list.name,
            deadline: list.deadline,
            shared: list.users?.map((user) => user.names),
            completed: list.completed,
            updatedAt: list.updatedAt,
            sortOrder: list.sortOrder,
            // count of items in the list that are in the cart or complated
            ongoing: (list.listItems || []).reduce(
              (acc, item) => acc + (!item.deleted && (item.completed || item.ongoing) ? 1 : 0),
              0
            ),
            // count of items in the list that are not completed
            quantity: list.listItems?.filter((item) => !item.deleted).length || 0,
          };
          if (list.completed) {
            newCompletedLists.push(listItem);
          } else {
            newProjects.push(listItem);
          }
        });
      newCompletedLists.sort((a, b) => ((a.updatedAt || 0) > (b.updatedAt || 0) ? -1 : 1));
      newProjects.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
      return [newProjects, newCompletedLists];
    }

    return [[], []];
  }, [lists]);

  const blocks: ColumnData[] = [
    {
      title: 'Present Continuous',
      actionHandler: goToList,
      items: projects,
      emptyText: 'No Projects yet! Create a new one to start.',
      showEmpty: true,
    },
    {
      title: 'Past Perfect',
      actionHandler: goToList,
      checkboxHandler: restoreList,
      items: completedLists,
      emptyText: 'Finished projects will move here!',
      showEmpty: true,
    },
  ];

  return (
    <Page>
      <Columns title="Projects" blocks={blocks} paddingBottom={64} />
      <View style={{ transform: [{ rotate: '-1deg' }] }}>
        <ListButtons newItem={newList} newItemTitle="New project" />
      </View>
    </Page>
  );
}

export default observer(ProjectsScreen);
