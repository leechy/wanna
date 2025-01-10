import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface PageProps {
  hasHeader?: boolean;
  children: React.ReactNode;
}

export default function Page({ hasHeader, children }: PageProps) {
  const { top } = useSafeAreaInsets();

  return <View style={{ marginTop: hasHeader ? 0 : top, paddingTop: 18, flex: 1 }}>{children}</View>;
}
