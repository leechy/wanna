// hooks
import { useThemeColor } from '@/hooks/useThemeColor';

// components
import { Pressable, StyleSheet, View } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { AccordionBlockProps } from '@/components/AccordionBlock';
import { ColumnItems } from '@/components/ColumnItems';
import { PressableArea } from '@/components/PressableArea';
import ScrollingTabs from '@/components/ScrollingTabs';

// types and styles
import { SvgProps } from 'react-native-svg';
import { globalStyles } from '@/constants/GlobalStyles';

interface ColumnsProps {
  blocks: AccordionBlockProps[];
  title?: string;
  titleIcon?: React.FC<SvgProps>;
  titleAction?: () => void;
  titleLongPressAction?: () => void;
  openBlock?: number;
}

export function Columns({ title, blocks, titleIcon, titleAction, titleLongPressAction, openBlock = 0 }: ColumnsProps) {
  const textColor = useThemeColor({}, 'text');

  const TitleIcon = titleIcon || (() => null);

  return (
    <View style={styles.container}>
      {title && (
        <ThemedView style={globalStyles.titleContainer}>
          {titleLongPressAction ? (
            <Pressable
              onLongPress={titleLongPressAction}
              style={{ padding: 8 }}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Settings"
              accessibilityHint="Press and hold to open settings"
            >
              <ThemedText type="title">{title}</ThemedText>
            </Pressable>
          ) : (
            <ThemedText type="title">{title}</ThemedText>
          )}
          {titleIcon && titleAction && (
            <PressableArea
              onPress={titleAction}
              style={{ padding: 8 }}
              accessible={true}
              accessibilityRole="button"
              // TODO: update when there is more than one button in the title
              accessibilityLabel="Settings"
              accessibilityHint="Press to open settings"
            >
              <TitleIcon width={24} height={24} color={textColor} />
            </PressableArea>
          )}
        </ThemedView>
      )}
      <ScrollingTabs
        tabs={blocks
          .filter((block) => block.items.length > 0 || block.showEmpty)
          .map((block) => ({
            title: block.title,
            items: block.items.length,
            color: block.color,
            content: <ColumnItems block={block} />,
          }))}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
});
