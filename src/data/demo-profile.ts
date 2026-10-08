import { homeImages } from './demo-feed';

export type ProfilePhoto = { id: string; title: string; source: number; kind?: 'album' | 'video'; saved?: boolean; tagged?: boolean };
// Reference fixtures for the development profile preview only.
export const profilePhotos: ProfilePhoto[] = [
  { id: 'sunset', title: 'Golden hour at Lake Como', source: homeImages.lake, kind: 'album', tagged: true },
  { id: 'lake', title: 'A day by the lake', source: require('../../assets/images/profile/lake-villa.png'), saved: true },
  { id: 'coffee', title: 'Coffee by the lake', source: require('../../assets/images/profile/coffee.png'), saved: true },
  { id: 'street', title: 'Wandering through Italy', source: require('../../assets/images/profile/street.png') },
  { id: 'hat', title: 'A view worth remembering', source: require('../../assets/images/profile/hat.png'), kind: 'album', tagged: true },
  { id: 'boat', title: 'A little blue escape', source: require('../../assets/images/profile/boat.png') },
  { id: 'dog', title: 'My golden hour companion', source: require('../../assets/images/profile/dog.png'), kind: 'video' },
  { id: 'twilight', title: 'Evening on Lake Como', source: require('../../assets/images/profile/twilight.png') },
  { id: 'terrace', title: 'Flowers on the terrace', source: require('../../assets/images/profile/terrace.png'), kind: 'album' },
];
