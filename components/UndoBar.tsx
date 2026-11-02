// hooks
import { useEffect } from 'react';
import { useThemeColor } from '@/hooks/useThemeColor';

// components
import { Pressable, StyleSheet, Text, View } from 'react-native';

const VISIBLE_MS = 4000;

interface UndoBarProps {
  message: string | null;
  onUndo: () => void;
  onHide: () => void;
  bottom?: number;
}

/**
 * Shows what was just done with a way back, hides itself after a few seconds
 */
export function UndoBar({ message, onUndo, onHide, bottom = 96 }: UndoBarProps) {
  const backgroundColor = useThemeColor({}, 'text');
  const textColor = useThemeColor({}, 'background');

  useEffect(() => {
    if (message) {
      const timer = setTimeout(onHide, VISIBLE_MS);
      return () => clearTimeout(timer);
    }
  }, [message, onHide]);

  if (!message) {
    return null;
  }

  return (
    <View style={[styles.bar, { backgroundColor, bottom }]} accessibilityLiveRegion="polite">
      <Text style={[styles.text, { color: textColor }]} numberOfLines={1}>
        {message}
      </Text>
      <Pressable
        onPress={() => {
          onUndo();
          onHide();
        }}
        accessibilityRole="button"
        accessibilityLabel="Undo"
        accessibilityHint="Brings the item back"
        hitSlop={12}
      >
        <Text style={[styles.undo, { color: textColor }]}>UNDO</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  text: {
    flex: 1,
    fontFamily: 'Montserrat_500Medium',
    fontSize: 15,
  },
  undo: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 15,
  },
});
