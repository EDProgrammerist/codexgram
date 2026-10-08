import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import { useUser } from '@clerk/expo';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSessionProfile, type ProfileDetails } from '@/hooks/use-session-profile';
import { homeImages } from '@/data/demo-feed';

const example: ProfileDetails = { username: 'alex.rivera', name: 'Alex Rivera', bio: 'Product designer, coffee lover.\nExploring what’s next. ☕ 🌎', website: 'https://alexrivera.co', location: 'San Francisco, CA' };
const sarah: ProfileDetails = { username: 'sarah.chen', name: 'Sarah Chen', bio: 'Golden hour enthusiast. Capturing real moments, closer connections. ✨', location: 'Lake Como, Italy', website: '' };
const fields = [
  { key: 'username', label: 'Username', icon: 'at-outline', helper: 'This is how people find you on Codexgram.' },
  { key: 'name', label: 'Display Name', icon: 'person-outline', helper: 'This is your public name.' },
  { key: 'bio', label: 'Bio', icon: 'text-outline' },
  { key: 'website', label: 'Website', icon: 'link-outline' },
  { key: 'location', label: 'Location', icon: 'location-outline' },
] as const;

export function EditProfileScreen({ preview = false }: { preview?: boolean }) {
  const { user } = useUser();
  const { example: exampleParam } = useLocalSearchParams<{ example?: string }>();
  const reference = preview && exampleParam === 'reference';
  const insets = useSafeAreaInsets();
  const key = preview ? reference ? 'preview:reference' : 'preview:sarah' : user?.id ?? 'signed-out';
  const initial: ProfileDetails = preview ? reference ? example : sarah : { username: user?.username || user?.firstName?.toLowerCase() || 'your.profile', name: user?.fullName || 'Your name', bio: 'Share a little about yourself.', location: '', website: '' };
  const [profile, saveProfile] = useSessionProfile(key, initial);
  const [draft, setDraft] = useState<ProfileDetails>(profile);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  function back() { if (router.canGoBack()) router.back(); else router.replace(preview ? '/preview/profile' : '/(tabs)/profile'); }
  function save() {
    setError('');setNotice('');
    if (!/^[a-zA-Z0-9._]{3,30}$/.test(draft.username.trim())) { setError('Username must be 3–30 letters, numbers, dots or underscores.'); return; }
    if (!draft.name.trim()) { setError('Please enter your display name.'); return; }
    if (Array.from(draft.bio).length > 150) { setError('Keep your bio to 150 characters.'); return; }
    if (draft.website?.trim()) {
      try { const url = new URL(draft.website.trim()); if (!['http:', 'https:'].includes(url.protocol) || !url.hostname.includes('.')) throw new Error(); }
      catch { setError('Enter a full website address starting with https:// or http://.'); return; }
    }
    saveProfile({ ...draft, username: draft.username.trim(), name: draft.name.trim(), website: draft.website?.trim(), location: draft.location.trim() });
    if (reference) setNotice('Changes saved for this session.'); else back();
  }
  async function pickPhoto() {
    setError(''); setNotice('');
    try {
      const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 1 });
      if (result.canceled) return;
      const asset = result.assets[0];
      const mime = asset.mimeType?.toLowerCase();
      const name = asset.fileName || asset.uri.split('?')[0];
      if (mime ? !['image/jpeg', 'image/png'].includes(mime) : !/\.(jpe?g|png)$/i.test(name)) { setError('Choose a JPG or PNG image.'); return; }
      if (asset.fileSize == null || asset.fileSize > 5 * 1024 * 1024) { setError(asset.fileSize == null ? 'Could not verify image size. Please choose another JPG or PNG.' : 'Choose an image smaller than 5MB.'); return; }
      setDraft(current => ({ ...current, photo: asset.uri }));
    } catch { setError('Could not open your photos. Please try again.'); }
  }
  return <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={[styles.screen, { paddingTop: insets.top }]}>
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable accessibilityRole="button" accessibilityLabel="Back to profile" onPress={back} style={styles.back}><Ionicons name="chevron-back" size={26} color="#0e1533" /></Pressable>
        <Text accessibilityRole="header" style={styles.title}>Edit Profile</Text>
        <Pressable accessibilityRole="button" accessibilityLabel="Save profile" onPress={save} style={styles.topSave}><Text style={styles.buttonText}>Save</Text></Pressable>
      </View>
      <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: Math.max(insets.bottom, 10) }}>
        <View style={styles.photoSection}>
          <Pressable accessibilityRole="button" accessibilityLabel="Change profile photo" onPress={pickPhoto} style={styles.portrait}>
            <Image source={draft.photo || (preview ? reference ? require('../../../assets/images/profile/edit-avatar.png') : homeImages.lake : user?.imageUrl || homeImages.alex)} style={styles.avatar} contentFit="cover" />
            <View style={styles.camera}><Ionicons name="camera-outline" size={26} color="#fff" /></View>
          </Pressable>
          <Pressable accessibilityRole="button" onPress={pickPhoto} style={styles.changePhoto}><Text style={styles.changeText}>Change Photo</Text></Pressable>
          <Text style={styles.photoHelp}>JPG, PNG up to 5MB</Text>
        </View>
        {fields.map(field => <View key={field.key} style={styles.field}>
          <Text style={styles.label}>{field.label}</Text>
          <View style={[styles.inputWrap, field.key === 'bio' && styles.bioWrap]}>
            <MaterialCommunityIcons name={field.key === 'bio' ? 'text-short' : field.key === 'website' ? 'link-variant' : field.key === 'username' ? 'at' : field.key === 'name' ? 'account-outline' : 'map-marker-outline'} size={23} color="#647188" style={field.key === 'bio' ? { marginTop: 2 } : undefined} />
            <TextInput accessibilityLabel={field.label} value={draft[field.key] ?? ''} onChangeText={value => { setDraft(current => ({ ...current, [field.key]: field.key === 'bio' ? Array.from(value).slice(0, 150).join('') : value }));setError('');setNotice(''); }} style={[styles.input, field.key === 'bio' && styles.bio]} multiline={field.key === 'bio'} maxLength={field.key === 'bio' ? undefined : field.key === 'website' ? 200 : 50} autoCapitalize={field.key === 'username' || field.key === 'website' ? 'none' : 'sentences'} autoCorrect={field.key !== 'username' && field.key !== 'website'} keyboardType={field.key === 'website' ? 'url' : 'default'} />
            {field.key === 'bio' && <Text accessibilityLabel="Bio character count" style={styles.counter}>{Array.from(draft.bio).length}/150</Text>}
          </View>
          {'helper' in field && <Text style={[styles.helper, field.key === 'username' && { paddingLeft: 47 }]}>{field.helper}</Text>}
        </View>)}
        {!!error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
        {!!notice && <Text accessibilityLiveRegion="polite" style={styles.notice}>{notice}</Text>}
        <Pressable accessibilityRole="button" onPress={save} style={styles.save}><Text style={styles.saveText}>Save Changes</Text></Pressable>
      </ScrollView>
    </View>
  </KeyboardAvoidingView>;
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fcfdff' }, container: { flex: 1, width: '100%', maxWidth: 520, alignSelf: 'center' },
  header: { height: 50, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  back: { width: 43, height: 43, borderRadius: 24, backgroundColor: '#f0f3f8', alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: 'Inter_700Bold', fontSize: 18, color: '#0b1030', position: 'absolute', left: 75, right: 75, textAlign: 'center' },
  topSave: { backgroundColor: '#087fff', borderRadius: 25, height: 37, minWidth: 66, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 15 },
  buttonText: { fontFamily: 'Inter_600SemiBold', color: '#fff', fontSize: 15 },
  photoSection: { alignItems: 'center', marginTop: 4, marginBottom: 8 },
  portrait: { width: 140, height: 136 }, avatar: { width: 140, height: 136, borderRadius: 70 },
  camera: { position: 'absolute', bottom: 0, right: -2, width: 43, height: 43, borderRadius: 24, borderWidth: 3, borderColor: '#fff', backgroundColor: '#087fff', alignItems: 'center', justifyContent: 'center' },
  changePhoto: { minHeight: 22, marginTop: 5, justifyContent: 'center' }, changeText: { color: '#087fff', fontFamily: 'Inter_600SemiBold', fontSize: 14 }, photoHelp: { color: '#838da5', fontFamily: 'Inter_400Regular', fontSize: 11, lineHeight: 17 },
  field: { marginBottom: 13 }, label: { color: '#6c778d', fontFamily: 'Inter_600SemiBold', fontSize: 13, lineHeight: 18, marginBottom: 5, marginLeft: 2 },
  inputWrap: { minHeight: 45, borderWidth: 1, borderColor: '#e0e6ef', backgroundColor: '#f3f6f9', borderRadius: 15, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 20 },
  input: { flex: 1, fontFamily: 'Inter_400Regular', fontSize: 16, lineHeight: 21, color: '#0b1030', paddingVertical: 9, minWidth: 0 },
  bioWrap: { minHeight: 67, alignItems: 'flex-start', paddingTop: 9, paddingBottom: 13 }, bio: { paddingVertical: 0, minHeight: 42, textAlignVertical: 'top', paddingRight: 0 },
  counter: { position: 'absolute', bottom: 8, right: 13, fontFamily: 'Inter_400Regular', fontSize: 11, color: '#838da5' },
  helper: { fontFamily: 'Inter_400Regular', fontSize: 11, lineHeight: 17, color: '#838da5', paddingLeft: 16, marginTop: 4, marginBottom: 0 },
  save: { height: 45, backgroundColor: '#087fff', borderRadius: 26, alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  saveText: { fontFamily: 'Inter_600SemiBold', color: '#fff', fontSize: 16 },
  error: { color: '#c3162b', fontFamily: 'Inter_400Regular', fontSize: 13, lineHeight: 19, marginBottom: 10 }, notice: { color: '#16734b', fontFamily: 'Inter_400Regular', fontSize: 13, lineHeight: 19, marginBottom: 10 },
});
