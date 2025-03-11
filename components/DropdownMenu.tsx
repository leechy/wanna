/**
 * DropdownMenu component
 * based on https://medium.com/@mindelias/building-a-custom-dropdown-menu-in-react-native-a-step-by-step-guide-939b5f16627b
 */
// hooks
import React, { useRef, useEffect, useState, ReactNode } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColor } from '@/hooks/useThemeColor';

// components
import {
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  useColorScheme,
  useWindowDimensions,
  View,
} from 'react-native';
import { PressableArea } from './PressableArea';
import * as NavigationBar from 'expo-navigation-bar';
import CheckIcon from '@/assets/symbols/check.svg';

// types and constants
import { TAB_BAR_HEIGHT } from '@/app/(tabs)/_layout';
import { DropdownItem } from '@/types/DropdownItem';
import { globalStyles } from '@/constants/GlobalStyles';
import { extractText } from '@/utils/text';

interface DropdownMenuProps {
  open?: boolean;
  items: DropdownItem[];
  side?: 'top' | 'right' | 'bottom' | 'right';
  align?: 'start' | 'center' | 'end';
  onOpen?: () => void;
  onClose?: () => void;
  width?: number;
  isHeaderMenu?: boolean;
  children: ReactNode;
}

export function DropdownMenu({
  open = false,
  items,
  side = 'bottom',
  align = 'end',
  onOpen,
  onClose,
  children,
  width = 200,
  isHeaderMenu = false,
}: DropdownMenuProps) {
  const triggerRef = useRef<View>(null);
  const { height: winH, width: winW } = useWindowDimensions();
  const { top: safeT, right: safeR, bottom: safeB, left: safeL } = useSafeAreaInsets();
  const [position, setPosition] = useState({ x: 0, y: 0, width });
  const [isOpen, setIsOpen] = useState(open);

  const backgroundColor = useThemeColor({}, 'smallButtonBackground');
  const textColor = useThemeColor({}, 'text');
  const disabledColor = useThemeColor({}, 'disabled');
  const touchableColor = useThemeColor({}, 'touchable');
  const barelyVisibleColor = useThemeColor({}, 'barelyVisible');
  const tabBarBackground = useThemeColor({}, 'tabBarBackground');

  const colorScheme = useColorScheme();

  // set the color for the navigation bar
  useEffect(() => {
    if (Platform.OS === 'android' && colorScheme) {
      setTimeout(() => {
        NavigationBar.setBackgroundColorAsync(tabBarBackground);
        NavigationBar.setButtonStyleAsync(colorScheme === 'dark' ? 'light' : 'dark');
      }, 80);
    }
  }, [colorScheme, isOpen, tabBarBackground]);

  function calculatePosition() {
    if (isHeaderMenu) {
      const topFix = Platform.OS === 'ios' ? 32 : 0;
      setPosition({ x: winW - width - 12, y: safeT + topFix, width });
      setIsOpen(true);
    } else if (triggerRef.current) {
      triggerRef.current.measure((fx, fy, buttonW, buttonH, px, py) => {
        let { x, y } = position;
        let height = items.length * 46 + 3;

        const topFix = Platform.OS === 'android' ? safeT : 0;

        if (side === 'bottom' || side === 'top') {
          if (side === 'bottom' && py + buttonH + height < winH - safeB - TAB_BAR_HEIGHT) {
            // is there space below the button?
            y = py - topFix + buttonH + 5;
          } else if (py - height > topFix) {
            // if not, is there space above the button?
            y = py - height - topFix - 3;
          } else {
            // if no space above or below, default to below
            y = py - topFix + buttonH + 5;
          }

          if (align === 'start') {
            x = Math.max(safeL, px);
          } else if (align === 'center') {
            x = px + buttonW / 2 - width / 2;
          } else if (align === 'end') {
            x = Math.max(safeL, px + buttonW - width);
          }
        } else {
          if (side === 'right' && px + buttonW + width < winW - safeR) {
            // is there space to the right of the button?
            x = px + buttonW + 3;
          } else if (px - width > safeL) {
            // if not, is there space to the left of the button?
            x = px - width - 3;
          } else {
            // if no space to the left or right, default to right
            x = px + buttonW + 3;
          }

          if (align === 'start') {
            y = Math.max(safeT, py);
          } else if (align === 'center') {
            y = py + buttonH / 2 - height / 2;
          } else if (align === 'end') {
            y = Math.max(safeT, py + buttonH - height);
          }
        }

        setPosition({ x, y, width });
        setIsOpen(true);
      });
    }
  }

  useEffect(() => {
    if (open) {
      calculatePosition();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function onTriggerPress() {
    setIsOpen(true);
    calculatePosition();
    onOpen?.();
  }

  function onOverlayPress() {
    setIsOpen(false);
    onClose?.();
  }

  function onItemPress(item: DropdownItem) {
    item.onPress?.(item);
    setIsOpen(false);
    onClose?.();
  }

  return (
    <View>
      <PressableArea
        onPress={onTriggerPress}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={`Open menu ${extractText(children)}`}
        accessibilityHint="Press to open the menu"
      >
        <View ref={triggerRef}>{children}</View>
      </PressableArea>
      <Modal transparent={true} visible={isOpen} animationType="fade" onRequestClose={onOverlayPress}>
        <TouchableWithoutFeedback
          onPress={onOverlayPress}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Close the menu"
          accessibilityHint="Press to close the menu"
        >
          <View style={[globalStyles.modalOverlay]}>
            <View
              style={[
                globalStyles.menuContainer,
                {
                  top: position.y,
                  left: position.x,
                  width: width,
                  shadowColor: textColor,
                },
              ]}
            >
              <View style={[globalStyles.menu, { width: width, backgroundColor }]}>
                {items.map((item, index) => {
                  if (!item.onPress) {
                    return (
                      <View style={[styles.menuHeader, { backgroundColor: barelyVisibleColor }]} key={index}>
                        <Text style={[styles.menuHeaderLabel, { color: touchableColor }]}>{item.label}</Text>
                      </View>
                    );
                  }
                  if (item.disabled) {
                    return (
                      <View
                        key={index}
                        style={[
                          styles.menuOption,
                          index < items.length - 1
                            ? { ...styles.menuOptionBorder, borderColor: barelyVisibleColor }
                            : {},
                        ]}
                      >
                        <Text
                          style={[styles.menuLabel, { color: disabledColor }]}
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        >
                          {item.label}
                        </Text>
                        {item.selected ? (
                          <CheckIcon width={24} height={24} color={disabledColor} />
                        ) : (
                          item.icon && <item.icon width={24} height={24} color={disabledColor} />
                        )}
                      </View>
                    );
                  }
                  return (
                    <PressableArea
                      key={index}
                      onPress={() => onItemPress(item)}
                      accessible={true}
                      accessibilityRole="button"
                      accessibilityLabel={item.label}
                      accessibilityHint={`Press to ${item.label}`}
                    >
                      <View
                        style={[
                          styles.menuOption,
                          index < items.length - 1
                            ? { ...styles.menuOptionBorder, borderColor: barelyVisibleColor }
                            : {},
                        ]}
                      >
                        <Text
                          style={[styles.menuLabel, { color: item.color || textColor }]}
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        >
                          {item.label}
                        </Text>
                        {item.selected ? (
                          <CheckIcon width={24} height={24} color={item.color || touchableColor} />
                        ) : (
                          item.icon && <item.icon width={24} height={24} color={item.color || textColor} />
                        )}
                      </View>
                    </PressableArea>
                  );
                })}
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  menuOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 2,
    paddingHorizontal: 8,
    minHeight: 46,
  },
  menuOptionBorder: {
    borderBottomWidth: 1,
  },
  menuHeader: {
    paddingTop: 6,
    paddingBottom: 4,
    paddingHorizontal: 8,
  },
  menuHeaderLabel: {
    fontFamily: 'Montserrat',
    fontSize: 14,
  },
  menuLabel: {
    fontFamily: 'Montserrat',
    fontSize: 16,
    marginLeft: 8,
    overflow: 'hidden',
    width: '80%',
  },
});
