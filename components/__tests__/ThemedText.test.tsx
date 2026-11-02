import * as React from 'react';
import { render } from '@testing-library/react-native';

import { ThemedText } from '../ThemedText';

describe('ThemedText', () => {
  it(`renders correctly`, async () => {
    const tree = (await render(<ThemedText>Snapshot test!</ThemedText>)).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it(`title renders correctly`, async () => {
    const tree = (await render(
      <ThemedText type="title">Snapshot test!</ThemedText>
    )).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it(`subtitle renders correctly`, async () => {
    const tree = (await render(
      <ThemedText type="subtitle">Snapshot test!</ThemedText>
    )).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
