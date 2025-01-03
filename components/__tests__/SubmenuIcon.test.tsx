import React from 'react';
import { Platform } from 'react-native';
import { render } from '@testing-library/react-native';
import SubmenuIcon from '../SubmenuIcon';

jest.mock('../../assets/symbols/submenu-ios.svg', () => 'SubmenuIOS');
jest.mock('../../assets/symbols/submenu-android.svg', () => 'SubmenuAndroid');

jest.doMock('react-native/Libraries/Utilities/Platform.android.js', () => ({
  OS: 'android',
  select: jest.fn(),
}));

jest.doMock('react-native/Libraries/Utilities/Platform.ios.js', () => ({
  OS: 'android',
  select: jest.fn(),
}));

describe('SubmenuIcon', () => {
  it('renders SubmenuIOS on iOS', () => {
    Platform.OS = 'ios';

    const { queryByTestId } = render(
      <SubmenuIcon width={28} height={28} color="black" />
    );

    expect(queryByTestId('SubmenuIOS')).toBeTruthy();
  });

  it('renders SubmenuAndroid on Android', () => {
    Platform.OS = 'android';

    const { queryByTestId } = render(
      <SubmenuIcon width={28} height={28} color="black" />
    );

    expect(queryByTestId('SubmenuAndroid')).toBeTruthy();
  });
});
