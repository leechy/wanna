// hooks
import { useRef, useState } from 'react';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCameraPermissions } from 'expo-camera';
import { useThemeColor } from '@/hooks/useThemeColor';

// components
import { Linking, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { CameraView, type BarcodeScanningResult } from 'expo-camera';
import { ThemedText } from '@/components/ThemedText';
import { ThemedInput } from '@/components/ThemedInput';
import SmallButton from '@/components/SmallButton';
import { BackLink } from '@/components/BackLink';

// utils
import * as Clipboard from 'expo-clipboard';
import { parseShareId } from '@/utils/share';
import { trackEvent } from '@/utils/analytics';

// styles
import { globalStyles } from '@/constants/GlobalStyles';

/**
 * Joins a shared list by a pasted link or typed code, or by the QR code from another phone,
 * then goes the same way as an opened share link
 */
export default function JoinListScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [scanHint, setScanHint] = useState<string | null>(null);
  // the scanner reports the same code many times a second
  const joining = useRef(false);

  const { top: safeT } = useSafeAreaInsets();
  const secondaryColor = useThemeColor({}, 'secondary');
  const dangerColor = useThemeColor({}, 'danger');
  const inputBackground = useThemeColor({}, 'inputBackground');

  function join(shareId: string, method: 'qr' | 'link') {
    if (joining.current) return;
    joining.current = true;
    trackEvent('list.join_started', {}, { method });
    router.replace({ pathname: '/shared/[shareId]', params: { shareId } });
  }

  function onBarcodeScanned({ data }: BarcodeScanningResult) {
    const shareId = parseShareId(data);
    if (shareId) {
      join(shareId, 'qr');
    } else {
      setScanHint("This QR code isn't a Wanna list");
    }
  }

  function joinByLink() {
    const shareId = parseShareId(text);
    if (shareId) {
      join(shareId, 'link');
    } else {
      setError(text.trim() ? "This doesn't look like a link or a code of a list" : 'Paste the link or type the code first');
    }
  }

  async function paste() {
    const pasted = await Clipboard.getStringAsync();
    setText(pasted);
    setError(null);
  }

  function renderCamera() {
    if (!permission) {
      return null;
    }

    if (!permission.granted) {
      return (
        <View style={[styles.cameraPlaceholder, { backgroundColor: inputBackground }]}>
          <ThemedText style={styles.centered}>Scan the QR code from the phone the list is shared from</ThemedText>
          {permission.canAskAgain ? (
            <SmallButton title="Allow camera" onPress={requestPermission} color={secondaryColor} />
          ) : (
            <SmallButton title="Allow camera in Settings" onPress={() => Linking.openSettings()} color={secondaryColor} />
          )}
        </View>
      );
    }

    return (
      <View style={styles.camera}>
        <CameraView
          style={StyleSheet.absoluteFill}
          facing="back"
          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
          onBarcodeScanned={onBarcodeScanned}
          accessibilityLabel="QR code scanner"
          accessibilityHint="Point the camera at the QR code of the list on another phone"
        />
        <View style={styles.cameraCaption}>
          <ThemedText style={styles.cameraCaptionText} lightColor="#fff" darkColor="#fff">
            {scanHint ?? 'Point at the QR code on another phone'}
          </ThemedText>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={[globalStyles.customHeader, Platform.OS === 'android' ? { paddingTop: safeT + 12 } : {}]}>
        <BackLink noIcon={true} parentTitle="Cancel" />
      </View>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets={true}
      >
        <ThemedText type="subtitle">Join a shared list</ThemedText>

        <ThemedText type="defaultSemiBold">Paste the link or type the code</ThemedText>
        <ThemedInput
          placeholder="Link or code like abc-def-…"
          value={text}
          onChange={(value) => {
            setText(value);
            setError(null);
          }}
          onSubmit={joinByLink}
          autoFocus={false}
          containerStyle={styles.input}
        />
        {error && <ThemedText style={{ color: dangerColor }}>{error}</ThemedText>}
        <View style={styles.buttons}>
          <SmallButton title="Paste" onPress={paste} />
          <SmallButton title="Join" onPress={joinByLink} color={secondaryColor} />
        </View>

        <ThemedText type="defaultSemiBold" style={styles.orLabel}>
          or scan the QR code
        </ThemedText>
        {renderCamera()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 24,
    gap: 16,
  },
  camera: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#000',
    justifyContent: 'flex-end',
  },
  cameraCaption: {
    padding: 12,
    backgroundColor: '#00000066',
  },
  cameraCaptionText: {
    textAlign: 'center',
  },
  cameraPlaceholder: {
    width: '100%',
    aspectRatio: 1.4,
    borderRadius: 16,
    padding: 24,
    gap: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centered: {
    textAlign: 'center',
  },
  orLabel: {
    marginTop: 8,
  },
  input: {
    marginVertical: 0,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
});
