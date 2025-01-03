import { useThemeColor } from '@/hooks/useThemeColor';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from 'react-native';
import { SvgProps } from 'react-native-svg';

export type SmallButtonProps = {
  style?: ViewStyle;
  title: String;
  icon?: React.FC<SvgProps>;
  onPress?: () => void;
};

export default function SmallButton({
  title,
  icon,
  style,
  onPress,
}: SmallButtonProps) {
  const primaryColor = useThemeColor({}, 'primary');
  const smallButtonText = useThemeColor({}, 'touchable');
  const smallButtonBackground = useThemeColor({}, 'smallButtonBackground');
  const inactiveColor = useThemeColor({}, 'inactive');

  const Icon = icon || (() => <></>);

  return (
    <View
      style={[
        styles.container,
        style,
        { backgroundColor: smallButtonBackground, borderColor: inactiveColor },
      ]}
    >
      <Pressable
        android_ripple={{
          color: primaryColor + '33',
          borderless: false,
        }}
        style={({ pressed }) => [
          styles.button,
          Platform.select({
            ios: {
              opacity: pressed ? 0.4 : 1,
              backgroundColor: pressed ? '#ffffff' : 'transparent',
            },
          }),
        ]}
        onPress={onPress}
      >
        <Icon
          width={24}
          height={24}
          color={smallButtonText}
          style={styles.icon}
        />
        <Text
          style={[
            {
              color: smallButtonText,
            },
            styles.text,
          ]}
        >
          {title}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
  },
  background: {
    borderRadius: 8,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',

    borderRadius: 8,
    paddingTop: 1,
    paddingHorizontal: 12,
  },
  icon: {
    marginRight: 4,
    marginLeft: -8,
    marginBottom: 2,
  },
  text: {
    fontFamily: 'Montserrat',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 16,
    textAlign: 'center',
  },
});
