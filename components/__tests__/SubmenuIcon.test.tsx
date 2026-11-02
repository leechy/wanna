import React from 'react';
import { Platform } from 'react-native';
import { render } from '@testing-library/react-native';
import SubmenuIcon from '../SubmenuIcon';

jest.mock('../../assets/symbols/submenu-ios.svg', () => 'SubmenuIOS');
jest.mock('../../assets/symbols/submenu-android.svg', () => 'SubmenuAndroid');

describe('SubmenuIcon', () => {
  it('renders SubmenuIOS on iOS', async () => {
    jest.replaceProperty(Platform, 'OS', 'ios');

    const { queryByTestId } = await render(
      <SubmenuIcon width={28} height={28} color="black" />
    );

    expect(queryByTestId('SubmenuIOS')).toBeTruthy();
  });

  it('renders SubmenuAndroid on Android', async () => {
    jest.replaceProperty(Platform, 'OS', 'android');

    const { queryByTestId } = await render(
      <SubmenuIcon width={28} height={28} color="black" />
    );

    expect(queryByTestId('SubmenuAndroid')).toBeTruthy();
  });
});
