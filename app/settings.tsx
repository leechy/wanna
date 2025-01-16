import { profiles$ as _profiles$, user$ as _user$ } from '@/state/state';
import { supabase } from '@/state/state';

// components
import { Text, View } from 'react-native';
import Page from '@/components/Page';
import SmallButton from '@/components/SmallButton';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

// styles
import { globalStyles } from '@/constants/GlobalStyles';
import { observer } from '@legendapp/state/react';

function SettingsScreen() {
  const profiles = _profiles$.get();
  function displayProfiles() {
    console.log('profiles', profiles);
  }

  function logout() {
    supabase.auth.signOut();
  }

  return (
    <Page hasHeader={true}>
      <ThemedView style={globalStyles.titleContainer}>
        <ThemedText type="title">Settings </ThemedText>
        <SmallButton title="Log Out" onPress={logout} />
      </ThemedView>
      <View style={{ padding: 16 }}>
        <Text>Current user id: {_user$.get()?.id}</Text>
      </View>
      <View style={{ padding: 16 }}>
        <SmallButton title="Dump profiles" onPress={displayProfiles} />
        <Text>Profiles no: {Object.keys(_profiles$.get() || {}).length}</Text>
      </View>
    </Page>
  );
}

export default observer(SettingsScreen);
