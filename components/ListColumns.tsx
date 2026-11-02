// hooks
import { useRef, useState } from 'react';

// components
import { ScrollView, StyleSheet, View } from 'react-native';

// types
import { List } from '@/types/list';
import PagerView from 'react-native-pager-view';
import { wrapScrollView } from 'react-native-scroll-into-view';
import { ListColumnTab } from './ListColumnTab';

interface ListColumnsProps {
  lists: List[];
  selectedList?: string;
}

const TabsScrollView = wrapScrollView(ScrollView);

export function ListColumns({ lists, selectedList }: ListColumnsProps) {
  const [activeList, setActiveList] = useState<string>(selectedList || lists[0].listId);
  const pagerRef = useRef<PagerView>(null);

  function selectList(listId: string) {
    setActiveList(listId);
    const index = lists.findIndex((list) => list.listId === listId);
    if (index !== -1) {
      pagerRef.current?.setPage(index);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.tabsContainer}>
        <TabsScrollView
          contentContainerStyle={styles.tabs}
          alwaysBounceHorizontal={false}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        >
          {lists.map((list) => (
            <ListColumnTab
              list={list}
              isActive={activeList === list.listId}
              selectList={selectList}
              key={`list-${list.listId}`}
            />
          ))}
        </TabsScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabsContainer: { flex: 0 },
  tabs: {
    padding: 0,
    paddingBottom: 16,
    margin: 0,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    minWidth: '100%',
  },
});
