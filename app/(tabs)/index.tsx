// hooks and state
import { useSelector } from '@legendapp/state/react';
import { profiles$ } from '@/state/user';

// components
import { Image, StyleSheet, Platform } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ThemedButton } from '@/components/ThemedButton';
import Collapsible from 'react-native-collapsible';
import { useState } from 'react';
import { CollapsibleHeader } from '@/components/CollapsibleHeader';
import { ItemsList } from '@/components/ItemsList';

export default function HomeScreen() {
  const profiles = useSelector(profiles$);
  const displayProfiles = () => {
    console.log('profiles', profiles);
  };

  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Current wishes </ThemedText>
      </ThemedView>

      <CollapsibleHeader
        title="Past Deadline"
        items={3}
        color="#E73D01"
        isOpen={!isCollapsed}
        onToggle={() => {
          setIsCollapsed((state) => !state);
        }}
      />
      <ItemsList />
      <CollapsibleHeader
        title="Ongoing"
        isOpen={!isCollapsed}
        onToggle={() => {
          setIsCollapsed((state) => !state);
        }}
      />
      <ItemsList />
      <CollapsibleHeader
        title="Completed"
        items={42}
        isOpen={!isCollapsed}
        onToggle={() => {
          setIsCollapsed((state) => !state);
        }}
      />

      <Collapsible collapsed={isCollapsed}>
        <ThemedView>
          <ThemedText type="subtitle">Profiles</ThemedText>
        </ThemedView>
      </Collapsible>
      <ThemedButton title="Dump Profiles" onPress={displayProfiles} />
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 1: Try it</ThemedText>
        <ThemedText>
          Edit{' '}
          <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText>{' '}
          to see changes. Press{' '}
          <ThemedText type="defaultSemiBold">
            {Platform.select({
              ios: 'cmd + d',
              android: 'cmd + m',
              web: 'F12',
            })}
          </ThemedText>{' '}
          to open developer tools.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 2: Explore</ThemedText>
        <ThemedText>
          Tap the Explore tab to learn more about what's included in this
          starter app.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
        <ThemedText>
          When you're ready, run{' '}
          <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText>{' '}
          to get a fresh <ThemedText type="defaultSemiBold">app</ThemedText>{' '}
          directory. This will move the current{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
          <ThemedText type="defaultSemiBold">app-example</ThemedText>.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
