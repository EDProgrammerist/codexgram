import { useSocialAuth } from "@/hooks/use-social-auth";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Image } from "expo-image";
import { useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Notice = { title: string; message: string };

/** Custom welcome screen backed by Clerk browser-based OAuth. */
export function AuthScreen() {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [notice, setNotice] = useState<Notice | null>(null);
  // Keep style props as objects/arrays: the native CSS interop path drops
  // Pressable style callbacks in this setup, including the base button layout.
  const [pressedButton, setPressedButton] = useState<"Google" | "Apple" | "dismiss" | null>(null);
  const scale = Math.min(width, 480) / 393;
  const compact = height / width < 1.95;
  const spacing = compact ? 0.7 : 1;
  const logoScale = scale * (compact ? 0.84 : 1);
  const titleScale = scale * (compact ? 0.94 : 1);
  const heroHeight = Math.min(height * (compact ? 0.34 : 0.39), 342 * scale);

  const { signIn, pending, error, ready, needsCompletion, completeSignIn } = useSocialAuth();

  return (
    <View className="flex-1 bg-canvas">
      <ScrollView bounces={false} showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
        <View className="w-full self-center" style={{ maxWidth: 480, minHeight: height, paddingBottom: Math.max(insets.bottom, 22) }}>
          <View style={{ position: "absolute", width: 360 * scale, height: 360 * scale, right: -190 * scale, top: heroHeight - 150 * scale, opacity: 0.09, pointerEvents: "none" }}>
            <Image accessible={false} source={require("../../../assets/images/logo-glow.png")} style={StyleSheet.absoluteFill} />
          </View>
          <View accessible={false} style={{ height: heroHeight, overflow: "hidden", backgroundColor: "#f1f7ff", pointerEvents: "none" }}>
            {/* Anchor the full image to its bottom so short phones retain the white fade. */}
            <Image source={require("../../../assets/images/auth-hero.png")} contentFit="contain" style={{ position: "absolute", bottom: 0, width: "100%", aspectRatio: 1364 / 1153, opacity: 0.88 }} />
          </View>
          <View className="items-center" style={{ marginTop: -40 * scale }}>
            <View style={{ width: 120 * logoScale, height: 112 * logoScale, overflow: "hidden" }}>
              <Image accessible={false} source={require("../../../assets/images/auth-camera.png")} contentFit="fill" style={{ width: 180 * logoScale, height: 164.5 * logoScale, left: -30 * logoScale, top: -22.6 * logoScale }} />
            </View>
            <Text className="font-bold text-ink text-center" style={{ fontSize: 39 * titleScale, lineHeight: 49 * titleScale, letterSpacing: -1.8 * scale, marginTop: 8 * scale }}>Codexgram</Text>
          </View>
          <View className="items-center px-5" style={{ marginTop: 27 * scale * spacing }}>
            <Text accessibilityRole="header" className="font-bold text-ink text-center" style={{ fontSize: 33 * titleScale, lineHeight: 36 * titleScale, letterSpacing: -1.35 * scale }}>
              Share moments{"\n"}with your people.
            </Text>
          </View>
          <View style={{ paddingHorizontal: 24 * scale, marginTop: 35 * scale * spacing, gap: 12 * scale }}>
            <Pressable accessibilityRole="button" accessibilityLabel="Continue with Google" disabled={!!pending || !ready} accessibilityState={{ disabled: !!pending || !ready, busy: pending === "Google" }} onPress={() => void signIn("Google")} onPressIn={() => setPressedButton("Google")} onPressOut={() => setPressedButton(null)} style={[styles.button, { minHeight: 60 * scale, borderRadius: 19 * scale, backgroundColor: pressedButton === "Google" ? "#edf2ff" : "#ffffff" }]}>
              <Image accessible={false} source={require("../../../assets/images/google-logo.png")} contentFit="contain" style={{ width: 27 * scale, height: 27 * scale }} />
              <Text className="font-semibold text-ink" style={{ fontSize: 17 * scale, flexShrink: 1 }}>{pending === "Google" ? "Connecting?" : "Continue with Google"}</Text>
            </Pressable>
            <Pressable accessibilityRole="button" accessibilityLabel="Continue with Apple" disabled={!!pending || !ready} accessibilityState={{ disabled: !!pending || !ready, busy: pending === "Apple" }} onPress={() => void signIn("Apple")} onPressIn={() => setPressedButton("Apple")} onPressOut={() => setPressedButton(null)} style={[styles.button, { minHeight: 60 * scale, borderRadius: 19 * scale, backgroundColor: pressedButton === "Apple" ? "#393a40" : "#202124", borderColor: "#303136" }]}>
              <FontAwesome name="apple" size={28 * scale} color="#ffffff" accessible={false} />
              <Text className="font-semibold text-white" style={{ fontSize: 17 * scale, flexShrink: 1 }}>{pending === "Apple" ? "Connecting?" : "Continue with Apple"}</Text>
            </Pressable>
          </View>
          {error && <View className="mx-6 mt-4 rounded-2xl bg-red-50 p-4">
            <Text accessibilityRole="alert" className="font-regular text-red-700 text-center">{error}</Text>
            {needsCompletion && <Pressable accessibilityRole="button" disabled={!!pending} onPress={() => void completeSignIn()} className="mt-3 items-center rounded-xl bg-ink p-3">
              <Text className="font-semibold text-white">{pending === "completion" ? "Connecting?" : "Finish sign-in securely"}</Text>
            </Pressable>}
          </View>}
          <View className="items-center px-6" style={{ marginTop: 25 * scale * spacing, paddingBottom: 18, flexGrow: 1, justifyContent: "flex-end" }}>
            <Text className="font-regular text-muted text-center" style={{ fontSize: 11.5 * scale, lineHeight: 17 * scale }}>By continuing, you agree to our</Text>
            <View className="flex-row flex-wrap items-center justify-center">
              <Pressable accessibilityRole="link" hitSlop={8} onPress={() => setNotice({ title: "Terms of Service", message: "Codexgram's Terms of Service is not published yet. Please contact the app owner for the current terms before using the private pilot." })}>
                <Text className="font-regular text-link" style={{ fontSize: 12 * scale, lineHeight: 19 * scale }}>Terms of Service</Text>
              </Pressable>
              <Text className="font-regular text-muted" style={{ fontSize: 12 * scale }}> and </Text>
              <Pressable accessibilityRole="link" hitSlop={8} onPress={() => setNotice({ title: "Privacy Policy", message: "Codexgram's Privacy Policy is not published yet. Please contact the app owner for the current terms before using the private pilot." })}>
                <Text className="font-regular text-link" style={{ fontSize: 12 * scale, lineHeight: 19 * scale }}>Privacy Policy.</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
      <Modal visible={notice !== null} transparent animationType="fade" onRequestClose={() => setNotice(null)}>
        <View className="flex-1 items-center justify-center px-6" style={{ backgroundColor: "rgba(8,9,19,0.35)" }}>
          <View accessibilityViewIsModal className="w-full max-w-sm rounded-3xl bg-white p-6" style={{ maxHeight: height - insets.top - insets.bottom - 48 }}>
            <ScrollView>
              <Text accessibilityRole="header" className="font-bold text-ink text-xl">{notice?.title}</Text>
              <Text className="font-regular text-muted mt-3 text-base leading-6">{notice?.message}</Text>
              <Pressable accessibilityRole="button" onPress={() => setNotice(null)} onPressIn={() => setPressedButton("dismiss")} onPressOut={() => setPressedButton(null)} className="mt-6 items-center rounded-2xl bg-ink p-4" style={{ opacity: pressedButton === "dismiss" ? 0.7 : 1 }}>
                <Text className="font-semibold text-white text-base">Got it</Text>
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 20,
    paddingVertical: 14, paddingHorizontal: 16, borderWidth: 1, borderColor: "#e9ebf0",
    boxShadow: "0px 12px 25px rgba(48, 73, 111, 0.10)",
  },
});
