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

export default function Modal() {
  const isPresented = router.canGoBack();
  const primaryColor = useThemeColor({}, 'primary');

  const [title, setTitle] = useState('');

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <View style={styles.container}>
        <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />

        <TitleInput
          placeholder="Shopping list"
          value={title}
          onChange={setTitle}
        />
        <Text>Modal screen</Text>
        {!isPresented && <Link href="../">Dismiss modal</Link>}
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
  titleInputContainer: {
    borderRadius: 12,
    width: '100%',
    height: 85,
    transform: [{ rotate: '-1deg' }],
  },
  titleInput: {
    width: '100%',
    fontFamily: 'GreatVibes-Regular',
    fontSize: 60,
    lineHeight: 76,
  },
});
