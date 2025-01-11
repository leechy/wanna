/**
 * DropdownMenu component
 * based on https://medium.com/@mindelias/building-a-custom-dropdown-menu-in-react-native-a-step-by-step-guide-939b5f16627b
 */
import { TAB_BAR_HEIGHT } from '@/app/(tabs)/_layout';
import { DropdownItem } from '@/types/DropdownItem';
import React, { useRef, useEffect, useState, ReactNode } from 'react';
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PressableArea } from './PressableArea';
import { useThemeColor } from '@/hooks/useThemeColor';
import * as NavigationBar from 'expo-navigation-bar';

interface DropdownMenuProps {
  open?: boolean;
  items: DropdownItem[];
  side?: 'top' | 'right' | 'bottom' | 'right';
  align?: 'start' | 'center' | 'end';
  onOpen?: () => void;
  onClose?: () => void;
  width?: number;
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
}: DropdownMenuProps) {
  const triggerRef = useRef<View>(null);
  const { height: winH, width: winW, scale } = useWindowDimensions();
  const { top: safeT, right: safeR, bottom: safeB, left: safeL } = useSafeAreaInsets();
  const [position, setPosition] = useState({ x: 0, y: 0, width });
  const [isOpen, setIsOpen] = useState(open);

  const backgroundColor = useThemeColor({}, 'smallButtonBackground');
  const textColor = useThemeColor({}, 'text');
  const inactiveColor = useThemeColor({}, 'inactive');
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
  }, [colorScheme, isOpen]);

  function calculatePosition() {
    if (triggerRef.current) {
      triggerRef.current.measure((fx, fy, buttonW, buttonH, px, py) => {
        let { x, y } = position;
        let height = items.length * 40 + 3;

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
      <PressableArea onPress={onTriggerPress}>
        <View ref={triggerRef}>{children}</View>
      </PressableArea>
      {isOpen && (
        <Modal transparent={true} visible={isOpen} animationType="fade" onRequestClose={onOverlayPress}>
          <TouchableWithoutFeedback onPress={onOverlayPress}>
            <View style={[styles.modalOverlay]}>
              <View
                style={[
                  styles.menuContainer,
                  {
                    top: position.y,
                    left: position.x,
                    width: width,
                    shadowColor: textColor,
                  },
                ]}
              >
                <View style={[styles.menu, { width: width, backgroundColor }]}>
                  {items.map((item, index) => {
                    if (!item.onPress) {
                      return (
                        <View style={[styles.menuHeader, { backgroundColor: barelyVisibleColor }]} key={index}>
                          <Text style={[styles.menuHeaderLabel, { color: textColor }]}>{item.label}</Text>
                        </View>
                      );
                    }
                    return (
                      <PressableArea key={index} onPress={() => onItemPress(item)}>
                        <View
                          style={[
                            styles.menuOption,
                            index < items.length - 1
                              ? { ...styles.menuOptionBorder, borderColor: barelyVisibleColor }
                              : {},
                          ]}
                        >
                          {item.icon && <item.icon width={24} height={24} color={item.color || textColor} />}
                          <Text
                            style={[styles.menuLabel, { color: item.color || textColor }]}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                          >
                            {item.label}
                          </Text>
                        </View>
                      </PressableArea>
                    );
                  })}
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: Platform.OS === 'ios' ? '#00000033' : '#00000001',
  },
  menuContainer: {
    position: 'absolute',
    borderRadius: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  menu: {
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
  },
  menuOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
    paddingHorizontal: 8,
    minHeight: 40,
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
