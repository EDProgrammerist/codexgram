import type { PropsWithChildren } from 'react';
import { SafeAreaView } from 'react-native-screens/experimental';

// Screens own the top inset; native tabs supply the bottom tab-bar inset.
export function TabScreen({ children }: PropsWithChildren) {
  return <SafeAreaView edges={{ bottom: true }} style={{ flex: 1, backgroundColor: '#f8fafc' }}>{children}</SafeAreaView>;
}
