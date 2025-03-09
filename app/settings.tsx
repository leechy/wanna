import { useSelector } from '@legendapp/state/react';
import { user$ as _user$, lists$ as _lists$ } from '@/state/state';
import { logout } from '@/state/actions-user';
import { clearLists } from '@/state/actions-lists';
import { getHRID } from '@/utils/human-readable-ids';

// components
import { Text, View } from 'react-native';
import { Redirect } from 'expo-router';
import Page from '@/components/Page';
import SmallButton from '@/components/SmallButton';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

// styles
import { globalStyles } from '@/constants/GlobalStyles';

function SettingsScreen() {
  const lists = useSelector(_lists$);
  const user = useSelector(_user$);

  function dumpLists() {
    console.log('lists', lists);
  }

  function dumpUser() {
    console.log('user', user);
  }

  function getId() {
    alert(getHRID());
  }

  // in case there is no user, redirect to sign-in
  if (!user?.uid) {
    return <Redirect href="/sign-in" />;
  }

  return (
    <Page hasHeader={true}>
      <ThemedView style={globalStyles.titleContainer}>
        <ThemedText type="title">Settings </ThemedText>
        <SmallButton title="Log Out" onPress={logout} />
      </ThemedView>
      <View style={{ padding: 16, gap: 12 }}>
        <Text>Current user id: {user.uid}</Text>
        <Text>Current name: {user.names}</Text>
      </View>
      <View style={{ padding: 16, gap: 12 }}>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <SmallButton title="Dump user" onPress={dumpUser} />
        </View>
      </View>
      <View style={{ padding: 16, gap: 12 }}>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <SmallButton title="Dump lists" onPress={dumpLists} />
          <SmallButton title="Clear lists" onPress={clearLists} />
        </View>
        <Text>Lists no: {Object.keys(lists).length}</Text>
      </View>

      <View style={{ padding: 16, gap: 12 }}>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <SmallButton title="Get Human Readable ID" onPress={getId} />
        </View>
      </View>
    </Page>
  );
}

export default SettingsScreen;
