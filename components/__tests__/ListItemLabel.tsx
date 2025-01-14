import React from 'react';
import { render } from '@testing-library/react-native';
import ListItemLabel from '../ListItemLabel';
import { ListItem } from '@/types/listItem';
import { Colors } from '@/constants/Colors';

jest.mock('../../assets/symbols/square-calendar.svg', () => 'CalendarIcon');
jest.mock('../../assets/symbols/square-list.svg', () => 'ListIcon');
jest.mock('../../assets/symbols/persona.svg', () => 'PersonaIcon');
jest.mock('../../assets/symbols/two-personas.svg', () => 'TwoPersonasIcon');
jest.mock('../../assets/symbols/three-personas.svg', () => 'ThreePersonasIcon');

// Mock the humanDate function
jest.mock('../../utils/dates', () => ({
  humanDate: jest.fn(),
}));

describe('ListItemLabel', () => {
  it('renders the label correctly', () => {
    const item: ListItem = { id: '0', type: 'item', label: 'Test Item', quantity: 3 };
    const { getByText } = render(<ListItemLabel item={item} showQuantity={false} />);
    expect(getByText('Test Item')).toBeTruthy();
  });

  it('shows the quantity when showQuantity is true', () => {
    const item: ListItem = { id: '1', type: 'item', label: 'Test Item', quantity: 3 };
    const { getByText } = render(<ListItemLabel item={item} showQuantity={true} />);
    expect(getByText('3 × Test Item')).toBeTruthy();
  });

  it('applies the correct styles', () => {
    const item: ListItem = { id: '3', type: 'item', label: 'Test Item' };
    const { getByText } = render(<ListItemLabel item={item} showQuantity={false} />);
    const label = getByText('Test Item');
    expect(label.props.style).toHaveProperty('[1].color', '#333333');
  });

  it('shows the deadline if set', () => {
    const item: ListItem = { id: '2', type: 'item', label: 'Test Item', deadline: Date.now() + 10000 };
    const { getByTestId } = render(
      <ListItemLabel item={item} showQuantity={false} testCalendarID="item-label-calendar" />
    );
    expect(getByTestId('item-label-calendar')).toBeTruthy();
  });

  it('applies the danger color when overdue', () => {
    const item: ListItem = { id: '4', type: 'item', label: 'Test Item', deadline: Date.now() - 10000 };
    const { getByTestId } = render(
      <ListItemLabel item={item} showQuantity={false} testCalendarID="item-label-calendar" />
    );
    const date = getByTestId('item-label-calendar');
    expect(date.children[0]).toHaveProperty('type', 'CalendarIcon');
    expect(date.children[1].props.style).toHaveProperty('[1].color', Colors['light'].danger);
  });

  it('shows the list if set', () => {
    const item: ListItem = { id: '2', type: 'item', label: 'Test Item', list: 'test list' };
    const { getByText, getByTestId } = render(
      <ListItemLabel item={item} showQuantity={false} testListID="item-label-list" />
    );
    const list = getByTestId('item-label-list');
    expect(list).toBeTruthy();
    expect(list.children[0]).toHaveProperty('type', 'ListIcon');
    expect(getByText('test list')).toBeTruthy();
  });

  it('shows the one person correctly', () => {
    const item: ListItem = { id: '2', type: 'item', label: 'Test Item', shared: ['user1'] };
    const { getByText, getByTestId } = render(
      <ListItemLabel item={item} showQuantity={false} testPersonasID="item-label-personas" />
    );
    const shared = getByTestId('item-label-personas');
    expect(shared).toBeTruthy();
    expect(getByText('user1')).toBeTruthy();
    expect(shared.children[0]).toHaveProperty('type', 'PersonaIcon');
  });

  it('shows the two persons correctly', () => {
    const item: ListItem = { id: '2', type: 'item', label: 'Test Item', shared: ['user1', 'user2'] };
    const { getByText, getByTestId } = render(
      <ListItemLabel item={item} showQuantity={false} testPersonasID="item-label-personas" />
    );
    expect(getByText('user1 and user2')).toBeTruthy();
    expect(getByTestId('item-label-personas').children[0]).toHaveProperty('type', 'TwoPersonasIcon');
  });

  it('shows the more than 2 persons correctly', () => {
    const item: ListItem = { id: '2', type: 'item', label: 'Test Item', shared: ['user1', 'user2', 'user3', 'user4'] };
    const { getByText, getByTestId } = render(
      <ListItemLabel item={item} showQuantity={false} testPersonasID="item-label-personas" />
    );
    expect(getByText('4 people')).toBeTruthy();
    expect(getByTestId('item-label-personas').children[0]).toHaveProperty('type', 'ThreePersonasIcon');
  });

  it('matches snapshot', () => {
    const item: ListItem = { id: '5', type: 'item', label: 'Test Item', quantity: 3, deadline: Date.now() + 10000 };
    const { toJSON } = render(<ListItemLabel item={item} showQuantity={true} />);
    expect(toJSON()).toMatchSnapshot();
  });
});
