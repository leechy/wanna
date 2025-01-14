// hooks
import { useState } from 'react';

// components
import { StyleSheet, View } from 'react-native';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import { AccordionBlock, AccordionBlockProps } from './AccordionBlock';
import { globalStyles } from '@/constants/GlobalStyles';
import { SvgProps } from 'react-native-svg';
import { useThemeColor } from '@/hooks/useThemeColor';
import { PressableArea } from './PressableArea';

interface AccordionProps {
  blocks: AccordionBlockProps[];
  title?: string;
  titleIcon?: React.FC<SvgProps>;
  titleAction?: () => void;
  openBlock?: number;
}

export function Accordion({ title, blocks, titleIcon, titleAction, openBlock = 0 }: AccordionProps) {
  const [prevBlock, setPrevBlock] = useState(Math.abs(openBlock - 1));
  const [currentBlock, setCurrentBlock] = useState(openBlock);
  const textColor = useThemeColor({}, 'text');

  const TitleIcon = titleIcon || (() => null);

  return (
    <View style={styles.container}>
      <ThemedView style={globalStyles.titleContainer}>
        <ThemedText type="title">{title}</ThemedText>
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
      {blocks.map((block, index) => (
        <AccordionBlock
          {...block}
          isOpen={currentBlock === index}
          key={'block' + index}
          onToggle={() => {
            if (currentBlock === index) {
              setCurrentBlock(prevBlock);
              setPrevBlock(index);
            } else {
              setPrevBlock(currentBlock);
              setCurrentBlock(index);
            }
          }}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
