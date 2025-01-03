// hooks
import { useState } from 'react';
import { useThemeColor } from '@/hooks/useThemeColor';

// components
import { Link, router } from 'expo-router';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import TitleInput from '@/components/TitleInput';
import SmallButton from '@/components/SmallButton';

import PersonPlusIcon from '@/assets/symbols/person-plus.svg';
import SquareCalendarIcon from '@/assets/symbols/square-calendar.svg';

export default function Modal() {
  const [title, setTitle] = useState('');

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <View style={styles.container}>
        <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />

        <View style={styles.properties}>
          <SmallButton
            title="No deadline"
            icon={SquareCalendarIcon}
            onPress={() => {}}
          />
          <SmallButton
            title="Not shared"
            icon={PersonPlusIcon}
            onPress={() => {}}
          />
        </View>
        <TitleInput
          placeholder="Shopping list"
          value={title}
          onChange={setTitle}
        />
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
