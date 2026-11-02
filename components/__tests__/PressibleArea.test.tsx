import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Text } from 'react-native';
import { PressableArea } from '../PressableArea';

jest.mock('@/hooks/useThemeColor', () => ({
  useThemeColor: () => '#0000FF',
}));

describe('PressableArea', () => {
  it('renders correctly', async () => {
    const { getByTestId } = await render(
      <PressableArea
        onPress={() => {}}
        testID="pressable-area"
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Press me"
        accessibilityHint="Press me"
      >
        <Text>Press me</Text>
      </PressableArea>
    );
    expect(getByTestId('pressable-area')).toBeTruthy();
  });

  it('calls onPress when pressed', async () => {
    const onPressMock = jest.fn();
    const { getByTestId } = await render(
      <PressableArea
        onPress={onPressMock}
        testID="pressable-area"
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Press me"
        accessibilityHint="Press me"
      >
        <Text>Press me</Text>
      </PressableArea>
    );
    const pressableArea = getByTestId('pressable-area');

    await fireEvent.press(pressableArea);
    expect(onPressMock).toHaveBeenCalled();
  });

  it('matches snapshot', async () => {
    const { toJSON } = await render(
      <PressableArea
        onPress={() => {}}
        testID="pressable-area"
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Press me"
        accessibilityHint="Press me"
      >
        <Text>Press me</Text>
      </PressableArea>
    );
    expect(toJSON()).toMatchSnapshot();
  });
});
