import { StyleSheet, Image, Platform, View, SafeAreaView } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ThemedButton } from '@/components/ThemedButton';
import { registerForPushNotifications } from '@/utils/notifications';
import { CollapsibleHeader } from '@/components/CollapsibleHeader';
import { ItemsList } from '@/components/ItemsList';
import { Colors } from '@/constants/Colors';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Fragment, useEffect, useState } from 'react';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

export default function TabTwoScreen() {
  const primaryColor = useThemeColor({}, 'primary');

  const blocks = [
    {
      title: 'Left to buy',
      items: [],
    },
    {
      title: 'Cart',
      color: primaryColor,
      items: [],
    },
    {
      title: 'Past purchases',
      items: [],
    },
  ];
  const [currentBlock, setCurrentBlock] = useState(0);

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.container}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Lists </ThemedText>
        </ThemedView>
        {blocks.map((block, index) => (
          <AccordionBlock
            {...block}
            isOpen={currentBlock === index}
            key={'block' + index}
            onToggle={() => {
              setCurrentBlock(index);
            }}
          />
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: { flex: 1 },
  container: {
    flex: 1,
    paddingBottom: 48, // height of the toolbar!
  },
  titleContainer: {
    paddingHorizontal: 16,
  },
});

export interface AccordionBlockProps {
  title: string;
  color?: string;
  items: any[];
  onToggle?: () => void;
  isOpen: boolean;
}

const AccordionBlock = (block: AccordionBlockProps) => {
  const backgroundColor = useThemeColor({}, 'background');

  const flex = useSharedValue(block.isOpen ? 1 : 0);

  useEffect(() => {
    flex.value = block.isOpen ? 1 : 0;
  }, [block.isOpen]);

  const flexStyle = useAnimatedStyle(() => ({
    flex: withTiming(flex.value, {
      duration: 200,
      easing: Easing.inOut(Easing.sin),
    }),
  }));

  return (
    <>
      <View style={{ paddingHorizontal: 12, backgroundColor }}>
        <CollapsibleHeader
          title={block.title}
          items={block.items?.length}
          color={block.color}
          isOpen={block.isOpen}
          onToggle={() => block.onToggle?.()}
          clickable={!block.isOpen}
        />
      </View>
      <Animated.View
        style={[
          {
            // flex: currentBlock === index ? 1 : 0,
            flexBasis: 0,
            paddingHorizontal: 16,
            // opacity: currentBlock === index ? 1 : 0,
          },
          flexStyle,
        ]}
      >
        <ItemsList />
      </Animated.View>
    </>
  );
};
