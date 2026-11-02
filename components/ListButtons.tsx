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
  const secondaryColor = useThemeColor({}, 'secondary');
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

  // Add these for cart button animation
  const cartButtonWidth = useSharedValue(0);
  const cartButtonOpacity = useSharedValue(0);

  useEffect(() => {
    // When cart items exist, animate button in
    if (checkoutBasket && (cartItems || 0) > 0) {
      // Get the final button width (you may need to adjust this value)
      const finalWidth = 124;

      // Animate width and opacity
      cartButtonWidth.value = withTiming(finalWidth, {
        duration: 300,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
      cartButtonOpacity.value = withTiming(1, { duration: 250 });
    } else {
      // Animate out
      cartButtonWidth.value = withTiming(0, {
        duration: 250,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
      cartButtonOpacity.value = withTiming(0, { duration: 200 });
    }
  }, [checkoutBasket, cartItems, cartButtonWidth, cartButtonOpacity]);

  const cartButtonAnimatedStyle = useAnimatedStyle(() => {
    return {
      width: cartButtonWidth.value,
      opacity: cartButtonOpacity.value,
      overflow: 'hidden',
    };
  });

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

      {checkoutBasket && (
        <Animated.View style={cartButtonAnimatedStyle}>
          <PressableArea
            style={[
              styles.cartButton,
              {
                backgroundColor: smallButtonBackground,
                borderColor: secondaryColor + '80',
                justifyContent: 'flex-start',
              },
            ]}
            onPress={checkoutBasket}
            accessible={(cartItems || 0) > 0}
            accessibilityRole="button"
            accessibilityLabel={'Checkout'}
            accessibilityHint={'Press to move selected items to the completed list.'}
          >
            <View style={styles.cartButtonIcon}>
              <BagFillIcon width={24} height={24} color={secondaryColor} />
            </View>
            <View style={styles.cartButtonLabel}>
              <Text style={[styles.cartButtonText, { color: secondaryColor }]}>Checkout</Text>
              <Text style={[styles.cartButtonText, { color: secondaryColor }]}>
                <Text style={{ fontWeight: '700', fontSize: 14 }}>{cartItems}</Text>{' '}
                {(cartItems || 0) > 1 ? 'items' : 'item'}
              </Text>
            </View>
          </PressableArea>
        </Animated.View>
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
    height: 46,

    display: 'flex',
    flexDirection: 'row',
    // gap: 16,

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
    marginStart: 16,
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
  cartButtonIcon: {
    minWidth: 24,
    flex: 0,
  },
  cartButtonLabel: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartButtonText: { fontSize: 12, lineHeight: 14 },
});
