import { useEffect, useRef } from 'react';
import { useScrollIntoView, ScrollIntoView } from 'react-native-scroll-into-view';
import { useThemeColor } from '@/hooks/useThemeColor';

import { PressableArea } from '@/components/PressableArea';
import { StyleSheet, Text, View } from 'react-native';
import PersonPlusIcon from '@/assets/symbols/persona-plus.svg';
import PersonaIcon from '@/assets/symbols/persona.svg';
import TwoPersonasIcon from '@/assets/symbols/two-personas.svg';
import ThreePersonasIcon from '@/assets/symbols/three-personas.svg';

import { List } from '@/types/list';

interface ListColumnTabProps {
  list: List;
  isActive: boolean;
  selectList: (listId: string) => void;
}

// separate component to get the context from TabsScrollView
export function ListColumnTab({ list, isActive, selectList }: ListColumnTabProps) {
  const touchableColor = useThemeColor({}, 'touchable');
  const scrollIntoView = useScrollIntoView();
  const scrollRef = useRef(null);
  const activeRef = useRef(isActive);

  useEffect(() => {
    if (isActive && !activeRef.current && scrollRef.current) {
      activeRef.current = true;
      scrollIntoView(scrollRef.current, { animated: true });
    } else if (!isActive && activeRef.current) {
      activeRef.current = false;
    }
  }, [isActive, scrollIntoView]);

  function onPress() {
    if (!activeRef.current) {
      activeRef.current = true;
      selectList(list.listId);
    }
  }

  return (
    <ScrollIntoView
      key={list.listId}
      ref={scrollRef}
      // @ts-ignore align is a valid prop for ScrollIntoView
      align="stert"
      style={[styles.tab, { opacity: isActive ? 0.66 : 1 }]}
    >
      <View style={styles.buttonContainer}>
        {isActive ? (
          <View style={styles.button}>
            <View style={styles.titleRow}>
              <Text style={[styles.title, { color: touchableColor }]} numberOfLines={1} ellipsizeMode="middle">
                {list.name}
              </Text>
              <Text style={[styles.number, { color: touchableColor }]}>
                {(list.listItems?.length || 0) > 0 ? list.listItems?.length : '0'}
              </Text>
            </View>
            <View style={styles.sharedRow}>
              <ListColumnTabUsers users={list.users?.map((user) => user.names) || []} />
            </View>
          </View>
        ) : (
          <PressableArea
            onPress={onPress}
            style={styles.button}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={list.name || 'Button'}
            accessibilityHint={`Press to select list ${list.name}`}
          >
            <View style={styles.titleRow}>
              <Text style={[styles.title, { color: touchableColor }]} numberOfLines={1} ellipsizeMode="middle">
                {list.name}
              </Text>
              <Text style={[styles.number, { color: touchableColor }]}>
                {(list.listItems?.length || 0) > 0 ? list.listItems?.length : '0'}
              </Text>
            </View>
            <View style={styles.sharedRow}>
              <ListColumnTabUsers users={list.users?.map((user) => user.names) || []} />
            </View>
          </PressableArea>
        )}
      </View>
    </ScrollIntoView>
  );
}

function ListColumnTabUsers({ users }: { users: string[] }) {
  const touchableColor = useThemeColor({}, 'touchable');

  const UsersIcon =
    users.length > 2
      ? ThreePersonasIcon
      : users.length > 1
        ? TwoPersonasIcon
        : users.length > 0
          ? PersonaIcon
          : PersonPlusIcon;
  const description =
    users.length > 2 ? `${users.length} users` : users.length > 0 ? users.join(' and ') : 'Not shared yet';

  return (
    <View style={styles.sharedRow}>
      <UsersIcon width={16} height={16} color={touchableColor} style={{ marginStart: -3 }} />
      <Text style={[styles.shared, { color: touchableColor }]} numberOfLines={1} ellipsizeMode="middle">
        {description}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tab: {
    paddingStart: 8,
    paddingEnd: 4,
    maxWidth: '45%',
  },
  buttonContainer: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  button: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  title: {
    position: 'relative',
    fontFamily: 'Montserrat',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 20,
    letterSpacing: -0.4,
    maxHeight: '100%',
  },
  number: {
    paddingStart: 6,
    fontFamily: 'Montserrat',
    fontSize: 14,
    fontWeight: '600',
  },
  sharedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  shared: {
    fontFamily: 'Montserrat',
    fontSize: 11,
    fontWeight: '400',
    letterSpacing: -0.4,
  },
});
