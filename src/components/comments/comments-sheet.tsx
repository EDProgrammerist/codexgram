import { useAuth } from '@clerk/expo';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, Text, TextInput, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { homeImages, type FeedPost } from '@/data/demo-feed';
import { seedComments, type DemoComment } from '@/data/demo-comments';
import { isSeededPost, useLocalComments } from '@/hooks/use-local-comments';
export function CommentsSheet({ post, onClose, onCountChange }: { post: FeedPost; onClose: () => void; onCountChange?: (delta: number) => void }) {
  const { userId } = useAuth();
  const seeded = isSeededPost(post.id);
  const [comments, update] = useLocalComments(userId, post.id, seeded);
  const baseLength = seeded ? seedComments.length : 0;
  const count = post.comments + comments.length - baseLength;
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [draft, setDraft] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const input = useRef<TextInput>(null);
  const list = useRef<FlatList<DemoComment>>(null);
  const scrollToNew = useRef(false);
  function like(id: string) { update(comments.map(item => item.id === id ? { ...item, liked: !item.liked, likes: item.likes + (item.liked ? -1 : 1) } : item)); }
  function publish() {
    if (!draft.trim()) return;
    const next = [...comments, { id: `local-${Date.now()}`, username: 'you', avatar: homeImages.sarah, time: 'Just now', text: draft.trim(), likes: 0, own: true, replyTo: replyTo ?? undefined }];
    scrollToNew.current = true;update(next);onCountChange?.(next.length - baseLength);setDraft('');setReplyTo(null);setShowEmoji(false);
  }
  function remove(id: string) { const next = comments.filter(item => !(item.id === id && item.own));update(next);onCountChange?.(next.length - baseLength);setDeleting(null); }
  return <Modal transparent visible animationType="slide" onRequestClose={onClose}>
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.overlay}>
      <Pressable accessibilityRole="button" accessibilityLabel="Dismiss comments" onPress={onClose} style={StyleSheet.absoluteFill} />
      <View accessibilityViewIsModal style={[styles.sheet, { height: Math.max(330, height * 0.549), maxHeight: '92%', paddingBottom: insets.bottom }]}>
        <View style={styles.handle} />
        <View style={styles.header}><Text accessibilityRole="header" style={styles.title}>Comments ({count})</Text><Pressable accessibilityRole="button" accessibilityLabel="Close comments" onPress={onClose} style={styles.close}><Ionicons name="close" size={26} color="#8a94b2" /></Pressable></View>
        <FlatList initialNumToRender={20} ref={list} data={comments} keyExtractor={item => item.id} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" onContentSizeChange={() => { if (scrollToNew.current) { list.current?.scrollToOffset({ offset: comments.length * 1000, animated: true });scrollToNew.current = false; } }}
          renderItem={({ item }) => <View style={styles.comment} testID={`comment-${item.id}`}><Image source={item.avatar} contentFit="cover" style={styles.avatar} /><View style={styles.content}><View style={styles.identity}><Text style={styles.name}>{item.username}</Text>{item.verified && <MaterialIcons name="verified" size={12} color="#0876ff" />}<Text style={styles.time}>{item.time}</Text></View>{item.replyTo && <Text style={styles.replyContext}>Replying to @{item.replyTo}</Text>}<Text style={styles.text}>{item.text}</Text><View style={styles.actions}><Pressable accessibilityRole="button" accessibilityLabel={`${item.liked ? 'Unlike' : 'Like'} comment by ${item.username}`} accessibilityState={{ selected: !!item.liked }} aria-pressed={!!item.liked} onPress={() => like(item.id)} style={styles.like}><Ionicons name={item.liked ? 'heart' : 'heart-outline'} size={14} color={item.liked ? '#ff102a' : '#495777'} /><Text style={styles.likes}>{item.likes}</Text></Pressable><Pressable accessibilityRole="button" accessibilityLabel={`Reply to ${item.username}`} onPress={() => { setReplyTo(item.username); input.current?.focus(); }} style={styles.reply}><Text style={styles.replyText}>Reply</Text></Pressable></View>{deleting === item.id && <View style={styles.deleteConfirm}><Text style={styles.replyText}>Delete your comment?</Text><Pressable accessibilityRole="button" accessibilityLabel="Confirm delete comment" onPress={() => remove(item.id)} style={styles.confirm}><Text style={{ color: '#d51a34' }}>Delete</Text></Pressable><Pressable accessibilityRole="button" accessibilityLabel="Cancel delete comment" onPress={() => setDeleting(null)} style={styles.confirm}><Text>Cancel</Text></Pressable></View>}</View><Pressable accessibilityRole="button" accessibilityLabel={item.own ? `Delete comment by ${item.username}` : `${item.liked ? 'Unlike' : 'Like'} ${item.username}'s comment`} onPress={() => item.own ? setDeleting(item.id) : like(item.id)} style={styles.trailing}><Ionicons name={item.own ? 'trash-outline' : item.liked ? 'heart' : 'heart-outline'} size={17} color={item.liked && !item.own ? '#ff102a' : '#8793b2'} /></Pressable></View>}
          ListEmptyComponent={<Text style={styles.empty}>Start the conversation. Add the first comment.</Text>}
        />
        {replyTo && <View style={styles.replying}><Text style={styles.replyText}>Replying to @{replyTo}</Text><Pressable accessibilityRole="button" accessibilityLabel="Cancel reply" onPress={() => setReplyTo(null)} style={styles.close}><Ionicons name="close" size={19} /></Pressable></View>}
        {showEmoji && <View style={styles.emojis}>{['😍', '💙', '🙏', '✨', '💛', '😊'].map(emoji => <Pressable key={emoji} accessibilityRole="button" accessibilityLabel={`Insert ${emoji}`} onPress={() => { setDraft(current => (current + emoji).slice(0, 500));setShowEmoji(false); input.current?.focus(); }} style={styles.emojiItem}><Text style={{ fontSize: 23 }}>{emoji}</Text></Pressable>)}</View>}
        <View style={styles.composer}><Image source={homeImages.sarah} style={styles.composerAvatar} /><View style={styles.inputWrap}><TextInput ref={input} accessibilityLabel="Add a comment" placeholder={replyTo ? 'Add a reply...' : 'Add a comment...'} placeholderTextColor="#8995b3" value={draft} onChangeText={setDraft} maxLength={500} multiline style={styles.input} /><Pressable accessibilityRole="button" accessibilityLabel="Comment emoji" onPress={() => setShowEmoji(current => !current)} style={styles.emojiButton}><Ionicons name="happy-outline" size={24} color="#111b37" /></Pressable></View><Pressable accessibilityRole="button" accessibilityLabel="Post comment" disabled={!draft.trim()} accessibilityState={{ disabled: !draft.trim() }} onPress={publish} style={styles.send}><Ionicons name="send" size={23} color="#fff" /></Pressable></View>
      </View>
    </KeyboardAvoidingView>
  </Modal>;
}
const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(15,19,26,0.43)' }, sheet: { width: '100%', maxWidth: 520, alignSelf: 'center', backgroundColor: '#fcfdff', borderTopLeftRadius: 20, borderTopRightRadius: 20, overflow: 'hidden' }, handle: { width: 47, height: 4, borderRadius: 3, backgroundColor: '#b1b9cd', alignSelf: 'center', marginTop: 8 }, header: { height: 44, flexDirection: 'row', alignItems: 'center', paddingLeft: 19, paddingRight: 6, borderBottomWidth: 1, borderColor: '#edf0f6' }, title: { flex: 1, fontFamily: 'Inter_700Bold', fontSize: 18, letterSpacing: -0.6, color: '#10172e' }, close: { width: 42, height: 40, alignItems: 'center', justifyContent: 'center' },
  comment: { flexDirection: 'row', paddingLeft: 14, paddingRight: 10, gap: 13, paddingTop: 5 }, avatar: { width: 40, height: 40, borderRadius: 20 }, content: { flex: 1, minHeight: 65, borderBottomWidth: 1, borderColor: '#eef1f7', paddingBottom: 5 }, identity: { flexDirection: 'row', gap: 4, alignItems: 'center', minHeight: 20 }, name: { fontFamily: 'Inter_700Bold', fontSize: 12, letterSpacing: -0.3, color: '#10172b' }, time: { fontFamily: 'Inter_400Regular', fontSize: 9.5, color: '#8995b3', marginLeft: 5 }, text: { fontFamily: 'Inter_400Regular', fontSize: 10.8, lineHeight: 16.5, color: '#3c486e', letterSpacing: -0.2 }, actions: { flexDirection: 'row', alignItems: 'center', gap: 15, height: 22 }, like: { flexDirection: 'row', alignItems: 'center', gap: 5, minHeight: 22 }, likes: { fontFamily: 'Inter_400Regular', color: '#495777', fontSize: 10 }, reply: { minHeight: 22, justifyContent: 'center' }, replyText: { fontFamily: 'Inter_600SemiBold', color: '#7886a8', fontSize: 10 }, trailing: { width: 24, height: 40, alignItems: 'center', justifyContent: 'center' }, replyContext: { fontFamily: 'Inter_400Regular', color: '#1677ff', fontSize: 10, marginBottom: 3 }, deleteConfirm: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 10 }, confirm: { paddingVertical: 8 },
  composer: { minHeight: 56, flexDirection: 'row', gap: 9, alignItems: 'center', paddingHorizontal: 14, paddingVertical: 5, borderTopWidth: 1, borderColor: '#edf0f6' }, composerAvatar: { width: 36, height: 36, borderRadius: 18 }, inputWrap: { flex: 1, borderWidth: 1, borderColor: '#dbe3f4', borderRadius: 22, flexDirection: 'row', alignItems: 'center', minHeight: 37, paddingLeft: 14 }, input: { flex: 1, height: 36, maxHeight: 80, fontFamily: 'Inter_400Regular', fontSize: 12, lineHeight: 18, color: '#17213a', paddingVertical: 8 }, emojiButton: { width: 35, height: 36, alignItems: 'center', justifyContent: 'center' }, send: { width: 40, height: 40, borderRadius: 21, backgroundColor: '#0876ff', alignItems: 'center', justifyContent: 'center' }, replying: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 20, backgroundColor: '#eef4ff' }, emojis: { flexDirection: 'row', justifyContent: 'space-around', padding: 4 }, emojiItem: { padding: 8 }, empty: { fontFamily: 'Inter_400Regular', color: '#8793b2', padding: 24, textAlign: 'center' },
});
