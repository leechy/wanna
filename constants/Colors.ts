/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,

    inputText: '#000000',
    inputPlaceholder: '#999999',
    inputBackground: '#e3e3e4',
    cursorColor: '#3a1fc1',
    fullButtonText: '#000000',
    fullButtonBackground: '#FFD700',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,

    inputText: '#ffffff',
    inputPlaceholder: '#999999',
    inputBackground: '#3e3e3e',
    cursorColor: '#ffffff',
    fullButtonText: '#efefef',
    fullButtonBackground: '#3A1FC1',
  },
};

export const fullButtonBackgrounds = {
  light: ['#FFD700', '#FFE800', '#FFD700'],
  dark: ['#3A1FC1', '#3A1FC1'],
};
