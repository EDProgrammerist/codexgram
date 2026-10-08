import type { PropsWithChildren } from 'react';
import { View } from 'react-native';

export function TabScreen({ children }: PropsWithChildren) {
  return <View style={{ flex: 1 }}>{children}</View>;
}
