// hooks and state
import { useEffect, useMemo, useRef, useState } from 'react';
import { useThemeColor } from '@/hooks/useThemeColor';
import { router, useLocalSearchParams } from 'expo-router';
import { observer } from '@legendapp/state/react';
import { lists$ as _lists$, generateId } from '@/state/state';
import { addItem, duplicateCompletedItem, updateItem } from '@/state/actions-lists';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// utils
import { convertItemsToListItems, groupItemsByCompletedAt } from '@/utils/lists';

// components
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import HeaderButton from '@/components/HeaderButton';
import { ThemedInput } from '@/components/ThemedInput';
import DateSelector from '@/components/DateSelector';
import WheelPicker from '@quidone/react-native-wheel-picker';
import { ItemsList } from '@/components/ItemsList';
import { ThemedText } from '@/components/ThemedText';
import { BackLink } from '@/components/BackLink';

import BagFillIcon from '@/assets/symbols/bag-fill.svg';

// types
import { ListItem } from '@/types/listItem';
import { globalStyles } from '@/constants/GlobalStyles';
import { Item } from '@/types/Item';
import SmallButton from '@/components/SmallButton';

const qtyItems = [...Array(100).keys()]
  .map((index) => ({
    value: index + 1,
    label: (index + 1).toString(),
  }))
  .reverse();

function ItemModal() {
  const { top: safeT } = useSafeAreaInsets();

  const primaryColor = useThemeColor({}, 'primary');
  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'wheelPickerBackground');
  const headerColor = useThemeColor({}, 'touchable');

  const params = useLocalSearchParams();
  const listId: string = params?.listId ? (Array.isArray(params?.listId) ? params.listId[0] : params.listId) : '';
  const listItems = _lists$[listId]?.listItems?.get() || null;

  const inputRef = useRef<TextInput>(null);

  const openitems = useMemo(
    () => convertItemsToListItems(listItems?.filter((item) => !item.completed) || [], true),
    [listItems]
  );
  const completedItems = useMemo(
    () => groupItemsByCompletedAt(convertItemsToListItems(listItems?.filter((item) => item.completed)) || []),
    [listItems]
  );

  const listItemId = params?.listItemId
    ? Array.isArray(params?.listItemId)
      ? params.listItemId[0]
      : params.listItemId
    : '';
  const item = listItems?.find((item) => item.listItemId === listItemId);
  const [name, setName] = useState(item?.name || '');
  const [quantity, setQuantity] = useState<number>(item ? parseInt(item.quantity.toString() || '1', 10) || 1 : 1);
  const [deadline, setDeadline] = useState<number | string | undefined>(item?.deadline || undefined);
  const [ongoing, setOngoing] = useState<boolean>(item?.ongoing || false);

  useEffect(() => {
    if (item) {
      setName(item.name);
      setQuantity(parseInt(item.quantity.toString() || '1', 10) || 1);
      setDeadline(item.deadline);
    }
  }, [item]);

  function updateName(value: string) {
    setName(value);
    // TODO: filter the completed items
  }

  function updateDeadline(date: string | number | undefined) {
    setDeadline(date);
  }

  function duplicateItem(item: ListItem) {
    duplicateCompletedItem(listId, item.id);
  }

  function submitData(closeModal = false) {
    if (listItemId) {
      updateEditedItem();
    } else {
      addNewItem(closeModal);
    }
  }

  function updateEditedItem() {
    if (!listItemId) {
      return;
    }

    const updatedItem = {
      name,
      quantity,
      deadline: deadline ? new Date(deadline).toISOString() : undefined,
    };

    updateItem(listId, listItemId, updatedItem);

    if (router.canDismiss()) {
      router.dismissTo(`/shopping/${listId}`);
    }
  }

  function addNewItem(closeModal = false) {
    const itemId = generateId();
    const newItem: Partial<Item> = {
      itemId,
      listId,
      type: 'item',
      name,
      quantity,
      deadline: deadline ? new Date(deadline).toISOString() : undefined,
      ongoing,
    };

    addItem(listId, newItem);
    setName('');
    setQuantity(1);
    setDeadline(undefined);

    if (closeModal && router.canDismiss()) {
      router.dismissTo(`/shopping/${listId}`);
    } else {
      // set focus to the input back in case submitBehavior="submit" is not working
      setTimeout(() => {
        inputRef.current?.focus();
      }, 1);
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <View
        style={[
          globalStyles.customHeader,
          { marginBottom: 0 },
          Platform.OS === 'android' ? { paddingTop: safeT + 12 } : {},
        ]}
      >
        {router.canGoBack() && <BackLink parentTitle="Cancel" />}
        <HeaderButton title={listItemId ? 'Update' : 'Add'} onPress={() => submitData(true)} />
      </View>

      <View style={styles.container}>
        <View>
          <View style={{ height: 82, opacity: 0.5 }}>
            <ItemsList inverted={true} actionIcon={false} submenu={false} items={openitems} />
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
                onSubmit={() => submitData(false)}
                inputRef={inputRef}
              />
              <View style={styles.properties}>
                <DateSelector placeholder="Buy before" value={deadline} onChange={updateDeadline} />
                <SmallButton
                  icon={BagFillIcon}
                  color={ongoing ? primaryColor : undefined}
                  title="In the cart"
                  onPress={() => {
                    setOngoing((state) => !state);
                  }}
                />
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
                overlayItemStyle={{ height: 56, backgroundColor, opacity: 0.2 }}
              />
            </View>
          </View>
          {completedItems.length > 0 && (
            <ThemedText style={[styles.suggestionsLabel, { color: headerColor }]}>
              Completed items to restore:
            </ThemedText>
          )}
        </View>
        <View style={{ flex: 2, opacity: 0.7 }}>
          {completedItems.length > 0 && (
            <ItemsList
              actionHandler={duplicateItem}
              submenu={false}
              style={Platform.OS === 'ios' ? { paddingBottom: 66 } : {}}
              items={completedItems}
            />
          )}
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
    justifyContent: 'space-between',
    width: '100%',
  },
  suggestionsLabel: {
    paddingHorizontal: 24,
    marginVertical: 8,
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.7,
  },
});

export default observer(ItemModal);
