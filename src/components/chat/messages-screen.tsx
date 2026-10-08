import { Image } from 'expo-image';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useUser } from '@clerk/expo';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TabScreen } from '@/components/home/tab-screen';
import { homeImages } from '@/data/demo-feed';
import { useLocalChat } from '@/hooks/use-local-chat';
export function MessagesScreen({ preview = false }: { preview?: boolean }) {
  const { user } = useUser();
  const [messages] = useLocalChat(preview ? 'preview:sarah' : `${user?.id}:sarah-demo`);
  const latest = messages[messages.length - 1];
  return <TabScreen><SafeAreaView edges={['top', 'left', 'right']} style={styles.screen}><View style={styles.content}>
    <Text accessibilityRole="header" style={styles.title}>Messages</Text>
    <Text style={styles.helper}>Try a sample conversation. Messages stay on this device for this session.</Text>
    <Pressable accessibilityRole="button" accessibilityLabel="Open chat with sarah.chen" onPress={() => router.push(preview ? '/chat-preview' : '/chat')} style={styles.row}><Image source={homeImages.sarah} style={styles.avatar} /><View style={{ flex: 1 }}><Text style={styles.name}>sarah.chen</Text><Text numberOfLines={1} style={styles.preview}>{latest?.text || (latest?.photo != null ? 'You shared a photo' : 'Belvedere Viewpoint · Lake Como, Italy')}</Text></View><Ionicons name="chevron-forward" size={20} color="#8590aa" /></Pressable>
  </View></SafeAreaView></TabScreen>;
}
const styles = StyleSheet.create({ screen: { flex: 1, backgroundColor: '#fcfdff' }, content: { width: '100%', maxWidth: 520, alignSelf: 'center', padding: 20 }, title: { fontFamily: 'Inter_700Bold', fontSize: 27, color: '#10172f', marginVertical: 15 }, helper: { fontFamily: 'Inter_400Regular', color: '#818ba6', fontSize: 13, lineHeight: 20, marginBottom: 20 }, row: { flexDirection: 'row', gap: 12, alignItems: 'center', paddingVertical: 15 }, avatar: { width: 52, height: 52, borderRadius: 26 }, name: { fontFamily: 'Inter_600SemiBold', color: '#10172f', fontSize: 16 }, preview: { fontFamily: 'Inter_400Regular', color: '#818ba6', fontSize: 13, marginTop: 6 } });
