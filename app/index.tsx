import { Redirect } from 'expo-router';

// there is one home screen, the lists
export default function Index() {
  return <Redirect href="/shopping" />;
}
