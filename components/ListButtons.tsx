// hooks
import { useThemeColor } from '@/hooks/useThemeColor';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import { useEffect } from 'react';

// components
import { Platform, StyleSheet, Text, View } from 'react-native';
import { PressableArea } from '@/components/PressableArea';
import { BlurView } from 'expo-blur';

// styles
import { globalStyles } from '@/constants/GlobalStyles';

// icons
import BagFillIcon from '@/assets/symbols/bag-fill.svg';
import PlusIcon from '@/assets/symbols/square-plus.svg';

interface ListButtonsProps {
  newItem: () => void;
  newItemTitle?: string;
  checkoutBasket?: () => void;
  cartItems?: number;
}

export default function ListButtons({ newItem, newItemTitle, checkoutBasket, cartItems }: ListButtonsProps) {
  const primaryColor = useThemeColor({}, 'primary');
  const cursorColor = useThemeColor({}, 'cursorColor');
  const inputBackgroundColor = useThemeColor({}, 'inputBackground');
  const inputBackgroundAndroid = useThemeColor({}, 'inputBackgroundAndroid');
  const smallButtonBackground = useThemeColor({}, 'smallButtonBackground');
  const touchableColor = useThemeColor({}, 'touchable');
  const inputPlaceholder = useThemeColor({}, 'inputPlaceholder');

  // Add these lines for the blinking animation
  const opacity = useSharedValue<number>(0);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.6, { duration: 500, easing: Easing.out(Easing.poly(5)) }),
      -1, // infinite repetitions
      true // true means the animation reverses on each iteration
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  function renderInputs() {
    return (
      <>
        <View style={globalStyles.listItemLeadButton}>
          <PlusIcon width={28} height={28} color={touchableColor} />
        </View>
        <Animated.View style={[styles.blinkingCursor, { backgroundColor: cursorColor }, animatedStyle]} />
        <View style={[globalStyles.itemListLabelContainer]}>
          <Text
            style={[globalStyles.itemListlabel, { color: inputPlaceholder }]}
            adjustsFontSizeToFit={true}
            numberOfLines={2}
          >
            {newItemTitle || 'I wanna...'}
          </Text>
        </View>
      </>
    );
  }

  return (
    <View style={styles.buttonsContainer}>
      <PressableArea
        style={styles.addButton}
        onPress={newItem}
        iOSOpacityPressed={0.6}
        rippleColor={inputBackgroundColor + '33'}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={'Add new item'}
        accessibilityHint={'Press to add a new item to the list.'}
      >
        {Platform.OS === 'ios' ? (
          <BlurView intensity={32} style={[styles.fakeInput, { backgroundColor: inputBackgroundColor }]}>
            {renderInputs()}
          </BlurView>
        ) : (
          <View style={[styles.fakeInput, { backgroundColor: inputBackgroundAndroid }]}>{renderInputs()}</View>
        )}
      </PressableArea>
      {checkoutBasket && (cartItems || 0) > 0 && (
        <PressableArea
          style={[
            styles.cartButton,
            {
              backgroundColor: smallButtonBackground,
              borderColor: primaryColor + '80',
            },
          ]}
          onPress={checkoutBasket}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={'Checkout'}
          accessibilityHint={'Press to move selected items to the completed list.'}
        >
          <BagFillIcon width={24} height={24} color={primaryColor} />
          <View style={styles.cartButtonLabel}>
            <Text style={[styles.cartButtonText, { color: primaryColor }]}>Checkout</Text>
            <Text style={[styles.cartButtonText, { color: primaryColor }]}>
              <Text style={{ fontWeight: '700', fontSize: 14 }}>{cartItems}</Text>{' '}
              {(cartItems || 0) > 1 ? 'items' : 'item'}
            </Text>
          </View>
        </PressableArea>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  buttonsContainer: {
    position: 'absolute',
    width: '100%',
    bottom: 16,
    right: 0,
    height: 48,

    display: 'flex',
    flexDirection: 'row',
    gap: 16,

    paddingHorizontal: 16,
  },
  fakeInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButton: {
    borderRadius: 8,
    overflow: 'hidden',
    flex: 1,
  },
  blinkingCursor: {
    width: 1.5,
    height: 24,
    backgroundColor: '#000',
    borderRadius: 4,
    opacity: 0.8,
  },
  cartButton: {
    display: 'flex',
    flexDirection: 'row',
    gap: 4,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  cartButtonLabel: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartButtonText: { fontSize: 12, lineHeight: 14 },
});
