import { Redirect } from 'expo-router';
import { AppTabs } from '@/components/home/app-tabs';
export default function PreviewLayout() { return __DEV__ ? <AppTabs /> : <Redirect href="/" />; }
