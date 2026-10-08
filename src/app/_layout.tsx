import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Stack, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { Inter_400Regular } from "@expo-google-fonts/inter/400Regular";
import { Inter_600SemiBold } from "@expo-google-fonts/inter/600SemiBold";
import { Inter_700Bold } from "@expo-google-fonts/inter/700Bold";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { ClerkProvider, useAuth } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { Text, View } from "react-native";
import { AuthLoading } from "@/components/auth/auth-loading";
import "../global.css";

void SplashScreen.preventAutoHideAsync();
const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

function AuthenticatedRoutes() {
  const { isLoaded, isSignedIn } = useAuth();
  const segments = useSegments();
  const isPreview = __DEV__ && (segments[0] === "preview" || segments[0] === "edit-profile-preview" || segments[0] === "chat-preview" || segments[0] === "comments-preview");
  if (!isLoaded && !isPreview) return <AuthLoading />;
  return <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "#fbfcfe" } }}>
    <Stack.Screen name="index" />
    <Stack.Screen name="sso-callback" />
    <Stack.Protected guard={!!isSignedIn}>
      <Stack.Screen name="(tabs)" /><Stack.Screen name="account" /><Stack.Screen name="edit-profile" /><Stack.Screen name="chat" />
    </Stack.Protected>
    <Stack.Protected guard={__DEV__}><Stack.Screen name="preview" /><Stack.Screen name="edit-profile-preview" /><Stack.Screen name="chat-preview" /><Stack.Screen name="comments-preview" /></Stack.Protected>
  </Stack>;
}

export default function RootLayout() {
  const [loaded, error] = useFonts({ Inter_400Regular, Inter_600SemiBold, Inter_700Bold, ...FontAwesome.font, ...Ionicons.font, ...MaterialIcons.font, ...MaterialCommunityIcons.font });
  useEffect(() => {
    if (loaded || error) void SplashScreen.hideAsync();
  }, [loaded, error]);
  if (!loaded && !error) return null;
  if (!publishableKey) return <View className="flex-1 items-center justify-center bg-canvas px-6">
    <Text className="font-bold text-ink text-xl">Authentication needs configuration</Text>
    <Text className="mt-4 font-regular text-muted">Set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in .env and restart Expo.</Text>
  </View>;
  return <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
    <StatusBar style="dark" /><AuthenticatedRoutes />
  </ClerkProvider>;
}
