import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useWindowDimensions } from 'react-native';

export function AppTabs() {
  const { width } = useWindowDimensions();
  return <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: '#1677ff', tabBarInactiveTintColor: '#81859d', tabBarStyle: { height: 59, borderTopWidth: 1, borderTopColor: '#edf0f5', backgroundColor: '#fbfcfe', maxWidth: 520, width: Math.min(width, 520), alignSelf: 'center', paddingTop: 5, paddingBottom: 7 }, tabBarIconStyle: { height: 26, flexShrink: 0 }, tabBarItemStyle: { padding: 0 }, tabBarLabelStyle: { lineHeight: 14, minHeight: 14, flexShrink: 0, fontFamily: 'Inter_400Regular', fontSize: 11, marginTop: 2 }, tabBarBadgeStyle: { backgroundColor: '#ff102a', fontSize: 10, minWidth: 16, height: 16, lineHeight: 16 } }}>
    <Tabs.Screen name="home" options={{ title: 'Home', tabBarIcon: ({color}) => <Ionicons name="home" size={24} color={color} /> }} />
    <Tabs.Screen name="messages" options={{ title: 'Messages', tabBarBadge: 2, tabBarIcon: ({color}) => <Ionicons name="chatbubbles-outline" size={24} color={color} /> }} />
    <Tabs.Screen name="explore" options={{ title: 'Explore', tabBarIcon: ({color}) => <Ionicons name="compass-outline" size={24} color={color} /> }} />
    <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: ({color}) => <Ionicons name="person-outline" size={24} color={color} /> }} />
  </Tabs>;
}
