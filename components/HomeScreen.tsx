// hooks and state
import { useMemo } from 'react';
import { observer } from '@legendapp/state/react';
import { invitations$ as _invitations$, lists$ as _lists$, openListId$ } from '@/state/state';
import { updateList } from '@/state/actions-lists';
import { router } from 'expo-router';
import { openList } from '@/utils/navigation';

// components
import { View } from 'react-native';
import { Columns } from '@/components/Columns';
import Page from '@/components/Page';

// icons
import SettingsIcon from '@/assets/symbols/settings.svg';
import ListButtons from '@/components/ListButtons';

// types
import { ListItem } from '@/types/listItem';
import { ColumnData } from '@/types/ColumnData';

interface HomeScreenProps {
  // on a wide screen: the navigation next to the open list
  asNavigation?: boolean;
}

/**
 * The lists of the user: the only screen of the app on a narrow screen,
 * the navigation on the left on a wide one
 */
function HomeScreenComponent({ asNavigation = false }: HomeScreenProps) {
  const openListId = asNavigation ? openListId$.get() : null;

  function newList() {
    router.navigate('/shopping/list-modal');
  }

  function goToList(item: ListItem) {
    if (item.id !== openListId) {
      openList(item.id);
    }
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

  // const recipes = useMemo(() => {
  //   if (lists) {
  //     return Object.keys(lists)
  //       .filter((listId) => lists[listId].type === 'recipe')
  //       .map((listId) => {
  //         const list = lists[listId];
  //         return {
  //           id: listId,
  //           type: list.type as ListItem['type'],
  //           label: list.name,
  //           deadline: list.deadline,
  //         };
  //       });
  //   }
  //   return [];
  // }, [lists]);

  const [shoppingLists, completedLists] = useMemo(() => {
    if (lists) {
      const newCompletedLists: ListItem[] = [];
      const newShoppingLists: ListItem[] = [];
      Object.keys(lists)
        .filter((listId) => lists[listId].type === 'shopping-list' && !lists[listId].deleted)
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
            selected: listId === openListId,
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
            newShoppingLists.push(listItem);
          }
        });
      newCompletedLists.sort((a, b) => ((a.updatedAt || 0) > (b.updatedAt || 0) ? -1 : 1));
      newShoppingLists.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
      return [newShoppingLists, newCompletedLists];
    }

    return [[], []];
  }, [lists, openListId]);

  // the lists someone invited the user to, to look at and join
  const invitations: ListItem[] = Object.values(_invitations$.get() ?? {}).map(({ listId, list }) => ({
    id: listId,
    type: 'shopping-list',
    label: list.name,
    shared: list.users?.map((user) => user.names),
    ongoing: 0,
    quantity: list.listItems?.filter((item) => !item.deleted).length || 0,
  }));

  function goToInvitation(item: ListItem) {
    router.navigate({ pathname: '/invitation/[listId]', params: { listId: item.id } });
  }

  const blocks: ColumnData[] = [
    {
      title: 'Next Up',
      actionHandler: goToList,
      items: shoppingLists,
      emptyText: 'No Lists here! Create a new one to start shopping!',
      showEmpty: true,
    },
    {
      title: 'Invitations',
      actionHandler: goToInvitation,
      items: invitations,
      showEmpty: false,
    },
    // TODO: Recipes
    // {
    //   title: 'Recipes',
    //   // color: primaryColor,
    //   // action: <SmallButton title="Join Another List" icon={BagFillIcon} onPress={() => {}} color={primaryColor} />,
    //   newItemLabel: 'Create from shopping list',
    //   newItemHandler: () => {
    //     console.log('Create recipe from shopping list');
    //   },
    //   actionHandler: goToList,
    //   items: recipes,
    //   emptyText: "No saved lists yet.\nYou can create one from any list's action menu!",
    //   showEmpty: true,
    // },
    {
      title: 'Completed',
      actionHandler: goToList,
      checkboxHandler: restoreList,
      items: completedLists,
      emptyText: 'Lists with all items checked off will move here!',
      showEmpty: true,
    },
  ];

  return (
    <Page>
      <Columns
        title="Wanna Wanna"
        blocks={blocks}
        titleIcon={SettingsIcon}
        titleAction={() => router.push('/settings')}
      />
      <View style={{ transform: [{ rotate: '-1deg' }] }}>
        <ListButtons newItem={newList} newItemTitle="New shopping list" joinList={() => router.navigate('/join')} />
      </View>
    </Page>
  );
}

export const HomeScreen = observer(HomeScreenComponent);
