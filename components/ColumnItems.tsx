import { StyleSheet, View } from 'react-native';
import { ItemsList } from '@/components/ItemsList';
import { PressableArea } from '@/components/PressableArea';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import PlusIcon from '@/assets/symbols/square-plus.svg';

import { ColumnData } from '@/types/ColumnData';

interface ColumnItemsProps {
  block: ColumnData;
  paddingBottom?: number;
}

export function ColumnItems({ block, paddingBottom }: ColumnItemsProps) {
  const primaryColor = useThemeColor({}, 'primary');

  const NewIcon = block.newItemIcon || PlusIcon;

  return block.items.length > 0 ? (
    <ItemsList
      newItemLabel={block.newItemLabel}
      newItemHandler={block.newItemHandler}
      actionHandler={block.actionHandler}
      checkboxHandler={block.checkboxHandler}
      longPressHandler={block.longPressHandler}
      editHandler={block.editHandler}
      deleteHandler={block.deleteHandler}
      resetHandler={block.resetHandler}
      items={block.items}
      paddingBottom={paddingBottom}
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
      <View style={[styles.centered, { paddingBottom }]}>
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
    <View style={[styles.centered, { paddingBottom }]}>
      <ThemedText style={{ textAlign: 'center' }}>{block.emptyText || 'No items here'}</ThemedText>
    </View>
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
