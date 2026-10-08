import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { homeImages } from '@/data/demo-feed';
import { BrandIcon } from './brand-icon';
import { FeedSheet } from './feed-sheet';

const stories = [
  { name: 'alex.rivera', avatar: homeImages.alex, photo: homeImages.coast },
  { name: 'maya.b', avatar: homeImages.sarah, photo: homeImages.lake },
  { name: 'jordan.k', avatar: homeImages.alex, photo: homeImages.coast },
  { name: 'taylor.b', avatar: homeImages.sarah, photo: homeImages.lake },
  { name: 'casey.dev', avatar: homeImages.coast, photo: homeImages.coast },
];

export function HomeHeader({ onCreate }: { onCreate: () => void }) {
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState('');
  const [addingStory, setAddingStory] = useState(false);
  const [ownStory, setOwnStory] = useState<(typeof stories)[number] | null>(null);
  const [story, setStory] = useState<(typeof stories)[number] | null>(null);
  return <View style={styles.container}>
    <View style={styles.toolbar}>
      <BrandIcon size={36} />
      <Text accessibilityRole="header" style={styles.title}>Codexgram</Text>
      <Pressable accessibilityRole="button" accessibilityLabel="Search people" onPress={() => { setQuery(''); setSearching(true); }} style={styles.search}>
        <Ionicons name="search-outline" size={23} color="#202d3b" />
      </Pressable>
      <Pressable accessibilityRole="button" accessibilityLabel="Create post" onPress={onCreate} style={styles.add}>
        <Ionicons name="add" size={27} color="#4097dc" />
      </Pressable>
    </View>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.stories}>
      <Pressable accessibilityRole="button" accessibilityLabel={ownStory ? 'View your story' : 'Add your story'} onPress={() => ownStory ? setStory(ownStory) : setAddingStory(true)} style={styles.story}>
        {ownStory ? <View style={styles.ring}><Image source={ownStory.photo} style={styles.avatar} /></View> : <View style={styles.yourStory}><Ionicons name="add" size={27} color="#4097dc" /></View>}
        <Text style={styles.label}>Your story</Text>
      </Pressable>
      {stories.map(item => <Pressable key={item.name} accessibilityRole="button" accessibilityLabel={`View ${item.name}'s story`} onPress={() => setStory(item)} style={styles.story}>
        <View style={styles.ring}><Image source={item.avatar} contentFit="cover" style={styles.avatar} /></View>
        <Text numberOfLines={1} style={styles.label}>{item.name}</Text>
      </Pressable>)}
    </ScrollView>
    <FeedSheet visible={addingStory} title="Your story" onClose={() => setAddingStory(false)}>
      <Text style={styles.note}>Choose a photo for a session-only preview story.</Text>
      {stories.slice(0, 2).map(item => <Pressable key={item.name} accessibilityRole="button" accessibilityLabel={`Share ${item.name === 'alex.rivera' ? 'coast' : 'lake'} preview story`} onPress={() => { setOwnStory({ ...item, name: 'Your story' }); setAddingStory(false); }} style={styles.result}>
        <Image source={item.photo} style={{ width: 80, height: 60, borderRadius: 10 }} /><Text style={styles.resultName}>{item.name === 'alex.rivera' ? 'Amalfi Coast' : 'Lake Como'}</Text>
      </Pressable>)}
    </FeedSheet>
    <FeedSheet visible={searching} title="Search people" onClose={() => setSearching(false)}>
      <TextInput accessibilityLabel="Search preview people" autoFocus value={query} onChangeText={setQuery} placeholder="Search people" autoCapitalize="none" style={styles.input} />
      {stories.filter(item => item.name.includes(query.trim().toLowerCase())).map(item => <Pressable key={item.name} accessibilityRole="button" onPress={() => { setSearching(false); setStory(item); }} style={styles.result}>
        <Image source={item.avatar} style={styles.avatar} /><Text style={styles.resultName}>{item.name}</Text>
      </Pressable>)}
      {!stories.some(item => item.name.includes(query.trim().toLowerCase())) && <Text style={styles.note}>No people found.</Text>}
      <Text style={styles.note}>Preview people and stories.</Text>
    </FeedSheet>
    <FeedSheet visible={story !== null} title={story?.name ?? 'Story'} onClose={() => setStory(null)}>
      {story && <Image source={story.photo} contentFit="cover" style={{ width: '100%', aspectRatio: 0.8, borderRadius: 16 }} />}
      <Text style={styles.note}>Preview story</Text>
    </FeedSheet>
  </View>;
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#fff' },
  toolbar: { flexDirection: 'row', alignItems: 'center', height: 54, paddingHorizontal: 14, gap: 9 },
  title: { flex: 1, fontFamily: 'Inter_700Bold', fontSize: 21, letterSpacing: -0.9, color: '#101318' },
  search: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  add: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#eef8fe', alignItems: 'center', justifyContent: 'center' },
  stories: { paddingHorizontal: 9, paddingTop: 3, paddingBottom: 13, gap: 7 },
  story: { width: 61, alignItems: 'center', gap: 5 },
  ring: { width: 56, height: 56, borderRadius: 28, borderWidth: 2, borderColor: '#b4daef', padding: 3, alignItems: 'center', justifyContent: 'center' },
  avatar: { width: 46, height: 46, borderRadius: 23 },
  yourStory: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#edf8fe', alignItems: 'center', justifyContent: 'center' },
  label: { fontFamily: 'Inter_400Regular', fontSize: 9, color: '#414851', lineHeight: 13 },
  input: { fontFamily: 'Inter_400Regular', padding: 14, borderRadius: 12, backgroundColor: '#f2f6fa', fontSize: 16, marginBottom: 10 },
  result: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8 },
  resultName: { fontFamily: 'Inter_600SemiBold', fontSize: 15 },
  note: { fontFamily: 'Inter_400Regular', fontSize: 13, color: '#78829c', marginVertical: 14 },
});
