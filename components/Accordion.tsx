// hooks
import { useState } from 'react';

// components
import { StyleSheet, View } from 'react-native';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import { AccordionBlock, AccordionBlockProps } from './AccordionBlock';

interface AccordionProps {
  blocks: AccordionBlockProps[];
  title?: string;
}

export function Accordion({ title, blocks }: AccordionProps) {
  const [currentBlock, setCurrentBlock] = useState(0);

  return (
    <View style={styles.container}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">{title} </ThemedText>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 48, // height of the toolbar!
  },
  titleContainer: {
    paddingHorizontal: 16,
  },
});