import { ActivityIndicator, Text, View } from "react-native";

export function AuthLoading() {
  return <View className="flex-1 items-center justify-center bg-canvas px-6">
    <ActivityIndicator size="large" color="#2865ff" />
    <Text className="mt-4 font-regular text-muted">Loading your account…</Text>
  </View>;
}
