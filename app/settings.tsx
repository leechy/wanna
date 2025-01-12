import Page from '@/components/Page';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { globalStyles } from '@/constants/GlobalStyles';

export default function SettingsScreen() {
  return (
    <Page hasHeader={true}>
      <ThemedView style={globalStyles.titleContainer}>
        <ThemedText type="title">Settings </ThemedText>
      </ThemedView>
    </Page>
  );
}
