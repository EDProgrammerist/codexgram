import { useAuth } from '@clerk/expo';
import { useLocalCommentDelta } from '@/hooks/use-local-comments';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BrandIcon } from '@/components/home/brand-icon';
import { PostCard } from '@/components/home/post-card';
import { CommentsSheet } from './comments-sheet';
import { demoPosts } from '@/data/demo-feed';
export function CommentsPreview() {
  const { userId } = useAuth();
  const commentDelta = useLocalCommentDelta(userId);
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState(true);
  const [liked, setLiked] = useState(true);
  const [saved, setSaved] = useState(false);
  const contentWidth = Math.min(width, 520);
  return <View style={{ flex: 1, backgroundColor: '#fcfdff', paddingTop: insets.top }}><View style={{ width: contentWidth, alignSelf: 'center' }}>
    <View style={styles.header}><Pressable accessibilityRole="button" accessibilityLabel="Back to home" onPress={() => router.replace('/preview/home')} style={styles.icon}><Ionicons name="chevron-back" size={26} /></Pressable><BrandIcon size={34} /><Text style={styles.brand}>Codexgram</Text><Pressable accessibilityRole="button" accessibilityLabel="Open post comments" onPress={() => setOpen(true)} style={styles.icon}><Ionicons name="ellipsis-horizontal" size={25} /></Pressable></View>
    <View style={{ marginHorizontal: 10 }}><PostCard compact post={demoPosts[0]} width={contentWidth - 20} liked={liked} saved={saved} commentCount={commentDelta(demoPosts[0].id)} onLike={() => setLiked(current => !current)} onSave={() => setSaved(current => !current)} onComment={() => setOpen(true)} onMenu={() => setOpen(true)} onProfile={() => router.replace('/preview/profile')} onVideo={() => {}} /></View>
  </View>{open && <CommentsSheet post={demoPosts[0]} onClose={() => setOpen(false)} />}</View>;
}
const styles = StyleSheet.create({ header: { height: 53, flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 7 }, icon: { width: 48, height: 44, alignItems: 'center', justifyContent: 'center' }, brand: { fontFamily: 'Inter_700Bold', color: '#080e21', fontSize: 23, letterSpacing: -1, flex: 1 } });
