// hooks
import { useRef, useState } from 'react';
import { useThemeColor } from '@/hooks/useThemeColor';
import { humanDate } from '@/utils/dates';

// components
import { Modal, Platform, StyleSheet, Text, TouchableWithoutFeedback, useWindowDimensions, View } from 'react-native';
import SmallButton from './SmallButton';
import DateTimePicker from '@react-native-community/datetimepicker';

// icons
import CalendarIcon from '@/assets/symbols/square-calendar.svg';
import CloseIcon from '@/assets/symbols/x.svg';

// styles
import { globalStyles } from '@/constants/GlobalStyles';

interface DateSelectorProps {
  placeholder: string;
  value?: number; // Unix timestamp
  initialOffset?: number; // days from now — date selector will have this date, when activated
  onChange: (value: number | undefined) => void;
}

export default function DateSelector({ placeholder, value, initialOffset = 2, onChange }: DateSelectorProps) {
  const [active, setActive] = useState<boolean>(value !== undefined);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const touchColor = useThemeColor({}, 'touchable');
  const primaryColor = useThemeColor({}, 'primary');
  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'listBackground');

  const [date, setDate] = useState(new Date(value || Date.now() + (initialOffset || 0) * 1000 * 60 * 60 * 24));

  const width: number = 364;
  const height: number = 324;
  const triggerRef = useRef<View>(null);
  const { height: winH, width: winW } = useWindowDimensions();

  function activate() {
    console.log('activate', active, isOpen);
    if (!active) {
      setActive(true);
      onChange(date.getTime());
    }
    setIsOpen(true);
  }

  function onOverlayPress() {
    setIsOpen(false);
  }

  function deactivate() {
    if (active) {
      setActive(false);
      onChange(undefined);
    }
  }

  function onDateChange(_: any, selectedDate?: Date) {
    setIsOpen(false);

    if (selectedDate && date.getTime() !== selectedDate.getTime()) {
      setDate(selectedDate);
      onChange(date.getTime());
    }
  }

  return (
    <View ref={triggerRef}>
      <SmallButton title={active ? undefined : placeholder} onPress={activate} icon={CalendarIcon}>
        {active && (
          <>
            <Text style={{ color: textColor }}>{humanDate(date.getTime())}</Text>
            <CloseIcon width={24} height={24} color={touchColor} onPressOut={deactivate} style={styles.x} />
          </>
        )}
      </SmallButton>
      {isOpen &&
        (Platform.OS === 'ios' ? (
          <Modal transparent={true} visible={isOpen} animationType="fade" onRequestClose={onOverlayPress}>
            <TouchableWithoutFeedback
              onPress={onOverlayPress}
              accessibilityRole="button"
              accessibilityLabel="Close date picker"
              accessibilityHint="Press to close the date picker"
            >
              <View style={[globalStyles.modalOverlay]}>
                <View
                  style={[
                    globalStyles.menuContainer,
                    {
                      top: (winH - height) / 2,
                      left: (winW - width) / 2,
                      width,
                      height,
                      shadowColor: textColor,
                      backgroundColor,
                      paddingHorizontal: 12,
                    },
                  ]}
                >
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode="date"
                    display="inline"
                    onChange={onDateChange}
                    accentColor={primaryColor}
                    key={date.toISOString()}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        ) : (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode="date"
            display="compact"
            onChange={onDateChange}
            onTouchCancel={onOverlayPress}
            accentColor={primaryColor}
          />
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
  x: {
    marginRight: -8,
    marginLeft: 4,
  },
});
