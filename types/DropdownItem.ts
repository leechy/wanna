import { SvgProps } from 'react-native-svg';

export type DropdownItem = {
  label: string;
  onPress: () => void;
  icon?: React.FC<SvgProps>;
  color?: string;
};
