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

function ShoppingScreen() {
  function newList() {
    router.navigate('/shopping/list-modal');
  }

  function goToList(item: ListItem) {
    router.navigate(`/shopping/${item.id}`);
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
  }, [lists]);

  const blocks: ColumnData[] = [
    {
      title: 'Next Up',
      actionHandler: goToList,
      items: shoppingLists,
      emptyText: 'No Lists here! Create a new one to start shopping!',
      showEmpty: true,
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
      <Columns title="Shopping Lists" blocks={blocks} />
      <View style={{ transform: [{ rotate: '-1deg' }] }}>
        <ListButtons newItem={newList} newItemTitle="New shopping list" />
      </View>
    </Page>
  );
}

export default observer(ShoppingScreen);
