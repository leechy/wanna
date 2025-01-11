// hooks
import { useState } from 'react';
import { useThemeColor } from '@/hooks/useThemeColor';

// components
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { ThemedInput } from '@/components/ThemedInput';
import DateSelector from '@/components/DateSelector';
import WheelPicker from '@quidone/react-native-wheel-picker';

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

  function updateName(value: string) {
    setName(value);
    // TODO: filter the completed items
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <View style={styles.container}>
        <View style={{ borderWidth: 1, height: 82 }} />
        <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
        <View style={{ flexDirection: 'row', width: '100%' }}>
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
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: 'flex-start',
  },
  properties: {
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
});
