import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { CollapsibleHeader } from '../CollapsibleHeader';

jest.mock('../../assets/symbols/chevron-right.svg', () => 'ChevronRightIcon');
jest.mock('../../assets/symbols/chevron-down.svg', () => 'ChevronDownIcon');

jest.mock('@/hooks/useThemeColor', () => ({
  useThemeColor: () => '#0000FF',
}));

describe('CollapsibleHeader', () => {
  it('renders title correctly', async () => {
    const { getByText } = await render(<CollapsibleHeader title="Test Title" isOpen={false} onToggle={() => {}} />);
    expect(getByText('Test Title')).toBeTruthy();
  });

  it('renders with correct color', async () => {
    const { getByText } = await render(
      <CollapsibleHeader title="Test Title" color="#FF0000" isOpen={false} onToggle={() => {}} />
    );
    const title = getByText('Test Title');
    expect(title.props.style).toContainEqual({ color: '#FF0000' });
  });

  it('is clickable when clickable is true', async () => {
    const onToggleMock = jest.fn();
    const { getByTestId } = await render(
      <CollapsibleHeader
        title="Test Title"
        isOpen={false}
        clickable={true}
        onToggle={onToggleMock}
        testID="collapsible-header"
      />
    );
    const header = getByTestId('collapsible-header');
    await fireEvent.press(header);
    expect(onToggleMock).toHaveBeenCalled();
  });

  it('is not clickable when clickable is false', async () => {
    const onToggleMock = jest.fn();
    const { getByTestId } = await render(
      <CollapsibleHeader
        title="Test Title"
        isOpen={false}
        clickable={false}
        onToggle={onToggleMock}
        testID="collapsible-header"
      />
    );
    const header = getByTestId('collapsible-header');
    await fireEvent.press(header);
    expect(onToggleMock).not.toHaveBeenCalled();
  });

  it('renders with chevron down icon when open', async () => {
    const { getByTestId } = await render(
      <CollapsibleHeader title="Test Title" isOpen={true} onToggle={() => {}} testID="collapsible-header" />
    );
    expect(getByTestId('chevron-down-icon')).toBeTruthy();
  });

  it('renders with chevron right icon when closed', async () => {
    const { getByTestId } = await render(
      <CollapsibleHeader title="Test Title" isOpen={false} onToggle={() => {}} testID="collapsible-header" />
    );
    expect(getByTestId('chevron-right-icon')).toBeTruthy();
  });

  it('matches snapshot when open', async () => {
    const { toJSON } = await render(<CollapsibleHeader title="Test Title" isOpen={true} onToggle={() => {}} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('matches snapshot when closed', async () => {
    const { toJSON } = await render(<CollapsibleHeader title="Test Title" isOpen={false} onToggle={() => {}} />);
    expect(toJSON()).toMatchSnapshot();
  });
});
