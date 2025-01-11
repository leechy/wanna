// hooks
import { useState } from 'react';

// components
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import TitleInput from '@/components/TitleInput';
import SmallButton from '@/components/SmallButton';
import { ThemedText } from '@/components/ThemedText';
import Checkbox from '@/components/Checkbox';

// icons
import PersonPlusIcon from '@/assets/symbols/person-plus.svg';
import DateSelector from '@/components/DateSelector';

export default function NewListModal() {
  const [title, setTitle] = useState('');
  const [deadline, setDeadline] = useState<number | undefined>();
  const [sharedNewUser, setSharedNewUser] = useState(true);

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <View style={styles.container}>
        <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />

        <View style={styles.properties}>
          <DateSelector placeholder="Deadline" value={deadline} onChange={setDeadline} />
          <SmallButton title="Not yet shared" icon={PersonPlusIcon} onPress={() => {}} />
        </View>
        <TitleInput placeholder="Shopping list" value={title} onChange={setTitle} />

        <View style={{ width: '100%', marginTop: 16, marginBottom: 8 }}>
          <ThemedText type="defaultSemiBold">Send push notifications when:</ThemedText>
        </View>
        <Checkbox checked={sharedNewUser} onChange={setSharedNewUser}>
          list is shared with a new user
        </Checkbox>
        <Checkbox checked={true} onChange={() => {}}>
          new item is added or removed
        </Checkbox>
        <Checkbox checked={true} onChange={() => {}}>
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
