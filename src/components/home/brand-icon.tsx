import { Image } from 'expo-image';
import { View } from 'react-native';

export function BrandIcon({ size = 44 }: { size?: number }) {
  return <View style={{ width: size, height: size, overflow: 'hidden', borderRadius: size * 0.22 }}>
    <Image source={require('../../../assets/images/auth-camera.png')} contentFit="fill" style={{ position: 'absolute', width: size * 1.5, height: size * 1.5 * 1199 / 1312, left: -size * 0.25, top: -size * 0.188 }} />
  </View>;
}
