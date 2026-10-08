import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { FeedPost } from '@/data/demo-feed';

type Props = { compact?: boolean; post: FeedPost; width: number; liked: boolean; saved: boolean; commentCount: number; onLike: () => void; onSave: () => void; onComment: () => void; onMenu: () => void; onProfile: () => void; onVideo: () => void };
export function PostCard({ compact = false, post, width, liked, saved, commentCount, onLike, onSave, onComment, onMenu, onProfile, onVideo }: Props) {
  const [page, setPage] = useState(0);
  const carousel = useRef<ScrollView>(null);
  const mediaWidth = width - 8;
  const mediaHeight = mediaWidth / (compact ? 1.85 : post.kind === 'video' ? 584 / 245 : 584 / 346);
  function nextPhoto() {
    const next = (page + 1) % post.media.length;
    setPage(next);
    carousel.current?.scrollTo({ x: next * mediaWidth, animated: true });
  }
  return <View style={styles.card} testID={`post-${post.id}`}>
    <View style={[styles.header, compact && { height: 44 }]}>
      <Pressable accessibilityRole="button" accessibilityLabel={`View ${post.username}`} onPress={onProfile} style={styles.author}>
        <Image source={post.avatar} contentFit="cover" style={styles.avatar} />
        <View style={{ flexShrink: 1 }}>
          <View style={styles.nameRow}><Text style={styles.username}>{post.username}</Text>{post.verified && <MaterialIcons name="verified" size={13} color="#1680ff" accessibilityLabel="Verified" />}</View>
          <Text style={styles.location} numberOfLines={1}>{post.location}</Text>
        </View>
      </Pressable>
      <Text style={styles.time}>{post.time}</Text>
      <Pressable accessibilityRole="button" accessibilityLabel={`More options for ${post.username}'s post`} onPress={onMenu} style={styles.menu}><Ionicons name="ellipsis-horizontal" size={20} color="#10121f" /></Pressable>
    </View>
    <View style={[styles.media, { width: mediaWidth, height: mediaHeight }]}>
      {post.kind === 'photo' ? <>
        <ScrollView ref={carousel} horizontal pagingEnabled showsHorizontalScrollIndicator={false} onMomentumScrollEnd={event => setPage(Math.round(event.nativeEvent.contentOffset.x / mediaWidth))}>
          {post.media.map((source, index) => <Image key={index} source={source} contentFit="cover" accessibilityLabel={`${post.location}, photo ${index + 1}`} style={{ width: mediaWidth, height: mediaHeight }} />)}
        </ScrollView>
        {post.media.length > 1 && <Pressable accessibilityRole="button" accessibilityLabel={`Next photo, ${page + 1} of ${post.media.length}`} onPress={nextPhoto} style={styles.counter}><Text style={styles.counterText}>{page + 1}/{post.media.length}</Text></Pressable>}
      </> : <Pressable accessibilityRole="button" accessibilityLabel={`Play ${post.username}'s video`} onPress={onVideo} style={StyleSheet.absoluteFill}>
        <Image source={post.media[0]} contentFit="cover" accessibilityLabel="Amalfi Coast with hillside villas and turquoise water" style={StyleSheet.absoluteFill} />
        <View style={styles.play}><Ionicons name="play" size={27} color="#fff" style={{ marginLeft: 3 }} /></View>
        <View style={styles.duration}><Text style={styles.counterText}>0:28</Text></View>
      </Pressable>}
    </View>
    <View style={styles.copy}>
      <Text style={styles.caption}>{post.caption}</Text>
      <Text style={styles.description}>{post.description}</Text>
    </View>
    <View style={styles.actions}>
      <Pressable accessibilityRole="button" accessibilityLabel={`${liked ? 'Unlike' : 'Like'} ${post.username}'s post`} accessibilityState={{ selected: liked }} onPress={onLike} style={styles.action}>
        <Ionicons name={liked ? 'heart' : 'heart-outline'} size={24} color={liked ? '#ff102a' : '#121522'} /><Text style={styles.count}>{post.likes + (liked ? 0 : -1)}</Text>
      </Pressable>
      <Pressable accessibilityRole="button" accessibilityLabel={`Comments on ${post.username}'s post`} onPress={onComment} style={styles.action}>
        <Ionicons name="chatbubble-outline" size={20} color="#131624" /><Text style={styles.count}>{post.comments + commentCount}</Text>
      </Pressable>
      <View style={{ flex: 1 }} />
      <Pressable accessibilityRole="button" accessibilityLabel={`${saved ? 'Unsave' : 'Save'} ${post.username}'s post`} accessibilityState={{ selected: saved }} onPress={onSave} style={styles.bookmark}>
        <Ionicons name={saved ? 'bookmark' : 'bookmark-outline'} size={22} color={saved ? '#1677ff' : '#111420'} />
      </Pressable>
    </View>
  </View>;
}
const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 11, borderWidth: 1, borderColor: '#f0f3f7', marginBottom: 10, boxShadow: '0px 5px 16px rgba(50,77,111,0.035)' },
  header: { height: 53, flexDirection: 'row', alignItems: 'center', paddingLeft: 9, paddingRight: 3 },
  author: { flexDirection: 'row', alignItems: 'center', gap: 11, flex: 1, minWidth: 0 },
  avatar: { width: 42, height: 42, borderRadius: 21 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  username: { fontFamily: 'Inter_700Bold', color: '#0b0d18', fontSize: 14, letterSpacing: -0.45, includeFontPadding: false },
  location: { fontFamily: 'Inter_400Regular', color: '#858aa4', fontSize: 11.5, marginTop: 3, includeFontPadding: false },
  time: { fontFamily: 'Inter_400Regular', color: '#858aa4', fontSize: 10, marginLeft: 4 },
  menu: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  media: { alignSelf: 'center', overflow: 'hidden', borderRadius: 9, backgroundColor: '#edf2f7' },
  counter: { position: 'absolute', top: 7, right: 8, borderRadius: 15, backgroundColor: 'rgba(43,39,39,0.61)', paddingHorizontal: 10, paddingVertical: 5, minWidth: 40 },
  counterText: { color: '#fff', fontSize: 12, fontFamily: 'Inter_600SemiBold', textAlign: 'center' },
  play: { position: 'absolute', width: 52, height: 52, borderRadius: 26, backgroundColor: 'rgba(33,55,65,0.78)', alignItems: 'center', justifyContent: 'center', left: '50%', top: '50%', transform: [{ translateX: -26 }, { translateY: -26 }] },
  duration: { position: 'absolute', bottom: 8, right: 8, borderRadius: 14, paddingHorizontal: 9, paddingVertical: 5, backgroundColor: 'rgba(42,32,34,0.74)' },
  copy: { paddingHorizontal: 9, paddingTop: 7 },
  caption: { fontFamily: 'Inter_600SemiBold', color: '#11131d', fontSize: 13, lineHeight: 18, letterSpacing: -0.3 },
  description: { fontFamily: 'Inter_400Regular', color: '#858ba5', fontSize: 11.5, lineHeight: 18, letterSpacing: -0.15 },
  actions: { flexDirection: 'row', alignItems: 'center', paddingLeft: 12, paddingRight: 8, height: 43, gap: 22 },
  action: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 43, minWidth: 68 },
  count: { fontFamily: 'Inter_600SemiBold', color: '#111421', fontSize: 12 },
  bookmark: { minWidth: 32, minHeight: 43, alignItems: 'center', justifyContent: 'center' },
});
