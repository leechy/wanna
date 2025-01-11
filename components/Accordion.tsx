// hooks
import { useState } from 'react';

// components
import { StyleSheet, View } from 'react-native';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import { AccordionBlock, AccordionBlockProps } from './AccordionBlock';
import { globalStyles } from '@/constants/GlobalStyles';

interface AccordionProps {
  blocks: AccordionBlockProps[];
  title?: string;
  openBlock?: number;
}

export function Accordion({ title, blocks, openBlock = 0 }: AccordionProps) {
  const [prevBlock, setPrevBlock] = useState(Math.abs(openBlock - 1));
  const [currentBlock, setCurrentBlock] = useState(openBlock);

  return (
    <View style={styles.container}>
      <ThemedView style={globalStyles.titleContainer}>
        <ThemedText type="title">{title} </ThemedText>
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
