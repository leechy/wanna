import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Text } from 'react-native';
import Checkbox from '../Checkbox';

jest.mock('../../assets/symbols/square.svg', () => 'SquareIcon');
jest.mock('../../assets/symbols/square-check.svg', () => 'SquareCheckIcon');

describe('Checkbox', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(
      <Checkbox checked={false} onChange={() => {}} testID="checkbox" />
    );
    expect(getByTestId('checkbox')).toBeTruthy();
  });

  it('calls onChange when clicked', () => {
    const onChangeMock = jest.fn();
    const { getByTestId } = render(
      <Checkbox checked={false} onChange={onChangeMock} testID="checkbox" />
    );
    const checkbox = getByTestId('checkbox');

    // Initially unchecked

    // Click to change state
    fireEvent.press(checkbox);
    expect(onChangeMock).toHaveBeenCalledWith(true);

    // Click again to change state
    fireEvent.press(checkbox);
    expect(onChangeMock).toHaveBeenCalledWith(false);
  });

  it('renders label with additional elements', () => {
    const { getByText, queryByText } = render(
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

  it('matches snapshot', () => {
    const { toJSON } = render(
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
