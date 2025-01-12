// hooks
import { useState } from 'react';
import { useThemeColor } from '@/hooks/useThemeColor';

// components
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { ThemedInput } from '@/components/ThemedInput';
import DateSelector from '@/components/DateSelector';
import WheelPicker from '@quidone/react-native-wheel-picker';
import { ItemsList } from '@/components/ItemsList';
import { ListItem } from '@/types/listItem';
import { ThemedText } from '@/components/ThemedText';

const qtyItems = [...Array(100).keys()]
  .map((index) => ({
    value: index + 1,
    label: (index + 1).toString(),
  }))
  .reverse();

export default function NewItemModal() {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(1);

  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'wheelPickerBackground');
  const headerColor = useThemeColor({}, 'touchable');

  function updateName(value: string) {
    setName(value);
    // TODO: filter the completed items
  }

  function restoreItem(item: ListItem) {
    console.log('Restore item', item);
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
              items={[
                {
                  type: 'item',
                  id: 'beefbullion',
                  label: 'Beef bullion',
                  quantity: 1,
                  inProgress: false,
                },
                {
                  type: 'item',
                  id: 'crepeflour',
                  label: 'Crepe flour',
                  quantity: 2,
                  inProgress: false,
                },
              ]}
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
              />
              <View style={styles.properties}>
                <DateSelector placeholder="Buy before" onChange={() => {}} />
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
            items={[
              {
                id: 'purchase1',
                type: 'group',
                label: '25 Decemeber 2024',
              },
              {
                type: 'item',
                id: 'beefbullion',
                label: 'Beef bullion',
                quantity: 1,
                inProgress: false,
                completed: true,
              },
              {
                type: 'item',
                id: 'crepeflour',
                label: 'Crepe flour',
                quantity: 2,
                inProgress: false,
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
  },
  properties: {
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
});
