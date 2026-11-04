// hooks
import { router, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColor } from '@/hooks/useThemeColor';

// components
import { Platform, StyleProp, View, ViewStyle } from 'react-native';
import HeaderButton from '@/components/HeaderButton';
import { BackLink } from '@/components/BackLink';
import { globalStyles } from '@/constants/GlobalStyles';
import { useInPopupCard } from '@/components/PopupFrame';

// types
import type { SFSymbol } from 'sf-symbols-typescript';

interface ModalHeaderProps {
  // the closing button, "Cancel" when there is something to submit, "Done" otherwise
  closeTitle?: string;
  submitTitle?: string;
  onSubmit?: () => void;
  // on iOS: the SF Symbol of the right button, a filled checkmark by default
  submitIcon?: SFSymbol;
  submitHint?: string;
  // where to close to when the modal is the only screen, e.g. restored on launch
  fallbackPath?: '/' | '/shopping';
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
  submitIcon,
  submitHint = 'Saves and closes',
  fallbackPath = '/',
  style,
}: ModalHeaderProps) {
  const { top: safeT } = useSafeAreaInsets();
  const backgroundColor = useThemeColor({}, 'background');
  const primaryColor = useThemeColor({}, 'primary');
  // a card on a wide screen has no system header, the buttons are drawn here
  const inCard = useInPopupCard();

  if (Platform.OS === 'ios' && !inCard) {
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
            accessibilityHint={closeTitle === 'Cancel' ? 'Closes without saving' : 'Closes this screen'}
          >
            {closeTitle}
          </Stack.Toolbar.Button>
        </Stack.Toolbar>
        {onSubmit && submitTitle && (
          <Stack.Toolbar placement="right">
            <Stack.Toolbar.Button
              icon={submitIcon ?? 'checkmark'}
              // saving is the main action, anything else is a plain button
              variant={submitIcon ? 'plain' : 'prominent'}
              tintColor={primaryColor}
              onPress={onSubmit}
              accessibilityLabel={submitTitle}
              accessibilityHint={submitHint}
            >
              {submitTitle}
            </Stack.Toolbar.Button>
          </Stack.Toolbar>
        )}
      </>
    );
  }

  return (
    <View style={[globalStyles.customHeader, { paddingTop: inCard ? 12 : safeT + 12 }, style]}>
      <BackLink parentTitle={closeTitle} fallbackPath={fallbackPath} />
      {onSubmit && submitTitle && <HeaderButton title={submitTitle} onPress={onSubmit} />}
    </View>
  );
}
