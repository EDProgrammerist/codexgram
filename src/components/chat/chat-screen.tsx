import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useUser } from '@clerk/expo';
import { useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { homeImages } from '@/data/demo-feed';
import { FeedSheet } from '@/components/home/feed-sheet';
import { useLocalChat } from '@/hooks/use-local-chat';
const photos = [require('../../../assets/images/profile/twilight.png'), homeImages.coast, require('../../../assets/images/profile/terrace.png')];
type Panel = 'attach' | 'emoji' | 'audio' | 'phone' | 'video' | 'profile' | 'location' | null;

export function ChatScreen({ preview = false }: { preview?: boolean }) {
  const { user } = useUser();
  const insets = useSafeAreaInsets();
  const [messages, send] = useLocalChat(preview ? 'preview:sarah' : `${user?.id}:sarah-demo`);
  const [draft, setDraft] = useState('');
  const [attachment, setAttachment] = useState<number | null>(null);
  const [panel, setPanel] = useState<Panel>(null);
  const [photo, setPhoto] = useState<number | null>(null);
  const list = useRef<ScrollView>(null);
  const input = useRef<TextInput>(null);
  const scrollAfterSend = useRef(false);
  function back() { if (router.canGoBack()) router.back(); else router.replace(preview ? '/preview/messages' : '/(tabs)/messages'); }
  function submit() {
    if (!draft.trim() && attachment === null) return;
    scrollAfterSend.current = true;
    send({ text: draft.trim() || undefined, photo: attachment ?? undefined });setDraft('');setAttachment(null);
  }
  const time = (label: string, outgoing = false) => <View style={[styles.timeRow, outgoing && { justifyContent: 'flex-end', paddingRight: 2 }]}><Text style={styles.time}>{label}</Text>{outgoing && <Ionicons name="checkmark-done" size={17} color="#0876ff" />}</View>;
  const incoming = (text: string, label: string, narrow = false) => <View style={styles.incoming}><Image source={homeImages.sarah} style={styles.smallAvatar} /><View style={[styles.incomingBody, narrow && { maxWidth: '54%' }]}><View style={styles.receivedBubble}><Text style={styles.receivedText}>{text}</Text></View>{time(label)}</View></View>;
  const outgoing = (text: string, label?: string, narrow = false) => <View style={styles.outgoing}><View style={[styles.sentBubble, narrow && { maxWidth: '60%' }]}><Text style={styles.sentText}>{text}</Text></View>{label && time(label, true)}</View>;
  return <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={[styles.screen, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable accessibilityRole="button" accessibilityLabel="Back to messages" onPress={back} style={[styles.iconButton, { width: 50 }]}><Ionicons name="chevron-back" size={26} color="#0a1025" /></Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel="View sarah.chen profile" onPress={() => setPanel('profile')} style={styles.contact}><View><Image source={homeImages.sarah} style={styles.avatar} /><View style={styles.online} /></View><View style={{ flex: 1 }}><Text style={styles.username}>sarah.chen</Text><Text numberOfLines={1} style={styles.subtitle}>Follows you · 3 mutual friends</Text></View></Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel="Voice call" onPress={() => setPanel('phone')} style={styles.iconButton}><Ionicons name="call-outline" size={23} color="#0a1025" /></Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel="Video call" onPress={() => setPanel('video')} style={styles.iconButton}><Ionicons name="videocam-outline" size={26} color="#0a1025" /></Pressable>
      </View>
      <ScrollView ref={list} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={styles.conversation} onContentSizeChange={() => { if (scrollAfterSend.current) { list.current?.scrollToEnd({ animated: true }); scrollAfterSend.current = false; } }}>
        {incoming('Hey! 👋\nThat sunset spot you mentioned looks amazing!', '9:12 AM')}
        {outgoing('It really is! You have to check it out sometime. Here are a few photos from last weekend.', '9:15 AM')}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.photos}>{photos.map((source, index) => <Pressable key={index} accessibilityRole="button" accessibilityLabel={`Open shared photo ${index + 1}`} onPress={() => setPhoto(source)} style={styles.photo}><Image source={source} contentFit="cover" style={StyleSheet.absoluteFill} />{index === 0 && <Text style={styles.hd}>HD</Text>}</Pressable>)}</ScrollView>
        {incoming('Wow 😍 this looks incredible!\nWhere exactly is this?', '9:18 AM')}
        <View style={styles.outgoing}><Pressable accessibilityRole="button" accessibilityLabel="Play voice message" onPress={() => setPanel('audio')} style={styles.voice}><View style={styles.play}><Ionicons name="play" size={21} color="#0876ff" /></View><View style={{ flexDirection: 'row', alignItems: 'center' }}>{[32, 38, 32].map((size, index) => <MaterialIcons key={index} name="graphic-eq" size={size} color="#fff" />)}</View><Text style={styles.duration}>0:24</Text></Pressable>{time('9:20 AM', true)}</View>
        {incoming('That’s the exact spot I talk about! 😍', '9:21 AM', true)}
        {outgoing('Yes! We should go together next time. I’ll share the location with you. ✨', undefined, true)}
        <View style={styles.locationWrap}><Pressable accessibilityRole="button" accessibilityLabel="View Belvedere Viewpoint location" onPress={() => setPanel('location')} style={styles.location}><Image source={require('../../../assets/images/chat/map-preview.png')} style={styles.map} contentFit="cover" /><View style={{ flex: 1 }}><Text style={styles.locationTitle}>Belvedere Viewpoint</Text><Text style={styles.locationSubtitle}>Lake Como, Italy</Text></View><Ionicons name="chevron-forward" size={18} color="#838baa" /></Pressable>{time('9:25 AM', true)}</View>
        {messages.map(message => <View key={message.id} style={styles.outgoing}>{message.photo != null && <Pressable accessibilityRole="button" accessibilityLabel="Open your shared photo" onPress={() => setPhoto(message.photo!)}><Image source={message.photo} style={{ width: 190, height: 150, borderRadius: 14, marginBottom: 4 }} /></Pressable>}{!!message.text && <View style={styles.sentBubble}><Text style={styles.sentText}>{message.text}</Text></View>}<Text style={[styles.time, { textAlign: 'right', marginTop: 3 }]}>{message.time} · Local preview</Text></View>)}
      </ScrollView>
      {attachment !== null && <View style={styles.attachment}><Image source={attachment} style={{ width: 48, height: 48, borderRadius: 8 }} /><Text style={styles.helper}>Photo ready to send</Text><Pressable accessibilityRole="button" accessibilityLabel="Remove attachment" onPress={() => setAttachment(null)} style={styles.iconButton}><Ionicons name="close" size={23} /></Pressable></View>}
      <View style={styles.composer}>
        <Pressable accessibilityRole="button" accessibilityLabel="Add attachment" onPress={() => setPanel('attach')} style={styles.add}><Ionicons name="add" size={27} color="#1b2443" /></Pressable>
        <View style={styles.inputWrap}><TextInput ref={input} accessibilityLabel="Write a message" placeholder="Write a message..." placeholderTextColor="#838eac" value={draft} onChangeText={setDraft} multiline maxLength={2000} style={[styles.input, { height: Math.min(100, 20 + 19 * Math.max(1, draft.split('\n').length)) }]} /><Pressable accessibilityRole="button" accessibilityLabel="Choose emoji" onPress={() => setPanel('emoji')} style={styles.emoji}><Ionicons name="happy-outline" size={25} color="#1b2443" /></Pressable></View>
        <Pressable accessibilityRole="button" accessibilityLabel="Send message" accessibilityState={{ disabled: !draft.trim() && attachment === null }} disabled={!draft.trim() && attachment === null} onPress={submit} style={styles.send}><Ionicons name="send" size={24} color="#fff" /></Pressable>
      </View>
    </View>
    <FeedSheet visible={panel !== null} title={panel === 'attach' ? 'Share a photo' : panel === 'emoji' ? 'Add an emoji' : panel === 'profile' ? 'sarah.chen' : panel === 'location' ? 'Belvedere Viewpoint' : panel === 'audio' ? 'Voice message' : panel === 'phone' ? 'Voice call' : 'Video call'} onClose={() => setPanel(null)}>
      {panel === 'attach' && <><Text style={styles.helper}>Choose a sample photo. Messages stay in this local preview.</Text><View style={{ flexDirection: 'row', gap: 8 }}>{photos.map((source, index) => <Pressable key={index} accessibilityRole="button" accessibilityLabel={`Attach photo ${index + 1}`} onPress={() => { setAttachment(source); setPanel(null); }} style={{ flex: 1 }}><Image source={source} style={{ width: '100%', aspectRatio: 1, borderRadius: 12 }} /></Pressable>)}</View></>}
      {panel === 'emoji' && <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>{['👋', '😍', '✨', '❤️', '😊', '👍'].map(emoji => <Pressable key={emoji} accessibilityRole="button" accessibilityLabel={`Add ${emoji}`} onPress={() => { setDraft(current => (current + emoji).slice(0, 2000)); setPanel(null); input.current?.focus(); }} style={{ padding: 12 }}><Text style={{ fontSize: 28 }}>{emoji}</Text></Pressable>)}</View>}
      {panel === 'profile' && <View style={{ alignItems: 'center', gap: 12 }}><Image source={homeImages.sarah} style={{ width: 88, height: 88, borderRadius: 44 }} /><Text style={styles.username}>Sarah Chen</Text><Text style={styles.helper}>Lake Como, Italy · Preview contact</Text><Text style={styles.helper}>This is a sample conversation. New messages are saved in this session only.</Text></View>}
      {panel === 'location' && <><Image source={require('../../../assets/images/chat/map-preview.png')} style={{ width: '100%', aspectRatio: 1.7, borderRadius: 16 }} /><Text style={[styles.locationTitle, { marginTop: 16 }]}>Belvedere Viewpoint</Text><Text style={styles.helper}>Lake Como, Italy</Text><Text style={styles.helper}>Illustrative preview map. No precise coordinates were provided with the design.</Text></>}
      {panel === 'audio' && <Text style={styles.helper}>The reference includes a 24-second voice message, but no audio file. Playback will be available when audio is connected.</Text>}
      {(panel === 'phone' || panel === 'video') && <Text style={styles.helper}>Calls are not connected in this preview. No call has been placed.</Text>}
    </FeedSheet>
    <FeedSheet visible={photo !== null} title="Shared photo" onClose={() => setPhoto(null)}>{photo !== null && <Image source={photo} contentFit="contain" style={{ width: '100%', aspectRatio: 1 }} />}</FeedSheet>
  </KeyboardAvoidingView>;
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fcfdff' }, container: { width: '100%', maxWidth: 520, alignSelf: 'center', flex: 1 },
  header: { height: 60, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 7, borderBottomWidth: 1, borderColor: '#edf0f6', gap: 2 }, iconButton: { width: 40, height: 44, alignItems: 'center', justifyContent: 'center' }, contact: { flex: 1, flexDirection: 'row', gap: 11, alignItems: 'center', minWidth: 0 }, avatar: { width: 48, height: 48, borderRadius: 24 }, online: { position: 'absolute', bottom: 1, right: 0, width: 13, height: 13, borderRadius: 7, borderWidth: 2, borderColor: '#fff', backgroundColor: '#09cc62' }, username: { fontFamily: 'Inter_700Bold', fontSize: 17, letterSpacing: -0.65, color: '#0c122c' }, subtitle: { fontFamily: 'Inter_400Regular', fontSize: 11.5, lineHeight: 18, color: '#838eac' },
  conversation: { paddingTop: 7, paddingBottom: 5 }, incoming: { flexDirection: 'row', alignItems: 'flex-end', marginLeft: 13, marginRight: 14, gap: 10, marginBottom: 7 }, smallAvatar: { width: 36, height: 36, borderRadius: 18, marginBottom: 20 }, incomingBody: { maxWidth: '65%' }, receivedBubble: { backgroundColor: '#f0f3f8', borderRadius: 15, paddingHorizontal: 13, paddingVertical: 8 }, receivedText: { fontFamily: 'Inter_400Regular', color: '#101936', fontSize: 13.7, lineHeight: 18.3, letterSpacing: -0.15 },
  outgoing: { alignItems: 'flex-end', marginHorizontal: 13, marginBottom: 2 }, sentBubble: { maxWidth: '67%', borderRadius: 15, backgroundColor: '#0876ff', paddingHorizontal: 13, paddingVertical: 9 }, sentText: { fontFamily: 'Inter_400Regular', color: '#fff', fontSize: 13.7, lineHeight: 18.3, letterSpacing: -0.13 }, timeRow: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingLeft: 8, marginTop: 2, minHeight: 15 }, time: { fontFamily: 'Inter_400Regular', fontSize: 10.5, lineHeight: 15, color: '#8995b3' },
  photos: { paddingLeft: 67, paddingRight: 12, gap: 3, paddingTop: 0, paddingBottom: 8 }, photo: { width: 116, height: 112, borderRadius: 11, overflow: 'hidden' }, hd: { position: 'absolute', bottom: 7, left: 8, color: '#fff', fontSize: 10, fontFamily: 'Inter_600SemiBold', backgroundColor: '#303844', borderRadius: 5, paddingHorizontal: 5, paddingVertical: 2 },
  voice: { flexDirection: 'row', alignItems: 'center', height: 46, borderRadius: 15, backgroundColor: '#0876ff', paddingHorizontal: 15, gap: 12 }, play: { width: 31, height: 31, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }, duration: { fontFamily: 'Inter_400Regular', fontSize: 12, color: '#fff' },
  locationWrap: { alignItems: 'flex-end', marginHorizontal: 13, marginTop: 0, marginBottom: 2 }, location: { flexDirection: 'row', alignItems: 'center', gap: 8, width: '75%', backgroundColor: '#f7f9fc', borderWidth: 1, borderColor: '#e4eaf5', borderRadius: 15, padding: 4 }, map: { width: 90, height: 50, borderRadius: 10 }, locationTitle: { fontFamily: 'Inter_700Bold', fontSize: 11.5, letterSpacing: -0.4, color: '#131c35' }, locationSubtitle: { fontFamily: 'Inter_400Regular', fontSize: 10.5, lineHeight: 18, color: '#8793b2' },
  composer: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, paddingHorizontal: 11, paddingVertical: 7, backgroundColor: '#fcfdff' }, add: { width: 40, height: 40, borderRadius: 21, backgroundColor: '#f0f3f8', borderWidth: 1, borderColor: '#e0e6f0', alignItems: 'center', justifyContent: 'center' }, inputWrap: { flex: 1, flexDirection: 'row', alignItems: 'flex-end', borderWidth: 1, borderColor: '#e0e6f0', borderRadius: 23, backgroundColor: '#fff', minHeight: 41, paddingLeft: 15 }, input: { flex: 1, fontFamily: 'Inter_400Regular', fontSize: 13.5, lineHeight: 19, color: '#131c35', paddingVertical: 10, maxHeight: 100, minWidth: 0 }, emoji: { width: 37, height: 40, justifyContent: 'center', alignItems: 'center' }, send: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#0876ff', alignItems: 'center', justifyContent: 'center' }, attachment: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingTop: 8 }, helper: { fontFamily: 'Inter_400Regular', color: '#818ba6', fontSize: 14, lineHeight: 22, marginVertical: 10 },
});
