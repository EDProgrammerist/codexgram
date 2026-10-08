import { DefaultTheme, ThemeProvider } from 'expo-router';
import { NativeTabs } from 'expo-router/unstable-native-tabs';

export function AppTabs() {
  return <ThemeProvider value={{ ...DefaultTheme, colors: { ...DefaultTheme.colors, background: '#f8fafc', card: '#fbfcfe', primary: '#1677ff' } }}><NativeTabs backgroundColor="#fbfcfe" tintColor="#1677ff" iconColor={{ default: '#81859d', selected: '#1677ff' }} labelStyle={{ default: { color: '#81859d' }, selected: { color: '#1677ff' } }} badgeBackgroundColor="#ff102a" disableTransparentOnScrollEdge>
    <NativeTabs.Trigger name="home" disableAutomaticContentInsets><NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label><NativeTabs.Trigger.Icon sf={{ default: 'house', selected: 'house.fill' }} md="home" /></NativeTabs.Trigger>
    <NativeTabs.Trigger name="messages" disableAutomaticContentInsets><NativeTabs.Trigger.Label>Messages</NativeTabs.Trigger.Label><NativeTabs.Trigger.Icon sf={{ default: 'bubble.left.and.bubble.right', selected: 'bubble.left.and.bubble.right.fill' }} md="chat_bubble_outline" /><NativeTabs.Trigger.Badge>2</NativeTabs.Trigger.Badge></NativeTabs.Trigger>
    <NativeTabs.Trigger name="explore" disableAutomaticContentInsets><NativeTabs.Trigger.Label>Explore</NativeTabs.Trigger.Label><NativeTabs.Trigger.Icon sf={{ default: 'safari', selected: 'safari.fill' }} md="explore" /></NativeTabs.Trigger>
    <NativeTabs.Trigger name="profile" disableAutomaticContentInsets><NativeTabs.Trigger.Label>Profile</NativeTabs.Trigger.Label><NativeTabs.Trigger.Icon sf={{ default: 'person.crop.circle', selected: 'person.crop.circle.fill' }} md="person_outline" /></NativeTabs.Trigger>
  </NativeTabs></ThemeProvider>;
}
