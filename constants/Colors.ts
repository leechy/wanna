/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#333333',
    background: '#f2f2f2',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,

    tabBarBackground: '#ffffff',
    smallButtonBackground: '#ffffff',

    primary: '#3a1fc1',
    secondary: '#e73d01',
    barelyVisible: '#dddddd',
    disabled: '#bbbbbb',
    inactive: '#999999',
    touchable: '#666666',
    danger: '#d22105',

    listBackground: '#ffffff',
    listSeparator: '#d6d6d6',

    inputText: '#000000',
    inputPlaceholder: '#999999',
    inputBackground: '#5c5c5c33',
    inputBackgroundAndroid: '#d1d1d1ee',
    wheelPickerBackground: '#5c5c5c',
    cursorColor: '#3a1fc1',
    fullButtonText: '#000000',
    fullButtonBackground: '#FFD700',
  },
  dark: {
    text: '#cccccc',
    background: '#000000',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,

    tabBarBackground: '#1e2022',
    tabBarBackground2: '#151718',
    smallButtonBackground: '#1e2022',

    primary: '#ffd700',
    secondary: '#b87bf4',
    barelyVisible: '#222222',
    disabled: '#454545',
    inactive: '#666666',
    touchable: '#999999',
    danger: '#f53d2c',

    listBackground: '#151718',
    listSeparator: '#0a0a0a',

    inputText: '#ffffff',
    inputPlaceholder: '#666666',
    inputBackground: '#e6e6e633',
    inputBackgroundAndroid: '#313131ee',
    wheelPickerBackground: '#e6e6e6',
    cursorColor: '#ffd700',
    fullButtonText: '#efefef',
    fullButtonBackground: '#3A1FC1',
  },
};

export const fullButtonBackgrounds = {
  light: ['#ffd700', '#ffe800', '#ffd700'],
  dark: ['#3a1fc1', '#2b00ff', '#3a1fc1'],
};
