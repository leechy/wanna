// hooks
import { useEffect, useState } from 'react';
import { lists$ as _lists$ } from '@/state/state';

// components
import { KeyboardAvoidingView, Platform, StyleSheet, View, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import TitleInput from '@/components/TitleInput';
import SmallButton from '@/components/SmallButton';
import { ThemedText } from '@/components/ThemedText';
import Checkbox from '@/components/Checkbox';

// icons
import PersonPlusIcon from '@/assets/symbols/persona-plus.svg';
import DateSelector from '@/components/DateSelector';
import { addList, updateList } from '@/state/actions-lists';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import HeaderButton from '@/components/HeaderButton';

export default function NewListModal() {
  const [name, setName] = useState('');
  const [deadline, setDeadline] = useState<number | string | undefined>();
  const [sharedNewUser, setSharedNewUser] = useState(true);
  const [listItemsUpdate, setListItemsUpdate] = useState(true);
  const [itemStateUpdate, setItemStateUpdate] = useState(true);

  const params = useLocalSearchParams();
  const listData = params?.listId ? _lists$.get()?.[params?.listId as string] : null;

  useEffect(() => {
    if (listData) {
      console.log('listData', listData);
      setName(listData.name);
      setDeadline(listData.deadline ? new Date(listData.deadline).getTime() : undefined);
      setSharedNewUser(listData.notify_on_user_at_location);
      setListItemsUpdate(listData.notify_on_list_items_update);
      setItemStateUpdate(listData.notify_on_item_state_update);
    }
  }, [listData]);

  function submitData() {
    if (params?.listId) {
      updateCurrentList();
    } else {
      createNewList();
    }
  }

  async function updateCurrentList() {
    updateList(params?.listId as string, {
      name,
      deadline: deadline ? new Date(deadline).toISOString() : null,
      notify_on_user_at_location: sharedNewUser,
      notify_on_list_items_update: listItemsUpdate,
      notify_on_item_state_update: itemStateUpdate,
    });
    router.dismissTo(`/shopping/${params?.listId}`);
  }

  async function createNewList() {
    const newListId = await addList({
      name,
      type: 'shopping-list',
      deadline: deadline ? new Date(deadline).toISOString() : null,
      notify_on_user_at_location: sharedNewUser,
      notify_on_list_items_update: listItemsUpdate,
      notify_on_item_state_update: itemStateUpdate,
    });

    if (newListId) {
      router.dismissTo(`/shopping/${newListId}`);
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <Stack.Screen
        options={{
          headerRight: () => <HeaderButton title={params?.listId ? 'Update' : 'Create'} onPress={submitData} />,
        }}
      />
      <View style={styles.container}>
        <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />

        <Text></Text>
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
        <TitleInput placeholder="Shopping list" value={name} onChange={setName} onSubmit={submitData} />

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
    marginBottom: 16,
    width: '100%',
  },
});
