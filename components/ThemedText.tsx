import { Text, type TextProps, StyleSheet } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'completed-title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({ style, lightColor, darkColor, type = 'default', ...rest }: ThemedTextProps) {
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
      numberOfLines={type === 'title' || type === 'completed-title' ? 1 : 0}
      adjustsFontSizeToFit={type === 'title' || type === 'completed-title'}
      {...rest}
    />
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
    fontSize: 60,
    // lineHeight: 76,
    transformOrigin: 'top middle',
    transform: [{ rotate: '-1deg' }],
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
