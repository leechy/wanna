import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface PageProps {
  children: React.ReactNode;
}

export default function Page({ children }: PageProps) {
  const { top } = useSafeAreaInsets();

  return <View style={{ marginTop: top, flex: 1 }}>{children}</View>;
}
