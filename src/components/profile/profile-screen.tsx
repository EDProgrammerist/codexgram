import { explorePosts } from '@/data/demo-explore';
import { useSessionSaved } from '@/hooks/use-session-saved';
import { router } from 'expo-router';
import { useSessionProfile } from '@/hooks/use-session-profile';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { useClerk, useUser } from '@clerk/expo';
import { useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { profilePhotos, type ProfilePhoto } from '@/data/demo-profile';
import { homeImages } from '@/data/demo-feed';
import { BrandIcon } from '@/components/home/brand-icon';
import { FeedSheet } from '@/components/home/feed-sheet';
import { TabScreen } from '@/components/home/tab-screen';

type Filter = 'Posts' | 'Reels' | 'Saved' | 'Tagged';
type Panel = 'settings' | 'notifications' | 'people' | 'story' | null;
const filters: { name: Filter; icon: keyof typeof Ionicons.glyphMap }[] = [
  { name: 'Posts', icon: 'apps' }, { name: 'Reels', icon: 'film-outline' },
  { name: 'Saved', icon: 'bookmark-outline' }, { name: 'Tagged', icon: 'person-circle-outline' },
];

export function ProfileScreen({ preview = false }: { preview?: boolean }) {
  const { user } = useUser();
  const { signOut } = useClerk();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const contentWidth = Math.min(width, 520);
  const tileWidth = (contentWidth - 14) / 3;
  const scroll = useRef<ScrollView>(null);
  const initial = { name: preview ? 'Sarah Chen' : user?.fullName || 'Your name', username: preview ? 'sarah.chen' : user?.username || user?.firstName?.toLowerCase() || 'your.profile', location: preview ? 'Lake Como, Italy' : '', bio: preview ? 'Golden hour enthusiast. Capturing real moments, closer connections. ✨' : 'Share a little about yourself.' };
  const [profile] = useSessionProfile(preview ? 'preview:sarah' : user?.id ?? 'signed-out', initial);
  const [filter, setFilter] = useState<Filter>('Posts');
  const [panel, setPanel] = useState<Panel>(null);
  const [photo, setPhoto] = useState<ProfilePhoto | null>(null);
  const [saved, setSaved] = useSessionSaved();
  const [unread, setUnread] = useState(preview ? 3 : 0);
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const [following, setFollowing] = useState<string[]>([]);
  const photos = preview ? profilePhotos : [];
  const savedPhotos: ProfilePhoto[] = [...photos, ...explorePosts.filter(item => !photos.some(photo => photo.id === item.id))];
  const visiblePhotos = filter === 'Saved' ? savedPhotos.filter(item => saved.includes(item.id)) : photos.filter(item => filter === 'Posts' || (filter === 'Reels' && item.kind === 'video') || (filter === 'Tagged' && item.tagged));
  function open(next: Panel) { setNotice(''); setPanel(next); }
  async function logout() {
    setBusy(true);
    try { await signOut(); } catch { setNotice('Could not sign out. Please try again.'); } finally { setBusy(false); }
  }
  return <TabScreen><View style={[styles.screen, { paddingTop: insets.top }]}>
    <View style={{ width: contentWidth, alignSelf: 'center', flex: 1 }}>
      <View style={styles.header}>
        <BrandIcon size={34} /><Text style={styles.brand}>Codexgram</Text>
        <Pressable accessibilityRole="button" accessibilityLabel="Notifications" onPress={() => open('notifications')} style={styles.iconButton}>
          <Ionicons name="notifications-outline" size={26} color="#121829" />
          {unread > 0 && <View style={styles.badge}><Text style={styles.badgeText}>{unread}</Text></View>}
        </Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel="Profile settings" onPress={() => open('settings')} style={styles.iconButton}><Ionicons name="settings-outline" size={27} color="#121829" /></Pressable>
      </View>
      <ScrollView ref={scroll} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 8 }}>
        <View style={styles.identity}>
          <View style={styles.avatarWrap}>
            <View style={{ width: 116, height: 116, borderRadius: 58, overflow: 'hidden' }}><Image source={profile.photo || (preview ? homeImages.lake : user?.imageUrl || homeImages.sarah)} contentFit="cover" contentPosition={{ right: '24%' }} style={preview && !profile.photo ? { width: 174, height: 174, left: -38, top: -15 } : styles.avatar} /></View>
            <Pressable accessibilityRole="button" accessibilityLabel="Add profile story" onPress={() => open('story')} style={styles.addStory}><Ionicons name="add" size={28} color="#fff" /></Pressable>
          </View>
          <View style={styles.identityCopy}>
            <Text accessibilityRole="header" style={styles.username}>{profile.username}</Text>
            <Text style={styles.name}>{profile.name}</Text>
            {!!profile.location && <View style={styles.location}><Ionicons name="location-outline" size={15} color="#838ba6" /><Text style={styles.locationText}>{profile.location}</Text></View>}
            <Text style={styles.bio}>{profile.bio}</Text>
            {!!profile.website && <Text selectable style={{ color: '#1677ff', fontFamily: 'Inter_400Regular', fontSize: 12, marginTop: 4 }}>{profile.website}</Text>}
          </View>
        </View>
        <View style={styles.stats}>
          {[['Posts', preview ? '142' : '0'], ['Followers', preview ? '2.8K' : '0'], ['Following', preview ? String(612 + following.length) : String(following.length)]].map(([label, value], index) => <Pressable key={label} accessibilityRole="button" accessibilityLabel={`${value} ${label}`} onPress={() => label === 'Posts' ? (setFilter('Posts'), scroll.current?.scrollTo({ y: 285, animated: true })) : open('people')} style={styles.stat}>{index > 0 && <View style={styles.divider} />}<Text style={styles.statValue}>{value}</Text><Text style={styles.statLabel}>{label}</Text></Pressable>)}
        </View>
        <View style={styles.buttons}>
          <Pressable accessibilityRole="button" onPress={() => router.push(preview ? '/edit-profile-preview' : '/edit-profile')} style={styles.edit}><Text style={styles.editText}>Edit Profile</Text></Pressable>
          <Pressable accessibilityRole="button" accessibilityLabel="Discover people" onPress={() => open('people')} style={styles.discover}><Ionicons name="person-add-outline" size={24} color="#172033" /></Pressable>
        </View>
        <View accessibilityRole="tablist" style={styles.filters}>
          {filters.map(item => <Pressable key={item.name} accessibilityRole="tab" accessibilityLabel={`${item.name} grid`} accessibilityState={{ selected: filter === item.name }} onPress={() => setFilter(item.name)} style={styles.filter}><MaterialCommunityIcons name={item.name === 'Posts' ? 'apps' : item.name === 'Reels' ? 'movie-play-outline' : item.name === 'Saved' ? 'bookmark-outline' : 'account-box-outline'} size={25} color={filter === item.name ? '#187bff' : '#555e78'} />{filter === item.name && <View style={styles.indicator} />}</Pressable>)}
        </View>
        <View style={styles.grid}>
          {visiblePhotos.map(item => <Pressable key={item.id} accessibilityRole="button" accessibilityLabel={`Open ${item.title}`} onPress={() => setPhoto(item)} style={{ width: tileWidth, height: tileWidth * 0.95, borderRadius: 10, overflow: 'hidden' }}>
            <Image source={item.source} contentFit="cover" style={StyleSheet.absoluteFill} />
            {!!item.kind && <Ionicons name={item.kind === 'video' ? 'videocam' : 'copy'} size={20} color="#fff" style={styles.mediaBadge} />}
          </Pressable>)}
        </View>
        {visiblePhotos.length === 0 && <View style={styles.empty}><Ionicons name={filters.find(item => item.name === filter)!.icon} size={32} color="#838ba6" /><Text style={styles.emptyTitle}>{filter === 'Posts' ? 'Your moments start here' : `No ${filter.toLowerCase()} yet`}</Text><Text style={styles.helper}>{preview ? 'Photos you save will appear in Saved.' : 'Your profile is ready. Posts will appear here when sharing is connected.'}</Text></View>}
      </ScrollView>
    </View>
    <FeedSheet visible={panel !== null} title={panel === 'settings' ? 'Settings' : panel === 'notifications' ? 'Notifications' : panel === 'story' ? 'Your story' : 'Discover people'} onClose={() => setPanel(null)}>
      {panel === 'settings' && <>
        <Text style={styles.helper}>{preview ? 'You are viewing Sarah’s reference profile with demo posts.' : 'Your account is connected. Profile edits are currently session-only.'}</Text>
        {!preview && <Pressable accessibilityRole="button" disabled={busy} onPress={logout} style={styles.row}><Ionicons name="log-out-outline" size={24} /><Text style={styles.body}>{busy ? 'Signing out…' : 'Sign out'}</Text></Pressable>}
        {preview && <Text style={styles.body}>Sign in to manage your account.</Text>}
      </>}
      {panel === 'notifications' && <>
        {preview ? <>{['alexwong liked your photo.', 'maya.b started following you.', 'taylor.b mentioned you in a moment.'].map(text => <Text key={text} style={[styles.body, styles.notification]}>{text}</Text>)}<Pressable accessibilityRole="button" onPress={() => { setUnread(0); setNotice('All notifications marked as read.'); }} style={styles.edit}><Text style={styles.editText}>Mark all as read</Text></Pressable></> : <Text style={styles.helper}>You’re all caught up.</Text>}
      </>}
      {panel === 'people' && <>
        <Text style={styles.helper}>Suggested people in this preview. Follows stay in this session.</Text>
        {['alexwong', 'maya.b', 'taylor.b'].map((name, index) => <View key={name} style={styles.row}><Image source={index === 0 ? homeImages.alex : homeImages.sarah} style={{ width: 42, height: 42, borderRadius: 21 }} /><Text style={[styles.body, { flex: 1 }]}>{name}</Text><Pressable accessibilityRole="button" accessibilityLabel={`${following.includes(name) ? 'Unfollow' : 'Follow'} ${name}`} onPress={() => setFollowing(current => current.includes(name) ? current.filter(item => item !== name) : [...current, name])} style={styles.follow}><Text style={{ color: '#1677ff', fontFamily: 'Inter_600SemiBold' }}>{following.includes(name) ? 'Following' : 'Follow'}</Text></Pressable></View>)}
      </>}
      {panel === 'story' && <><Image source={homeImages.lake} style={{ width: '100%', aspectRatio: 0.85, borderRadius: 16 }} /><Text style={styles.helper}>Preview story. Publishing stories will be available when sharing is connected.</Text></>}
      {!!notice && <Text accessibilityRole="alert" style={styles.helper}>{notice}</Text>}
    </FeedSheet>
    <FeedSheet visible={photo !== null} title={photo?.title ?? 'Moment'} onClose={() => setPhoto(null)}>
      {photo && <><Image source={photo.source} contentFit="cover" style={{ width: '100%', aspectRatio: 1, borderRadius: 14 }} /><Pressable accessibilityRole="button" accessibilityLabel={saved.includes(photo.id) ? 'Unsave moment' : 'Save moment'} onPress={() => setSaved(current => current.includes(photo.id) ? current.filter(id => id !== photo.id) : [...current, photo.id])} style={styles.row}><Ionicons name={saved.includes(photo.id) ? 'bookmark' : 'bookmark-outline'} size={24} color="#1677ff" /><Text style={styles.body}>{saved.includes(photo.id) ? 'Saved' : 'Save moment'}</Text></Pressable>{photo.kind === 'video' && <Text style={styles.helper}>Video cover preview. No video file is attached.</Text>}</>}
    </FeedSheet>
  </View></TabScreen>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fcfdff' },
  header: { height: 64, paddingBottom: 8, paddingHorizontal: 17, flexDirection: 'row', alignItems: 'center', gap: 9 },
  brand: { fontFamily: 'Inter_700Bold', fontSize: 23, letterSpacing: -1.1, color: '#080a13', flex: 1 },
  iconButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  badge: { position: 'absolute', top: 3, right: 3, backgroundColor: '#ff102a', width: 19, height: 19, borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: '#fff' },
  badgeText: { fontFamily: 'Inter_600SemiBold', color: '#fff', fontSize: 11 },
  identity: { paddingHorizontal: 17, flexDirection: 'row', gap: 17, minHeight: 122, paddingTop: 4, alignItems: 'center' },
  avatarWrap: { width: 116, height: 116 },
  avatar: { width: 116, height: 116, borderRadius: 58 },
  addStory: { width: 36, height: 36, borderRadius: 18, borderWidth: 3, borderColor: '#fff', backgroundColor: '#1677ff', position: 'absolute', bottom: 3, right: -1, alignItems: 'center', justifyContent: 'center' },
  identityCopy: { flex: 1 },
  username: { fontFamily: 'Inter_700Bold', fontSize: 20, lineHeight: 25, letterSpacing: -0.65, color: '#090c16' },
  name: { fontFamily: 'Inter_400Regular', fontSize: 13, lineHeight: 20, color: '#838ba6' },
  location: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 3 },
  locationText: { fontFamily: 'Inter_400Regular', fontSize: 11.5, color: '#838ba6', flexShrink: 1 },
  bio: { fontFamily: 'Inter_400Regular', fontSize: 12.5, lineHeight: 17, color: '#353c61', marginTop: 10, letterSpacing: -0.2 },
  stats: { flexDirection: 'row', marginTop: 5, height: 49, alignItems: 'center', marginHorizontal: 10 },
  stat: { flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: 44 },
  divider: { position: 'absolute', left: 0, width: 1, height: 28, backgroundColor: '#dce3ef' },
  statValue: { fontFamily: 'Inter_700Bold', fontSize: 17, lineHeight: 23, letterSpacing: -0.5, color: '#0a0d17' },
  statLabel: { fontFamily: 'Inter_400Regular', color: '#838ba6', fontSize: 12, lineHeight: 18 },
  buttons: { flexDirection: 'row', gap: 12, marginHorizontal: 17, marginTop: 9 },
  edit: { backgroundColor: '#1677ff', minHeight: 42, borderRadius: 9, alignItems: 'center', justifyContent: 'center', flexGrow: 1, paddingHorizontal: 16 },
  editText: { fontFamily: 'Inter_600SemiBold', color: '#fff', fontSize: 15 },
  discover: { width: 50, height: 42, borderRadius: 9, backgroundColor: '#f1f4fa', borderWidth: 1, borderColor: '#e0e6f0', alignItems: 'center', justifyContent: 'center' },
  filters: { flexDirection: 'row', height: 47, marginTop: 10, marginBottom: 4 },
  filter: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  indicator: { position: 'absolute', height: 2.5, bottom: 1, width: 57, borderRadius: 2, backgroundColor: '#1677ff' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 3, paddingHorizontal: 4 },
  mediaBadge: { position: 'absolute', top: 8, right: 8 },
  empty: { alignItems: 'center', padding: 30, gap: 12 },
  emptyTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 18, color: '#303951' },
  helper: { fontFamily: 'Inter_400Regular', fontSize: 13, lineHeight: 20, color: '#838ba6', marginVertical: 14 },
  body: { fontFamily: 'Inter_400Regular', fontSize: 15, lineHeight: 22, color: '#172033' },
  fieldLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: '#353c61', marginTop: 12, marginBottom: 5 },
  input: { fontFamily: 'Inter_400Regular', fontSize: 15, color: '#172033', padding: 12, minHeight: 46, borderWidth: 1, borderColor: '#dce3ef', borderRadius: 10 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 55, paddingVertical: 8 },
  follow: { padding: 10, borderRadius: 9, backgroundColor: '#eef5ff' },
  notification: { paddingVertical: 18, borderBottomWidth: 1, borderColor: '#eef1f6' },
});
