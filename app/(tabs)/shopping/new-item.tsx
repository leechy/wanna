// hooks
import { useState } from 'react';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useLocalSearchParams } from 'expo-router';
import { observer } from '@legendapp/state/react';
import { lists$ as _lists$, generateId } from '@/state/state';

// components
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { ThemedInput } from '@/components/ThemedInput';
import DateSelector from '@/components/DateSelector';
import WheelPicker from '@quidone/react-native-wheel-picker';
import { ItemsList } from '@/components/ItemsList';
import { ThemedText } from '@/components/ThemedText';

// types
import { convertItemsToListItems, ListItem } from '@/types/listItem';
import { addItem } from '@/state/actions-lists';

const qtyItems = [...Array(100).keys()]
  .map((index) => ({
    value: index + 1,
    label: (index + 1).toString(),
  }))
  .reverse();

function NewItemModal() {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [deadline, setDeadline] = useState<number | string | undefined>();

  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'wheelPickerBackground');
  const headerColor = useThemeColor({}, 'touchable');

  const params = useLocalSearchParams();
  const listId: string = params?.listId ? (Array.isArray(params?.listId) ? params.listId[0] : params.listId) : '';
  const listItems = listId ? _lists$[listId]?.listItems?.get() : null;

  function updateName(value: string) {
    setName(value);
    // TODO: filter the completed items
    console.log('Update name', listId, value);
  }

  function updateDeadline(date: string | number | undefined) {
    setDeadline(date);
  }

  function restoreItem(item: ListItem) {
    console.log('Restore item', item);
  }

  function addNewItem() {
    const itemId = generateId();
    const newItem = {
      itemId,
      listId,
      type: 'item',
      name,
      quantity,
      deadline: deadline ? new Date(deadline).toISOString() : undefined,
    };
    console.log('Add new item', newItem);
    addItem(listId, newItem);
    setName('');
    setQuantity(1);
    setDeadline(undefined);
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
      <View style={styles.container}>
        <View style={{}}>
          <View style={{ height: 82, opacity: 0.5 }}>
            <ItemsList
              actionHandler={restoreItem}
              inverted={true}
              actionIcon={false}
              submenu={false}
              items={convertItemsToListItems(listItems).reverse()}
            />
          </View>
          <View style={{ flexDirection: 'row', width: '100%', height: 116, paddingHorizontal: 16 }}>
            <View style={{ flexDirection: 'column', flex: 1, alignItems: 'flex-start' }}>
              <ThemedInput
                placeholder="Item name"
                value={name}
                onChange={updateName}
                containerStyle={{ marginVertical: 8 }}
                keyboardType="default"
                enterKeyHint="next"
                onSubmit={addNewItem}
              />
              <View style={styles.properties}>
                <DateSelector placeholder="Buy before" value={deadline} onChange={updateDeadline} />
              </View>
            </View>
            <Text style={{ width: 32, textAlign: 'center', fontSize: 24, lineHeight: 68, color: textColor }}>
              &times;
            </Text>
            <View style={{ width: 64, marginTop: -104 }}>
              <WheelPicker
                data={qtyItems}
                value={quantity}
                onValueChanged={({ item: { value } }) => setQuantity(value)}
                itemHeight={56}
                itemTextStyle={{
                  fontFamily: 'Montserrat',
                  fontSize: 18,
                  width: 64,
                  color: textColor,
                }}
                style={{ width: 64, height: 168 }}
                overlayItemStyle={{ height: 56, backgroundColor, opacity: 0.1 }}
              />
            </View>
          </View>
          <ThemedText style={{ paddingHorizontal: 24, marginBottom: 8, color: headerColor }}>Suggestions:</ThemedText>
        </View>
        <View style={{ flex: 2 }}>
          <ItemsList
            actionHandler={restoreItem}
            submenu={false}
            style={{ paddingBottom: 126 }}
            items={[
              {
                id: 'purchase1',
                type: 'group',
                label: '25 Decemeber 2024',
              },
              {
                type: 'item',
                id: 'beefbullion2',
                label: 'Beef bullion',
                quantity: 1,
                ongoing: false,
                completed: true,
              },
              {
                type: 'item',
                id: 'crepeflour2',
                label: 'Crepe flour',
                quantity: 2,
                ongoing: false,
                completed: true,
              },
              {
                type: 'item',
                id: 'beefbullion',
                label: 'Beef bullion',
                quantity: 1,
                ongoing: false,
                completed: true,
              },
              {
                type: 'item',
                id: 'crepeflour',
                label: 'Crepe flour',
                quantity: 2,
                ongoing: false,
                completed: true,
              },
              {
                type: 'item',
                id: 'beefbullion3',
                label: 'Beef bullion',
                quantity: 1,
                ongoing: false,
                completed: true,
              },
              {
                type: 'item',
                id: 'crepeflour3',
                label: 'Crepe flour',
                quantity: 2,
                ongoing: false,
                completed: true,
              },
              {
                type: 'item',
                id: 'beefbullion4',
                label: 'Beef bullion',
                quantity: 1,
                ongoing: false,
                completed: true,
              },
              {
                type: 'item',
                id: 'crepeflour4',
                label: 'Crepe flour',
                quantity: 2,
                ongoing: false,
                completed: true,
              },
            ]}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    height: '100%',
  },
  properties: {
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
});

export default observer(NewItemModal);
