// hooks and state
import { useEffect, useState } from 'react';
import { lists$ as _lists$ } from '@/state/state';
import { addList, updateList } from '@/state/actions-lists';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// components
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import TitleInput from '@/components/TitleInput';
import SmallButton from '@/components/SmallButton';
import { ThemedText } from '@/components/ThemedText';
import Checkbox from '@/components/Checkbox';
import HeaderButton from '@/components/HeaderButton';
import DateSelector from '@/components/DateSelector';
import { BackLink } from '@/components/BackLink';

// icons
import PersonPlusIcon from '@/assets/symbols/persona-plus.svg';
import { globalStyles } from '@/constants/GlobalStyles';

export default function NewListModal() {
  const [name, setName] = useState('');
  const [deadline, setDeadline] = useState<number | string | undefined>();
  const [sharedNewUser, setSharedNewUser] = useState(true);
  const [listItemsUpdate, setListItemsUpdate] = useState(true);
  const [itemStateUpdate, setItemStateUpdate] = useState(true);

  const { top: safeT } = useSafeAreaInsets();

  const params = useLocalSearchParams();
  const listId: string = params?.listId ? (Array.isArray(params?.listId) ? params.listId[0] : params.listId) : '';
  const listData = listId ? _lists$[listId]?.get() : null;

  useEffect(() => {
    if (listData) {
      // console.log('listData', listData);
      setName(listData.name);
      setDeadline(listData.deadline ? new Date(listData.deadline).getTime() : undefined);
      setListItemsUpdate(listData.notifyOnListItemsUpdate || true);
      setItemStateUpdate(listData.notifyOnItemStateUpdate || true);
      setSharedNewUser(listData.notifyOnListShared || true);
    }
  }, [listData]);

  function submitData() {
    if (listId) {
      updateCurrentList();
    } else {
      createNewList();
    }
  }

  async function updateCurrentList() {
    updateList(listId as string, {
      name,
      deadline: deadline ? new Date(deadline).toISOString() : undefined,
      notifyOnListItemsUpdate: listItemsUpdate,
      notifyOnItemStateUpdate: itemStateUpdate,
      notifyOnListShared: sharedNewUser,
      updatedAt: new Date().toISOString(),
    });
    router.dismissTo(`/shopping/${listId}`);
  }

  async function createNewList() {
    const newListId = await addList({
      name,
      type: 'shopping-list',
      deadline: deadline ? new Date(deadline).toISOString() : undefined,
      notifyOnListItemsUpdate: listItemsUpdate,
      notifyOnItemStateUpdate: itemStateUpdate,
      notifyOnListShared: sharedNewUser,
    });

    if (newListId) {
      router.dismissTo(`/shopping/${newListId}`);
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <View style={[globalStyles.customHeader, Platform.OS === 'android' ? { paddingTop: safeT + 12 } : {}]}>
        {router.canGoBack() && <BackLink parentTitle="Cancel" />}
        <HeaderButton title={listId ? 'Update' : 'Create'} onPress={submitData} />
      </View>
      <View style={styles.container}>
        <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
        <TitleInput placeholder="Shopping list" value={name} onChange={setName} onSubmit={submitData} />
        <View style={styles.properties}>
          <DateSelector
            placeholder="No deadline"
            value={deadline}
            onChange={(value) => {
              setDeadline(value);
            }}
          />
          <SmallButton title="Not yet shared" icon={PersonPlusIcon} onPress={() => {}} />
        </View>

        <View style={{ width: '100%', marginTop: 16, marginBottom: 8 }}>
          <ThemedText type="defaultSemiBold">Send push notifications when:</ThemedText>
        </View>
        <Checkbox checked={sharedNewUser} onChange={setSharedNewUser}>
          list is shared with a new user
        </Checkbox>
        <Checkbox checked={listItemsUpdate} onChange={setListItemsUpdate}>
          new item is added or removed
        </Checkbox>
        <Checkbox checked={itemStateUpdate} onChange={setItemStateUpdate}>
          an item was placed in the cart
        </Checkbox>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  properties: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 8,
    width: '100%',
  },
});
