import { TabScreen } from '@/components/home/tab-screen';
import { useClerk, useUser } from "@clerk/expo";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Account() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function handleSignOut() {
    if (busy) return;
    setBusy(true);
    setError(null);
    try { await signOut(); }
    catch { setError("Could not sign out. Check your connection and try again."); }
    finally { setBusy(false); }
  }
  return <TabScreen><SafeAreaView edges={['top', 'left', 'right']} className="flex-1 bg-canvas">
    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: 28 }}>
      <View className="w-full max-w-md self-center">
        <Text className="font-bold text-ink text-3xl">You’re signed in</Text>
        <Text className="mt-4 font-regular text-muted text-base">Welcome{user?.firstName ? `, ${user.firstName}` : ""}.</Text>
        <Text selectable className="mt-2 font-semibold text-ink text-base">{user?.primaryEmailAddress?.emailAddress}</Text>
        <Text className="mt-6 font-regular text-muted text-base leading-6">Your account is connected. Codexgram’s private community is still being prepared.</Text>
        {error && <Text accessibilityRole="alert" className="mt-4 font-regular text-red-700">{error}</Text>}
        <Pressable accessibilityRole="button" accessibilityState={{ disabled: busy, busy }} disabled={busy} onPress={handleSignOut} className="mt-8 items-center rounded-2xl bg-ink p-4 active:opacity-70">
          <Text className="font-semibold text-white text-base">{busy ? "Signing out…" : "Sign out"}</Text>
        </Pressable>
      </View>
    </ScrollView>
  </SafeAreaView></TabScreen>;
}
