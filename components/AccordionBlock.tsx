// hooks
import { useEffect } from 'react';
import { useThemeColor } from '@/hooks/useThemeColor';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

// components
import { StyleSheet, View } from 'react-native';
import { CollapsibleHeader } from './CollapsibleHeader';
import { ThemedText } from './ThemedText';
import { ItemsList } from './ItemsList';

// types
import { ListItem } from '@/types/listItem';

export interface AccordionBlockProps {
  title: string;
  color?: string;
  newItemLabel?: string;
  newItemHandler?: () => void;
  items: ListItem[];
  onToggle?: () => void;
  isOpen?: boolean;
  emptyText?: string;
  onNew?: () => void;
}

export function AccordionBlock(block: AccordionBlockProps) {
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
          isOpen={block.isOpen!}
          onToggle={() => block.onToggle?.()}
          clickable={!block.isOpen}
        />
      </View>
      <Animated.View
        style={[
          {
            // flex: currentBlock === index ? 1 : 0,
            flexBasis: 0,
            // opacity: currentBlock === index ? 1 : 0,
            backgroundColor,
          },
          flexStyle,
        ]}
      >
        {block.items.length > 0 ? (
          <ItemsList
            newItemLabel={block.newItemLabel}
            newItemHandler={block.newItemHandler}
            items={block.items}
          />
        ) : (
          <View style={styles.centered}>
            <ThemedText>{block.emptyText || 'No items here'}</ThemedText>
          </View>
        )}
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
});
