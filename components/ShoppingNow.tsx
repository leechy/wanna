import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';

/**
 * Tells who of the list members is in the store right now
 */
export function ShoppingNow({ names }: { names: string[] }) {
  const primaryColor = useThemeColor({}, 'primary');

  if (names.length === 0) {
    return null;
  }

  const who = names.length === 1 ? names[0] : `${names.slice(0, -1).join(', ')} and ${names.at(-1)}`;
  return (
    <ThemedText style={[styles.text, { color: primaryColor }]} accessibilityRole="text">
      {who} {names.length === 1 ? 'is' : 'are'} shopping now
    </ThemedText>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 14,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
});
