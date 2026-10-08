import type { ImageSource } from 'expo-image';

export type FeedPost = {
  id: string; username: string; location: string; time: string; avatar: ImageSource;
  media: ImageSource[]; kind: 'photo' | 'video'; caption: string; description: string;
  likes: number; comments: number; verified: boolean;
};
export const homeImages = {
  lake: require('../../assets/images/home/lake-como.png'),
  coast: require('../../assets/images/home/amalfi-coast.png'),
  sarah: require('../../assets/images/home/sarah-avatar.png'),
  alex: require('../../assets/images/home/alex-avatar.png'),
};
// Reference fixtures only. Never use these records as real membership or API data.
export const demoPosts: FeedPost[] = [
  { id: 'sarah-como', username: 'sarah.chen', location: 'Lake Como, Italy', time: '2h ago', avatar: homeImages.sarah,
    media: [homeImages.lake, homeImages.coast, require('../../assets/images/auth-hero.png'), require('../../assets/images/auth-demo-img.png')],
    kind: 'photo', caption: 'Golden hour with good people ✨', description: 'Real places. Real people. Better moments.', likes: 142, comments: 12, verified: true },
  { id: 'alex-amalfi', username: 'alexwong', location: 'Amalfi Coast, Italy', time: '5h ago', avatar: homeImages.alex,
    media: [homeImages.coast], kind: 'video', caption: 'This place is incredible!', description: 'Grateful for these moments with amazing people.', likes: 312, comments: 28, verified: true },
];
