// hooks and state
import { useState } from 'react';
import { supabase } from '@/state/state';
import { addUserProfile } from '@/state/actions-user';

// components
import { router, Stack } from 'expo-router';
import { KeyboardAvoidingView, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ThemedButton } from '@/components/ThemedButton';
import { ThemedInput } from '@/components/ThemedInput';

export default function SignInScreen() {
  const [name, setName] = useState('');

  const signInAnonymously = async () => {
    const { data, error } = await supabase.auth.signInAnonymously();
    if (error) {
      // TODO: handle errors here
      // show some error message to the user
      console.error('signInAnonymously error', error);
    }
    if (typeof data.user?.id === 'string') {
      addUserProfile(data.user.id, name.trim());
      router.replace('/');
    }
  };

  const createAccount = () => {
    if (name.length === 0) {
      return;
    }

    signInAnonymously();
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Tell us your name' }} />
      <ThemedView style={styles.container}>
        <KeyboardAvoidingView behavior={'padding'} style={styles.keyboardAV}>
          <ThemedText
            type="title"
            style={{
              transform: [{ rotate: '-3deg' }],
              marginBottom: 16,
            }}
          >
            Wanna Wanna
          </ThemedText>
          <ThemedText type="subtitle" style={{ textAlign: 'center', marginVertical: 8 }}>
            sharing wishes starts with...
          </ThemedText>
          <ThemedInput
            containerStyle={{ marginHorizontal: 16, marginTop: 24 }}
            placeholder="your name"
            value={name}
            onChange={setName}
            onSubmit={createAccount}
          />
          <ThemedButton style={{ marginHorizontal: 16 }} title="Let's go" onPress={createAccount} />
        </KeyboardAvoidingView>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  keyboardAV: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    minHeight: 52,
    marginTop: 24,
    marginBottom: 32,
    paddingVertical: 0,
    paddingHorizontal: 16,
    width: '90%',
    borderWidth: 0,
    borderRadius: 12,
    fontSize: 18,
  },
});
