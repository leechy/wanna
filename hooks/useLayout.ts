import { Dimensions, useWindowDimensions } from 'react-native';

// from this width the home screen and the open list are side by side
export const WIDE_LAYOUT_WIDTH = 720;
// the width of the home screen on the left of a wide layout
export const NAV_PANE_WIDTH = 300;

/**
 * True when the window is wide enough for two panes:
 * a big phone in landscape, a tablet, an open foldable, the web
 */
export function useIsWide(): boolean {
  const { width } = useWindowDimensions();
  return width >= WIDE_LAYOUT_WIDTH;
}

/**
 * The same as useIsWide, for the code outside the components
 */
export function isWideNow(): boolean {
  return Dimensions.get('window').width >= WIDE_LAYOUT_WIDTH;
}
