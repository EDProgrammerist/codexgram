import * as WebBrowser from "expo-web-browser";
import { useAuth } from "@clerk/expo";
import { Link, Redirect } from "expo-router";
import { useEffect } from "react";
import { Text, View } from "react-native";

export default function SSOCallback() {
  const { isSignedIn } = useAuth();
  useEffect(() => { WebBrowser.maybeCompleteAuthSession(); }, []);
  if (isSignedIn) return <Redirect href="/account" />;
  return <View className="flex-1 items-center justify-center bg-canvas px-6">
    <Text className="font-semibold text-ink text-lg">Completing sign-in…</Text>
    <Text className="mt-3 font-regular text-muted text-center">Return to the app if this window does not close automatically.</Text>
    <Link href="/" className="mt-6 p-3 font-semibold text-link">Back to Codexgram</Link>
  </View>;
}
