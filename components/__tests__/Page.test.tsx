// FILE: components/Page.test.tsx

import React from 'react';
import { render } from '@testing-library/react-native';

import Page from '@/components/Page';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View } from 'react-native';

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: jest.fn(),
}));

describe('Page component', () => {
  it('matches snapshot', () => {
    (useSafeAreaInsets as jest.Mock).mockReturnValue({ top: 0 });

    const { toJSON } = render(
      <Page>
        <View />
      </Page>
    );

    expect(toJSON()).toMatchSnapshot();
  });

  it('renders correctly with top inset', () => {
    (useSafeAreaInsets as jest.Mock).mockReturnValue({ top: 10 });

    const { getByTestId } = render(
      <Page>
        <View testID="child-view" />
      </Page>
    );

    const childView = getByTestId('child-view');
    expect(childView).toBeTruthy();
  });

  it('applies the correct marginTop style based on top inset', () => {
    (useSafeAreaInsets as jest.Mock).mockReturnValue({ top: 20 });

    const { getByTestId } = render(
      <Page>
        <View testID="child-view" />
      </Page>
    );

    const pageView = getByTestId('child-view').parent.parent;
    expect(pageView.props.style).toMatchObject({ marginTop: 20, flex: 1 });
  });
});
