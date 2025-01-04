import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SmallButton from '../SmallButton';

describe('SmallButton', () => {
  it('renders correctly', () => {
    const { getByText } = render(
      <SmallButton title="Click me" onPress={() => {}} />
    );
    expect(getByText('Click me')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <SmallButton title="Click me" onPress={onPressMock} />
    );
    const button = getByText('Click me');

    fireEvent.press(button);
    expect(onPressMock).toHaveBeenCalled();
  });

  it('matches snapshot', () => {
    const { toJSON } = render(
      <SmallButton title="Click me" onPress={() => {}} />
    );
    expect(toJSON()).toMatchSnapshot();
  });
});
