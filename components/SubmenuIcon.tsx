import { Platform } from 'react-native';

import SubmenuIOS from '../assets/symbols/submenu-ios.svg';
import SubmenuAndroid from '../assets/symbols/submenu-android.svg';

export default function SubmenuIcon({
  width,
  height,
  color,
}: {
  width: number;
  height: number;
  color: string;
}) {
  return Platform.OS === 'ios' || Platform.OS === 'macos' ? (
    <SubmenuIOS
      width={width || 28}
      height={height || 28}
      color={color}
      testID="SubmenuIOS"
    />
  ) : (
    <SubmenuAndroid
      width={width || 28}
      height={height || 28}
      color={color}
      testID="SubmenuAndroid"
    />
  );
}
