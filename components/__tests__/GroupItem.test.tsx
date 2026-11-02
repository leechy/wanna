import React from 'react';
import { render } from '@testing-library/react-native';
import GroupItem from '../GroupItem';
import { ListItem } from '@/types/listItem';

jest.mock('../../assets/symbols/bag-fill.svg', () => 'PurchaseIcon');

describe('GroupItem', () => {
  it('renders the item correctly', async () => {
    const item: ListItem = { id: '1', type: 'group', label: 'Groceries' };
    const { getByText } = await render(<GroupItem item={item} itemBorderRadius={{}} />);
    expect(getByText('Groceries')).toBeTruthy();
  });

  it('matches snapshot', async () => {
    const item: ListItem = { id: '1', type: 'group', label: 'Groceries' };
    const { toJSON } = await render(<GroupItem item={item} itemBorderRadius={{}} />);
    expect(toJSON()).toMatchSnapshot();
  });
});
