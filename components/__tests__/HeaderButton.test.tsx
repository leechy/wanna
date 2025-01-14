import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import HeaderButton from '../HeaderButton';
import { Platform } from 'react-native';

describe('HeaderButton', () => {
  it('renders correctly', () => {
    const { getByText } = render(<HeaderButton title="Click me" onPress={() => {}} />);
    expect(getByText('Click me')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(<HeaderButton title="Click me" onPress={onPressMock} />);
    const button = getByText('Click me');

    fireEvent.press(button);
    expect(onPressMock).toHaveBeenCalled();
  });

  it('matches snapshot', () => {
    const { toJSON } = render(<HeaderButton title="Click me" onPress={() => {}} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('applies the correct font size for iOS', () => {
    Platform.OS = 'ios';
    const { getByText } = render(<HeaderButton title="Test Button" onPress={() => {}} />);
    const button = getByText('Test Button');
    expect(button.props.style).toHaveProperty('[1].fontSize', 16);
  });

  it('applies the correct font size for Android', () => {
    Platform.OS = 'android';
    const { getByText } = render(<HeaderButton title="Test Button" onPress={() => {}} />);
    const button = getByText('Test Button');
    expect(button.props.style).toHaveProperty('[1].fontSize', 18);
  });
});
