import { Text, type TextProps, StyleSheet, Platform } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'completed-title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({ style, lightColor, darkColor, type = 'default', children, ...rest }: ThemedTextProps) {
  const isTitle = type === 'title' || type === 'completed-title';
  // Android clips the swash of J and alike at the edge of the text even with padding,
  // a space in front gives it room, the margin of the title takes the space back
  const content = isTitle && Platform.OS === 'android' && typeof children === 'string' ? ` ${children}` : children;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const primaryColor = useThemeColor({}, 'primary');
  const touchableColor = useThemeColor({}, 'touchable');

  return (
    <Text
      style={[
        { color: type === 'title' ? primaryColor : color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'completed-title' ? [styles.title, { color: touchableColor }] : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        style,
      ]}
      numberOfLines={isTitle ? 1 : 0}
      adjustsFontSizeToFit={isTitle}
      {...rest}
    >
      {content}
    </Text>
  );
}

const styles = StyleSheet.create({
  default: {
    fontFamily: 'Montserrat',
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '500',
    textAlign: 'left',
    letterSpacing: -0.2,
  },
  defaultSemiBold: {
    fontFamily: 'Montserrat',
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
    textAlign: 'left',
  },
  title: {
    fontFamily: 'GreatVibes-Regular',
    fontSize: 46,
    marginVertical: Platform.OS === 'ios' ? 4 : -4,
    transformOrigin: 'top middle',
    transform: [{ rotate: '-1deg' }],
    zIndex: 1,
    // swashes like the one of J go left of the letter: room for them without moving the text
    ...Platform.select({
      ios: { paddingLeft: 16, marginLeft: -16 },
      default: { marginLeft: -10 },
    }),
  },
  subtitle: {
    fontFamily: 'Montserrat',
    fontSize: 18,
    fontWeight: 'bold',
  },
  link: {
    fontFamily: 'Montserrat',
    lineHeight: 30,
    fontSize: 16,
    color: '#0a7ea4',
  },
});
