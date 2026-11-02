import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Text } from 'react-native';
import Checkbox from '../Checkbox';

jest.mock('../../assets/symbols/square.svg', () => 'SquareIcon');
jest.mock('../../assets/symbols/square-check.svg', () => 'SquareCheckIcon');

describe('Checkbox', () => {
  it('renders correctly', async () => {
    const { getByTestId } = await render(<Checkbox checked={false} onChange={() => {}} testID="checkbox" />);
    expect(getByTestId('checkbox')).toBeTruthy();
  });

  it('calls onChange when clicked', async () => {
    const onChangeMock = jest.fn();
    const { getByTestId } = await render(<Checkbox checked={false} onChange={onChangeMock} testID="checkbox" />);
    const checkbox = getByTestId('checkbox');

    // Initially unchecked

    // Click to change state
    await fireEvent.press(checkbox);
    expect(onChangeMock).toHaveBeenCalledWith(true);

    // Click again to change state
    await fireEvent.press(checkbox);
    expect(onChangeMock).toHaveBeenCalledWith(false);
  });

  it('renders label with additional elements', async () => {
    const { getByText } = await render(
      <Checkbox checked={false} onChange={() => {}} testID="checkbox">
        <Text>
          Label with{' '}
          <Text onPress={() => {}} testID="link">
            link
          </Text>
        </Text>
      </Checkbox>
    );

    // expect(queryByText('Label with')).toBeTruthy();
    expect(getByText('link')).toBeTruthy();
  });

  it('matches snapshot', async () => {
    const { toJSON } = await render(
      <Checkbox checked={false} onChange={() => {}} testID="checkbox">
        <Text>
          Label with{' '}
          <Text onPress={() => {}} testID="link">
            link
          </Text>
        </Text>
      </Checkbox>
    );
    expect(toJSON()).toMatchSnapshot();
  });
});
