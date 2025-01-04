import * as React from 'react';
import { render } from '@testing-library/react-native';

import { ThemedText } from '../ThemedText';

describe('ThemedText', () => {
  it(`renders correctly`, () => {
    const tree = render(<ThemedText>Snapshot test!</ThemedText>).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it(`title renders correctly`, () => {
    const tree = render(
      <ThemedText type="title">Snapshot test!</ThemedText>
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it(`subtitle renders correctly`, () => {
    const tree = render(
      <ThemedText type="subtitle">Snapshot test!</ThemedText>
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
