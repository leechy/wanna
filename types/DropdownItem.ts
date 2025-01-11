import { SvgProps } from 'react-native-svg';

export type DropdownItem = {
  label: string;
  onPress?: (item?: DropdownItem) => void;
  icon?: React.FC<SvgProps>;
  color?: string;
};
