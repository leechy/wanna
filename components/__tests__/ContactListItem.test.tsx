import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ContactListItem from '../ContactListItem';
import { ListItem } from '@/types/listItem';

jest.mock('../../assets/symbols/persona.svg', () => 'PersonIcon');

describe('ContactListItem', () => {
  it('renders the item correctly', () => {
    const item: ListItem = { id: '1', type: 'contact', label: 'John Doe', quantity: 5 };
    const { getByText } = render(<ContactListItem item={item} itemBorderRadius={{}} actionHandler={() => {}} />);
    expect(getByText('John Doe')).toBeTruthy();
    expect(getByText('5')).toBeTruthy();
  });

  it('calls actionHandler when pressed', () => {
    const item: ListItem = { id: '2', type: 'contact', label: 'John Doe', quantity: 5 };
    const actionHandlerMock = jest.fn();
    const { getByTestId } = render(
      <ContactListItem item={item} itemBorderRadius={{}} actionHandler={actionHandlerMock} testID="contact-list-item" />
    );
    const button = getByTestId('contact-list-item');
    fireEvent.press(button);
    expect(actionHandlerMock).toHaveBeenCalledWith(item);
  });
});
