// hooks
import { useLocalSearchParams } from 'expo-router';
import { useWindowDimensions } from 'react-native';

// components
import { Platform, StyleSheet, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { ThemedText } from '@/components/ThemedText';
import ModalHeader from '@/components/ModalHeader';

// utils
import { shareLink } from '@/utils/share';

// styles

/**
 * The QR code of the list's share link, to scan with "Join shared list" on another phone
 */
export default function ListQrScreen() {
  const { shareId, name } = useLocalSearchParams<{ shareId: string; name?: string }>();
  const { width } = useWindowDimensions();
  const size = Math.min(width - 96, 320);

  return (
    <View style={{ flex: 1 }}>
      <ModalHeader closeTitle="Done" />
      <View style={styles.container}>
        <ThemedText type="subtitle" style={styles.centered}>
          {name || 'Shared list'}
        </ThemedText>
        {/* always dark on white, cameras read it better than a themed one */}
        <View
          style={styles.code}
          accessible={true}
          accessibilityRole="image"
          accessibilityLabel={`QR code of the list ${name ?? ''}`}
          accessibilityHint="Another phone joins the list by scanning it"
        >
          <QRCode value={shareLink(shareId)} size={size} color="#000" backgroundColor="#fff" ecl="M" />
        </View>
        <ThemedText style={styles.centered}>
          On another phone open Wanna, tap “Join shared list” and point the camera here, or type the code
        </ThemedText>
        <ThemedText
          type="defaultSemiBold"
          style={styles.shareId}
          selectable={true}
          accessibilityLabel={`List code ${shareId.split('-').join(', ')}`}
          accessibilityHint="Type it on another phone in “Join shared list”"
        >
          {readableShareId(shareId)}
        </ThemedText>
      </View>
    </View>
  );
}

/**
 * Groups of three letters with spaces, easier to read out and to type than dashes,
 * on two even lines instead of a random wrap
 */
function readableShareId(shareId: string) {
  const groups = shareId.split('-');
  const half = Math.ceil(groups.length / 2);
  return `${groups.slice(0, half).join(' ')}\n${groups.slice(half).join(' ')}`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 24,
  },
  code: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#fff',
  },
  centered: {
    textAlign: 'center',
  },
  shareId: {
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: 2,
    textAlign: 'center',
    fontFamily: Platform.select({ ios: 'Menlo', default: 'monospace' }),
  },
});
