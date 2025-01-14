import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Text } from 'react-native';
import { PressableArea } from '../PressableArea';

jest.mock('@/hooks/useThemeColor', () => ({
  useThemeColor: () => '#0000FF',
}));

describe('PressableArea', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(
      <PressableArea onPress={() => {}} testID="pressable-area">
        <Text>Press me</Text>
      </PressableArea>
    );
    expect(getByTestId('pressable-area')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPressMock = jest.fn();
    const { getByTestId } = render(
      <PressableArea onPress={onPressMock} testID="pressable-area">
        <Text>Press me</Text>
      </PressableArea>
    );
    const pressableArea = getByTestId('pressable-area');

    fireEvent.press(pressableArea);
    expect(onPressMock).toHaveBeenCalled();
  });

  it('matches snapshot', () => {
    const { toJSON } = render(
      <PressableArea onPress={() => {}} testID="pressable-area">
        <Text>Press me</Text>
      </PressableArea>
    );
    expect(toJSON()).toMatchSnapshot();
  });
});
