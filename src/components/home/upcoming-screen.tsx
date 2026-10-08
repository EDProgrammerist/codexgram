import { TabScreen } from '@/components/home/tab-screen';
import { Text, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

export function UpcomingScreen({ title, message, icon }: {title: string; message: string; icon: 'chatbubbles-outline' | 'compass-outline' | 'person-outline'}) {
  return <TabScreen><SafeAreaView edges={['top', 'left', 'right']} style={styles.screen}><View style={styles.content}>
    <Ionicons name={icon} size={38} color="#1677ff" />
    <Text style={styles.title}>{title}</Text><Text style={styles.message}>{message}</Text>
  </View></SafeAreaView></TabScreen>;
}
const styles = StyleSheet.create({ screen: { flex: 1, backgroundColor: '#f8fafc' }, content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30 }, title: { fontFamily: 'Inter_700Bold', fontSize: 26, color: '#111421', marginTop: 18 }, message: { fontFamily: 'Inter_400Regular', fontSize: 15, lineHeight: 23, color: '#858ba5', textAlign: 'center', maxWidth: 320, marginTop: 12 } });
