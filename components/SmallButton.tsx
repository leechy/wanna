// hooks
import { useThemeColor } from '@/hooks/useThemeColor';

// components
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { PressableArea } from './PressableArea';

// types
import { ReactNode } from 'react';
import { SvgProps } from 'react-native-svg';

export type SmallButtonProps = {
  style?: ViewStyle;
  title?: string;
  icon?: React.FC<SvgProps>;
  onPress?: () => void;
  color?: string;
  disabled?: boolean;
  children?: ReactNode;
};

export default function SmallButton({ title, icon, style, onPress, color, disabled, children }: SmallButtonProps) {
  const smallButtonText = useThemeColor({}, 'touchable');
  const smallButtonBackground = useThemeColor({}, 'smallButtonBackground');

  const Icon = icon || (() => <></>);

  function getContents() {
    return (
      <>
        <Icon width={24} height={24} color={color || smallButtonText} style={styles.icon} />
        {title ? (
          <Text
            style={[
              {
                color: color || smallButtonText,
              },
              styles.text,
            ]}
          >
            {title}
          </Text>
        ) : (
          children
        )}
      </>
    );
  }

  return (
    <View
      style={[
        styles.container,
        style,
        { backgroundColor: smallButtonBackground, borderColor: color ? color + '80' : smallButtonText + '55' },
        disabled && { opacity: 0.4 },
      ]}
    >
      {onPress && !disabled ? (
        <PressableArea
          style={styles.button}
          onPress={onPress}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={title || 'Button'}
          accessibilityHint={`Press to activate`}
        >
          {getContents()}
        </PressableArea>
      ) : (
        <View style={styles.button}>{getContents()}</View>
      )}
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
    minHeight: 24,

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
