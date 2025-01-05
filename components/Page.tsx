import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface PageProps {
  children: React.ReactNode;
}

export default function Page({ children }: PageProps) {
  const { top } = useSafeAreaInsets();

  return <View style={{ marginTop: top, paddingTop: 18, flex: 1 }}>{children}</View>;
}
