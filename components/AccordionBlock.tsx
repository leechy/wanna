// hooks
import { useEffect } from 'react';
import { useThemeColor } from '@/hooks/useThemeColor';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

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
  action?: React.ReactNode;
  newItemLabel?: string;
  newItemHandler?: () => void;
  actionHandler?: (item: ListItem) => void;
  checkboxHandler?: (item: ListItem) => void;
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
      <View style={[styles.header, { backgroundColor }]}>
        <CollapsibleHeader
          title={block.title}
          items={block.items?.length}
          color={block.color}
          isOpen={block.isOpen!}
          onToggle={() => block.onToggle?.()}
        />
        {block.action && <View style={styles.action}>{block.action}</View>}
      </View>
      <Animated.View
        style={[
          {
            flexBasis: 0,
            backgroundColor,
          },
          flexStyle,
        ]}
      >
        {block.items.length > 0 ? (
          <ItemsList
            newItemLabel={block.newItemLabel}
            newItemHandler={block.newItemHandler}
            actionHandler={block.actionHandler}
            checkboxHandler={block.checkboxHandler}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  action: {
    marginTop: 6,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
});
