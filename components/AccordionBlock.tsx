// hooks
import { useEffect, useMemo } from 'react';
import { useThemeColor } from '@/hooks/useThemeColor';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

// components
import { StyleSheet, View } from 'react-native';
import { CollapsibleHeader } from './CollapsibleHeader';
import { ThemedText } from './ThemedText';
import { ItemsList } from './ItemsList';
import PlusIcon from '@/assets/symbols/square-plus.svg';

// types
import { ListItem } from '@/types/listItem';
import { SvgProps } from 'react-native-svg';
import { PressableArea } from './PressableArea';

export interface AccordionBlockProps {
  title: string;
  color?: string;
  action?: React.ReactNode;
  newItemLabel?: string;
  newItemHandler?: () => void;
  newItemIcon?: React.FC<SvgProps>;
  actionHandler?: (item: ListItem) => void;
  checkboxHandler?: (item: ListItem) => void;
  longPressHandler?: (item: ListItem) => void;
  editHandler?: (item: ListItem) => void;
  deleteHandler?: (item: ListItem) => void;
  items: ListItem[];
  onToggle?: () => void;
  isOpen?: boolean;
  showEmpty?: boolean;
  emptyText?: string;
  onNew?: () => void;
}

export function AccordionBlock(block: AccordionBlockProps) {
  const backgroundColor = useThemeColor({}, 'background');
  const primaryColor = useThemeColor({}, 'primary');

  const flex = useSharedValue(block.isOpen ? 1 : 0);

  const NewIcon = block.newItemIcon || PlusIcon;

  useEffect(() => {
    flex.value = block.isOpen ? 1 : 0;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [block.isOpen]);

  const flexStyle = useAnimatedStyle(() => ({
    flex: withTiming(flex.value, {
      duration: 200,
      easing: Easing.inOut(Easing.sin),
    }),
  }));

  const itemsCount: number = useMemo(() => {
    // if the first item in the list is a group --
    // we need to count only the group items
    if (block.items?.[0]?.type === 'group') {
      return block.items.reduce((acc, item) => {
        if (item.type === 'group') {
          return acc + 1;
        }
        return acc;
      }, 0);
    }
    return block.items?.length || 0;
  }, [block.items]);

  return (
    <>
      <View style={[styles.header, { backgroundColor }]}>
        <CollapsibleHeader
          title={block.title}
          items={itemsCount}
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
            longPressHandler={block.longPressHandler}
            editHandler={block.editHandler}
            deleteHandler={block.deleteHandler}
            items={block.items}
          />
        ) : block.newItemHandler ? (
          <PressableArea
            onPress={block.newItemHandler}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Create new list"
            accessibilityHint="Press to create a new list"
            style={{ flex: 1, padding: 16 }}
          >
            <View style={styles.centered}>
              <View style={{ marginBottom: 32, alignItems: 'center', flexShrink: 0 }}>
                <NewIcon width={52} height={52} color={primaryColor} />
                <ThemedText
                  onPress={block.newItemHandler}
                  type="subtitle"
                  style={{ textAlign: 'center', color: primaryColor }}
                >
                  {block.newItemLabel}
                </ThemedText>
              </View>
              <ThemedText style={{ textAlign: 'center' }}>{block.emptyText || 'No items here'}</ThemedText>
            </View>
          </PressableArea>
        ) : (
          <View style={styles.centered}>
            <ThemedText style={{ textAlign: 'center' }}>{block.emptyText || 'No items here'}</ThemedText>
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
