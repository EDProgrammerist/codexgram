import { homeImages } from './demo-feed';
export type ExplorePerson = { name: string; category: string; avatar: number; followers?: string; cover?: number };
export const suggestedPeople: ExplorePerson[] = [
  { name: 'sarah.chen', category: 'Travel & Lifestyle', avatar: homeImages.lake },
  { name: 'alexwong', category: 'Adventure', avatar: homeImages.alex },
  { name: 'emma.ross', category: 'Food & Travel', avatar: require('../../assets/images/explore/emma.png') },
  { name: 'daniel.kim', category: 'Photography', avatar: require('../../assets/images/explore/daniel.png') },
  { name: 'olivia.martin', category: 'Lifestyle', avatar: homeImages.lake },
];
export const trendingCreators: ExplorePerson[] = [
  { name: 'sophia.travel', category: 'Travel', avatar: homeImages.sarah, followers: '124K', cover: homeImages.coast },
  { name: 'marco.explores', category: 'Adventure', avatar: homeImages.alex, followers: '89K', cover: require('../../assets/images/explore/alpine.png') },
  { name: 'lilyadventures', category: 'Travel', avatar: homeImages.sarah, followers: '312K', cover: require('../../assets/images/explore/santorini.png') },
];
export const topics = ['For You', 'Travel', 'Lifestyle', 'Photography', 'Food', 'Nature', 'People'] as const;
export type ExplorePost = { id: string; title: string; location: string; source: number; topics: string[] };
// Local discovery fixtures until the social backend is connected.
export const explorePosts: ExplorePost[] = [
  { id: 'coast', title: 'A day on the Amalfi Coast', location: 'Amalfi Coast, Italy', source: homeImages.coast, topics: ['Travel', 'Photography'] },
  { id: 'sunset', title: 'Golden hour at Lake Como', location: 'Lake Como, Italy', source: homeImages.lake, topics: ['Lifestyle', 'People', 'Photography'] },
  { id: 'coffee', title: 'Coffee with a view', location: 'Lake Como, Italy', source: require('../../assets/images/profile/coffee.png'), topics: ['Food', 'Lifestyle'] },
  { id: 'dog', title: 'My golden hour companion', location: 'Lake Como, Italy', source: require('../../assets/images/profile/dog.png'), topics: ['Nature', 'Lifestyle'] },
  { id: 'boat', title: 'A little blue escape', location: 'Mediterranean Sea', source: require('../../assets/images/profile/boat.png'), topics: ['Travel', 'Nature'] },
  { id: 'street', title: 'Wandering through Italy', location: 'Italy', source: require('../../assets/images/profile/street.png'), topics: ['Travel', 'Photography'] },
  { id: 'friends', title: 'Better moments together', location: 'Lake Como, Italy', source: require('../../assets/images/auth-hero.png'), topics: ['People', 'Lifestyle'] },
  { id: 'hat', title: 'A view worth remembering', location: 'Lake Como, Italy', source: require('../../assets/images/profile/hat.png'), topics: ['Travel', 'People'] },
  { id: 'villa', title: 'Lakeside dreaming', location: 'Lake Como, Italy', source: require('../../assets/images/profile/lake-villa.png'), topics: ['Nature', 'Travel'] },
];
