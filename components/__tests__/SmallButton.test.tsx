import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SmallButton from '../SmallButton';

describe('SmallButton', () => {
  it('renders correctly', async () => {
    const { getByText } = await render(
      <SmallButton title="Click me" onPress={() => {}} />
    );
    expect(getByText('Click me')).toBeTruthy();
  });

  it('calls onPress when pressed', async () => {
    const onPressMock = jest.fn();
    const { getByText } = await render(
      <SmallButton title="Click me" onPress={onPressMock} />
    );
    const button = getByText('Click me');

    await fireEvent.press(button);
    expect(onPressMock).toHaveBeenCalled();
  });

  it('matches snapshot', async () => {
    const { toJSON } = await render(
      <SmallButton title="Click me" onPress={() => {}} />
    );
    expect(toJSON()).toMatchSnapshot();
  });
});
