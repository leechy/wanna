import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import HeaderButton from '../HeaderButton';

describe('HeaderButton', () => {
  it('renders correctly', () => {
    const { getByText } = render(
      <HeaderButton title="Click me" onPress={() => {}} />
    );
    expect(getByText('Click me')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <HeaderButton title="Click me" onPress={onPressMock} />
    );
    const button = getByText('Click me');

    fireEvent.press(button);
    expect(onPressMock).toHaveBeenCalled();
  });

  it('matches snapshot', () => {
    const { toJSON } = render(
      <HeaderButton title="Click me" onPress={() => {}} />
    );
    expect(toJSON()).toMatchSnapshot();
  });
});
