import { observer } from '@legendapp/state/react';
import { user$ as _user$, profile$ as _profile$, lists$ as _lists$ } from '@/state/state';
import { clearProfile, logout } from '@/state/actions-user';
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
  function dumpProfile() {
    console.log('profiles', _profile$.get());
  }

  function dumpLists() {
    console.log('lists', _lists$.get());
  }

  function dumpUser() {
    console.log('user', _user$.get());
  }

  return (
    <Page hasHeader={true}>
      <ThemedView style={globalStyles.titleContainer}>
        <ThemedText type="title">Settings </ThemedText>
        <SmallButton title="Log Out" onPress={logout} />
      </ThemedView>
      <View style={{ padding: 16, gap: 12 }}>
        <Text>Current user id: {_user$.id.get()}</Text>
        <Text>Current name: {_profile$.names.get() as string}</Text>
      </View>
      <View style={{ padding: 16, gap: 12 }}>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <SmallButton title="Dump user" onPress={dumpUser} />
        </View>
      </View>
      <View style={{ padding: 16, gap: 12 }}>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <SmallButton title="Dump profile" onPress={dumpProfile} />
          <SmallButton title="Clear profile" onPress={clearProfile} />
        </View>
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
