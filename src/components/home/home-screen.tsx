import { CommentsSheet } from '@/components/comments/comments-sheet';
import { TabScreen } from '@/components/home/tab-screen';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { useRef, useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, TextInput, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { demoPosts, homeImages, type FeedPost } from '@/data/demo-feed';
import { HomeHeader } from './home-header';
import { FeedSheet } from './feed-sheet';
import { PostCard } from './post-card';

type PostState = { liked: boolean; saved: boolean; commentDelta: number };
const initialState: PostState = { liked: true, saved: false, commentDelta: 0 };
type Sheet = { kind: 'options' | 'profile' | 'video'; post: FeedPost } | { kind: 'create' } | null;

export function HomeScreen() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const feedWidth = Math.min(width, 520);
  const [posts, setPosts] = useState(demoPosts);
  const [states, setStates] = useState<Record<string, PostState>>({});
  const [commentPost, setCommentPost] = useState<FeedPost | null>(null);
  const [sheet, setSheet] = useState<Sheet>(null);
  const [draft, setDraft] = useState('');
  const [photo, setPhoto] = useState<'lake' | 'coast'>('lake');
  const [notice, setNotice] = useState('');
  const list = useRef<FlatList<FeedPost>>(null);
  function updatePost(id: string, change: (current: PostState) => PostState) {
    setStates(current => ({ ...current, [id]: change(current[id] ?? initialState) }));
  }
  function open(next: Sheet) { setDraft(''); setNotice(''); setSheet(next); }
  function publish() {
    const post: FeedPost = {
      id: `local-${Date.now()}`, username: 'you', avatar: homeImages.sarah, location: 'A moment worth sharing', time: 'Just now',
      media: [homeImages[photo]], kind: 'photo', caption: draft.trim() || 'A little moment from today.', description: '', likes: 1, comments: 0, verified: false,
    };
    setPosts(current => [post, ...current]); setSheet(null); setDraft('');
    list.current?.scrollToOffset({ offset: 0, animated: true });
  }
  const selectedPost = sheet && 'post' in sheet ? sheet.post : null;
  const selectedState = selectedPost ? states[selectedPost.id] ?? initialState : initialState;
  return <TabScreen><View style={[styles.screen, { paddingTop: insets.top }]}>
    <View style={{ width: feedWidth, flex: 1, alignSelf: 'center' }}>
      <HomeHeader onCreate={() => open({ kind: 'create' })} />
      <FlatList ref={list} data={posts} keyExtractor={post => post.id} showsVerticalScrollIndicator={false} contentContainerStyle={styles.feed}
        refreshControl={<RefreshControl refreshing={false} onRefresh={() => { setPosts(demoPosts); setStates({}); }} tintColor="#1677ff" />}
        initialNumToRender={3} windowSize={5}
        renderItem={({ item }) => {
          const state = states[item.id] ?? initialState;
          return <PostCard post={item} width={feedWidth - 16} liked={state.liked} saved={state.saved} commentCount={state.commentDelta}
            onLike={() => updatePost(item.id, current => ({ ...current, liked: !current.liked }))}
            onSave={() => updatePost(item.id, current => ({ ...current, saved: !current.saved }))}
            onComment={() => setCommentPost(item)} onMenu={() => open({ kind: 'options', post: item })}
            onProfile={() => open({ kind: 'profile', post: item })} onVideo={() => open({ kind: 'video', post: item })} />;
        }}
        ListEmptyComponent={<View style={styles.empty}><Text style={styles.sheetHeading}>You’re all caught up</Text><Pressable accessibilityRole="button" onPress={() => setPosts(demoPosts)} style={styles.primary}><Text style={styles.primaryText}>Restore preview posts</Text></Pressable></View>}
      />
    </View>
    {commentPost && <CommentsSheet key={commentPost.id} post={commentPost} onClose={() => setCommentPost(null)} onCountChange={delta => updatePost(commentPost.id, current => ({ ...current, commentDelta: delta }))} />}
    <FeedSheet visible={sheet !== null} title={sheet?.kind === 'create' ? 'New moment' : sheet?.kind === 'profile' ? selectedPost?.username ?? 'Profile' : sheet?.kind === 'video' ? 'Amalfi Coast' : 'Post options'} onClose={() => setSheet(null)}>
      {sheet?.kind === 'options' && selectedPost && <>
        <Pressable accessibilityRole="button" onPress={() => { updatePost(selectedPost.id, current => ({ ...current, saved: !current.saved })); setSheet(null); }} style={styles.option}><Ionicons name="bookmark-outline" size={22} /><Text style={styles.body}>{selectedState.saved ? 'Remove from saved' : 'Save post'}</Text></Pressable>
        <Pressable accessibilityRole="button" onPress={() => { setPosts(current => current.filter(post => post.id !== selectedPost.id)); setSheet(null); }} style={styles.option}><Ionicons name="eye-off-outline" size={22} /><Text style={styles.body}>Hide this post</Text></Pressable>
        <Pressable accessibilityRole="button" onPress={() => setNotice('Reporting will be available when the private community opens. No report has been sent.')} style={styles.option}><Ionicons name="flag-outline" size={22} /><Text style={styles.body}>Report post</Text></Pressable>
        {!!notice && <Text accessibilityRole="alert" style={styles.helper}>{notice}</Text>}
      </>}
      {sheet?.kind === 'profile' && selectedPost && <View style={styles.profile}>
        <Image source={selectedPost.avatar} style={{ width: 88, height: 88, borderRadius: 44 }} />
        <Text style={styles.sheetHeading}>{selectedPost.username}</Text><Text style={styles.helper}>{selectedPost.location}</Text>
        <Text style={styles.body}>Collecting little moments with good people.</Text>
      </View>}
      {sheet?.kind === 'video' && <>
        <Image source={homeImages.coast} contentFit="cover" style={{ width: '100%', aspectRatio: 584 / 245, borderRadius: 14 }} />
        <Text style={[styles.sheetHeading, { marginTop: 18 }]}>This place is incredible!</Text>
        <Text style={styles.helper}>The reference includes a video cover, but no video file. Playback will be available when a clip is added.</Text>
      </>}
      {sheet?.kind === 'create' && <>
        <Text style={styles.helper}>Try a preview post with one of these photos. It stays in this session.</Text>
        <View style={{ flexDirection: 'row', gap: 12 }}>{(['lake', 'coast'] as const).map(name => <Pressable key={name} accessibilityRole="button" accessibilityLabel={`Select ${name} photo`} accessibilityState={{ selected: photo === name }} onPress={() => setPhoto(name)} style={{ flex: 1, padding: 3, borderWidth: 2, borderColor: photo === name ? '#1677ff' : '#e9edf3', borderRadius: 14 }}><Image source={homeImages[name]} style={{ width: '100%', aspectRatio: 1.3, borderRadius: 9 }} /></Pressable>)}</View>
        <TextInput accessibilityLabel="Post caption" placeholder="Say something about this moment…" placeholderTextColor="#858ba5" value={draft} onChangeText={setDraft} maxLength={1000} multiline style={[styles.input, { minHeight: 90 }]} />
        <Pressable accessibilityRole="button" onPress={publish} style={styles.primary}><Text style={styles.primaryText}>Add to preview feed</Text></Pressable>
      </>}
    </FeedSheet>
  </View></TabScreen>;
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f8fafc' },
  feed: { paddingHorizontal: 8, paddingBottom: 10 },
  helper: { fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 22, color: '#78829c', marginBottom: 18 },
  body: { fontFamily: 'Inter_400Regular', fontSize: 15, lineHeight: 23, color: '#151826' },
  sheetHeading: { fontFamily: 'Inter_700Bold', fontSize: 20, color: '#101320', marginBottom: 10 },
  comment: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#eef1f6' },
  commentAuthor: { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: '#111421', marginBottom: 5 },
  input: { fontFamily: 'Inter_400Regular', fontSize: 15, lineHeight: 22, color: '#111421', backgroundColor: '#f4f6fa', borderWidth: 1, borderColor: '#e4e9f1', borderRadius: 14, padding: 14, marginTop: 18, minHeight: 52, textAlignVertical: 'top' },
  primary: { minHeight: 48, borderRadius: 14, backgroundColor: '#1677ff', alignItems: 'center', justifyContent: 'center', marginTop: 14, padding: 12 },
  primaryText: { color: '#fff', fontFamily: 'Inter_600SemiBold', fontSize: 15 },
  option: { minHeight: 56, flexDirection: 'row', alignItems: 'center', gap: 14 },
  profile: { alignItems: 'center', gap: 12, paddingBottom: 20 },
  empty: { padding: 30, alignItems: 'center' },
});
