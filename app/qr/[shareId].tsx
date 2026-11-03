// hooks
import { useLocalSearchParams } from 'expo-router';
import { useRef } from 'react';
import { useWindowDimensions } from 'react-native';

// components
import { Platform, StyleSheet, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { ThemedText } from '@/components/ThemedText';
import ModalHeader from '@/components/ModalHeader';

// utils
import * as Print from 'expo-print';
import { shareLink } from '@/utils/share';

// what getRef gives: the svg of the code
type QRCodeRef = { toDataURL: (callback: (base64: string) => void) => void };

// the app icon for the middle of the code
const AppLogo = require('@/assets/icon-512.png');

/**
 * The QR code of the list's share link, to scan with "Join list" on another phone
 */
export default function ListQrScreen() {
  const { shareId, name } = useLocalSearchParams<{ shareId: string; name?: string }>();
  const { width } = useWindowDimensions();
  const size = Math.min(width - 96, 320);
  // the rendered code, to print exactly what is on the screen
  const qrRef = useRef<QRCodeRef | null>(null);

  function print() {
    qrRef.current?.toDataURL((png: string) => {
      Print.printAsync({ html: printPage(name || 'Shared list', shareId, png) }).catch(() => {
        // closed without printing
      });
    });
  }

  return (
    <View style={{ flex: 1 }}>
      <ModalHeader
        closeTitle="Done"
        submitTitle="Print"
        submitIcon="printer"
        submitHint="Prints the code to hang on the fridge"
        onSubmit={print}
      />
      <View style={styles.container}>
        {/* the same handwritten title as on the list itself */}
        <ThemedText type="title" style={styles.centered}>
          {(name || 'Shared list') + ' '}
        </ThemedText>
        {/* always dark on white, cameras read it better than a themed one */}
        <View
          style={styles.code}
          accessible={true}
          accessibilityRole="image"
          accessibilityLabel={`QR code of the list ${name ?? ''}`}
          accessibilityHint="Another phone joins the list by scanning it"
        >
          {/* the highest error correction, so the code still reads with the logo over its middle */}
          <QRCode
            value={shareLink(shareId)}
            size={size}
            color="#000"
            backgroundColor="#fff"
            ecl="H"
            logo={AppLogo}
            logoSize={size * 0.22}
            logoBackgroundColor="#fff"
            logoMargin={4}
            getRef={(ref: QRCodeRef) => (qrRef.current = ref)}
          />
        </View>
        <ThemedText style={styles.centered}>
          On a phone open Wanna, tap “Join list” and point the camera here, or type the code
        </ThemedText>
        <ThemedText
          type="defaultSemiBold"
          style={styles.shareId}
          selectable={true}
          accessibilityLabel={`List code ${shareId.split('-').join(', ')}`}
          accessibilityHint="Type it on another phone in “Join list”"
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

function escapeHtml(text: string) {
  return text.replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`);
}

/**
 * A page to hang on the fridge: anyone at home scans it with the phone camera,
 * the link opens the app, or the web version when the app isn't there
 */
function printPage(name: string, shareId: string, png: string) {
  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <link href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Montserrat:wght@400;600&display=swap" rel="stylesheet" />
    <style>
      @page { margin: 15mm; }
      body { font-family: Montserrat, Helvetica, sans-serif; color: #222; text-align: center; margin: 0; }
      h1 { font-family: 'Great Vibes', cursive; font-weight: normal; font-size: 54pt; line-height: 1.2; color: #3a1fc1; margin: 0 0 4mm; transform: rotate(-1deg); }
      img { width: 100mm; height: 100mm; }
      p { font-size: 14pt; line-height: 1.4; margin: 4mm 0 0; }
      .code { font-family: Menlo, monospace; font-size: 20pt; letter-spacing: 2pt; font-weight: 600; margin-top: 3mm; }
    </style>
  </head>
  <body>
    <h1>${escapeHtml(name)}</h1>
    <img src="data:image/png;base64,${png}" />
    <p>Point the phone camera at the code to join the list</p>
    <p>or in Wanna Wanna tap “Join list” and type</p>
    <div class="code">${readableShareId(shareId).replace('\n', ' ')}</div>
  </body>
</html>`;
}
