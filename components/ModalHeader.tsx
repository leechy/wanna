// hooks
import { router, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColor } from '@/hooks/useThemeColor';

// components
import { Platform, StyleProp, View, ViewStyle } from 'react-native';
import HeaderButton from '@/components/HeaderButton';
import { BackLink } from '@/components/BackLink';
import { globalStyles } from '@/constants/GlobalStyles';

interface ModalHeaderProps {
  // the closing button, "Cancel" when there is something to submit, "Done" otherwise
  closeTitle?: string;
  submitTitle?: string;
  onSubmit?: () => void;
  // where to close to when the modal is the only screen, e.g. restored on launch
  fallbackPath?: '/' | '/wishes' | '/shopping' | '/projects';
  style?: StyleProp<ViewStyle>;
}

function close(fallbackPath: ModalHeaderProps['fallbackPath']) {
  if (router.canGoBack()) {
    router.back();
  } else if (router.canDismiss()) {
    router.dismiss();
  } else {
    router.replace(fallbackPath ?? '/');
  }
}

/**
 * The header of a modal: system glass buttons on iOS 26,
 * "← Cancel" and a text button on Android.
 * The screen of the modal needs `headerShown` on iOS, see ModalOptions
 */
export default function ModalHeader({
  closeTitle = 'Cancel',
  submitTitle,
  onSubmit,
  fallbackPath = '/',
  style,
}: ModalHeaderProps) {
  const { top: safeT } = useSafeAreaInsets();
  const backgroundColor = useThemeColor({}, 'background');
  const primaryColor = useThemeColor({}, 'primary');

  if (Platform.OS === 'ios') {
    return (
      <>
        <Stack.Screen
          options={{
            headerTitle: '',
            headerTransparent: false,
            headerShadowVisible: false,
            headerStyle: { backgroundColor },
            headerTintColor: primaryColor,
          }}
        />
        <Stack.Toolbar placement="left">
          <Stack.Toolbar.Button
            icon="xmark"
            onPress={() => close(fallbackPath)}
            accessibilityLabel={closeTitle}
            accessibilityHint={onSubmit ? 'Closes without saving' : 'Closes this screen'}
          >
            {closeTitle}
          </Stack.Toolbar.Button>
        </Stack.Toolbar>
        {onSubmit && submitTitle && (
          <Stack.Toolbar placement="right">
            <Stack.Toolbar.Button
              icon="checkmark"
              variant="prominent"
              tintColor={primaryColor}
              onPress={onSubmit}
              accessibilityLabel={submitTitle}
              accessibilityHint="Saves and closes"
            >
              {submitTitle}
            </Stack.Toolbar.Button>
          </Stack.Toolbar>
        )}
      </>
    );
  }

  return (
    <View style={[globalStyles.customHeader, { paddingTop: safeT + 12 }, style]}>
      <BackLink parentTitle={closeTitle} fallbackPath={fallbackPath} />
      {onSubmit && submitTitle && <HeaderButton title={submitTitle} onPress={onSubmit} />}
    </View>
  );
}
