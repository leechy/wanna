import { observer } from '@legendapp/state/react';
import { user$ as _user$, profiles$ as _profiles$, lists$ as _lists$ } from '@/state/state';
import { getUserProfile, logout } from '@/state/actions-user';
import { clearLists } from '@/state/actions-lists';

// components
import { Text, View } from 'react-native';
import Page from '@/components/Page';
import SmallButton from '@/components/SmallButton';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

// styles
import { globalStyles } from '@/constants/GlobalStyles';

function SettingsScreen() {
  const userName = getUserProfile()?.names || 'Unknown';

  const profiles = _profiles$.get();
  function dumpProfiles() {
    console.log('profiles', profiles);
  }

  function dumpLists() {
    console.log('lists', _lists$.get());
  }

  return (
    <Page hasHeader={true}>
      <ThemedView style={globalStyles.titleContainer}>
        <ThemedText type="title">Settings </ThemedText>
        <SmallButton title="Log Out" onPress={logout} />
      </ThemedView>
      <View style={{ padding: 16, gap: 12 }}>
        <Text>Current user id: {_user$.get()?.id}</Text>
        <Text>Current name: {userName}</Text>
      </View>
      <View style={{ padding: 16, gap: 12 }}>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <SmallButton title="Dump profiles" onPress={dumpProfiles} />
        </View>
        <Text>Profiles no: {Object.keys(_profiles$.get() || {}).length}</Text>
      </View>
      <View style={{ padding: 16, gap: 12 }}>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <SmallButton title="Dump lists" onPress={dumpLists} />
          <SmallButton title="Clear lists" onPress={clearLists} />
        </View>
        <Text>Lists no: {Object.keys(_lists$.get() || {}).length}</Text>
      </View>
    </Page>
  );
}

export default observer(SettingsScreen);
