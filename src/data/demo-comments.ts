import { homeImages } from './demo-feed';
export type DemoComment = { id: string; username: string; avatar: number; time: string; text: string; likes: number; liked?: boolean; verified?: boolean; own?: boolean; replyTo?: string };
export const seedComments: DemoComment[] = [
  { id: 'alex', username: 'alexwong', avatar: homeImages.alex, time: '2h ago', text: 'This looks incredible! The colors are unreal. 😍', likes: 24, liked: true, verified: true },
  { id: 'jessica', username: 'jessica', avatar: require('../../assets/images/explore/emma.png'), time: '1h ago', text: 'Lake Como is always a good idea. So beautiful! 💙', likes: 8 },
  { id: 'mike', username: 'mike.tan', avatar: require('../../assets/images/explore/daniel.png'), time: '56m ago', text: 'What a vibe! Where is this exact spot? 🙏', likes: 4 },
  { id: 'emily', username: 'emily.r', avatar: homeImages.sarah, time: '32m ago', text: 'Stunning shot! Love the golden hour lighting. ✨', likes: 3 },
  { id: 'sarah', username: 'sarah.chen', avatar: homeImages.sarah, time: '12m ago', text: 'Thank you all! This place is really special. 💛', likes: 5, verified: true, own: true },
  { id: 'mia', username: 'mia.roberts', avatar: homeImages.sarah, time: '10m ago', text: 'Adding this view to my travel list.', likes: 2 },
  { id: 'james', username: 'james.k', avatar: homeImages.alex, time: '9m ago', text: 'That light on the water!', likes: 1 },
  { id: 'olivia', username: 'olivia.martin', avatar: homeImages.sarah, time: '8m ago', text: 'Such a peaceful evening.', likes: 2 },
  { id: 'daniel', username: 'daniel.kim', avatar: require('../../assets/images/explore/daniel.png'), time: '7m ago', text: 'A perfect place for photos.', likes: 1 },
  { id: 'emma', username: 'emma.ross', avatar: require('../../assets/images/explore/emma.png'), time: '5m ago', text: 'Would love to visit someday.', likes: 0 },
  { id: 'marco', username: 'marco.explores', avatar: homeImages.alex, time: '3m ago', text: 'The mountains look amazing.', likes: 0 },
  { id: 'lily', username: 'lilyadventures', avatar: homeImages.sarah, time: '1m ago', text: 'Thanks for sharing this moment.', likes: 0 },
];
